from flask import Flask, request, jsonify
import chromadb
import requests
import json
import re
import os
from dotenv import load_dotenv
from openai import OpenAI
import chromadb.utils.embedding_functions as embedding_functions


load_dotenv()
openAI_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

chroma_client = chromadb.HttpClient(host='chromadb', port=8000)
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
                api_key=os.getenv('OPENAI_API_KEY'),
                model_name="text-embedding-3-small"
            )
collection = chroma_client.get_or_create_collection(name="problems_statements", embedding_function=openai_ef)

app = Flask(__name__)

def summarize_chat_logs(chat_logs):
    #check if chat logs has 'type': 'image/png'}; if yes pass to chatgpt API, if no pass to llama 3.1
    jpegs = '"type": "image/png"'   
    pngs = '"type": "image/jpeg"'

    content = []

    if jpegs in chat_logs or pngs in chat_logs:
        #pass to chatgpt API; properly format teh images in the chat logs
        for line in chat_logs.split('\n'):
            if jpegs in line or pngs in line:
                url_pattern = r'"url": "([^"]+)"'
                
                # Search for the pattern in the text
                match = re.search(url_pattern, line)
                
                if match:
                    # Extract the matched substring
                    image_url = match.group(1)
                    content.append({
                        "type": "image_url",
                        "image_url": {
                            "url": image_url
                        }
                    })
                else:
                    content.append({
                        "type": "text",
                        "text": line
                    })
            else:
                content.append({
                    "type": "text",
                    "text": line
                })
        
    else:
        #pass to llama 3.1
        content = []
        content.append({
            "type": "text",
            "text": chat_logs
        })


    response = openAI_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
            "role": "system",
            "content": [
                {
                "type": "text",
                "text": "You are an intelligent bot the summarizes a chat log between a user and a developer. Your job is to summarize the given text (that has an image component) to a problem statement (summary of the problem) and a solution of the problem (how the problem was solved).  Keep the summaries as detailed as possible. Thanks!"
                }
            ]
            },
            {
            "role": "user",
            "content": content
            }
        ],
        temperature=1,
        max_tokens=512,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        tools=[
            {
            "type": "function",
            "function": {
                "name": "chat_summary",
                "description": "Summarize the chat to a problem statement and solution statement. Keep the summaries as detailed as possible which means that it's okay if the response/summary is long. ",
                "parameters": {
                "type": "object",
                "properties": {
                    "problem_statement": {
                    "type": "string",
                    "description": "The problem statement of the chat logs"
                    },
                    "solution_statement": {
                    "type": "string",
                    "description": "How the problem was solved"
                    }
                },
                "required": [
                    "problem_statement"
                ]
                }
            }
            }
        ],
        tool_choice={"type": "function", "function": {"name": "chat_summary"}},
    )

    return response


def get_inference(prompt):

    url = "https://duv4ldjqy4.execute-api.us-east-1.amazonaws.com/dev-phase"
    headers = {
        "x-api-key": os.getenv('AWS_API_KEY'),
        "Content-Type": "application/json"
    }
    body = json.dumps({"prompt": prompt, })
    response = requests.request("POST", url, headers=headers, data=body)
    if response.status_code == 200:
        return response.json()
    else:
        return {"response": f"Error {response.status_code}: {response.text}"}

@app.route('/')
def home():
    return "Welcome to My Simple Flask App!"

@app.route('/api/inference', methods=['POST'])
def getResponse():
    initial_statement = request.form.get('chat_logs').partition('\n')[0][6:]
    # prev_data = request.form.get('prev_data')
    # initial_statement = request.form.get('initial_statement')
    chat_logs = request.form.get('chat_logs')
    results = collection.query(
             query_texts=[initial_statement],
             n_results=3
    )

    #TODO: improve inference
    #format results into a prompt that can be fed into the llm
    prompt = f"""[INST]Your name is Boris and you are a helpful and intelligent assistant that responds to a developer/employee's questions about Hostari (a company where you can rent out servers to play with your friends). I have provided you with related past problems that has been solved by a developer in the company. You may or may not use this to help the developer/employee's craft a response/solve the problem. Thanks![/INST]
    
    solved problem 1: {results['documents'][0][0]}
    solution 1: {results['metadatas'][0][0]['solution']}
    solved problem 2: {results['documents'][0][1]}
    solution 2: {results['metadatas'][0][1]['solution']}

    {chat_logs}
    Assistant:"""

    response = get_inference(prompt)

    return jsonify(response)
    
    # Ask llm for the initial response
    # Ask can you solve this problem given the previous problems and solutions?
    # Respond to the user if you can, you can also ask for more information. If you can't solve this problem further, respond with CAN'T SOLVE.
    # If CAN'T SOLVE, ping developer

@app.route('/api/betterInference', methods=['POST'])
def getBetterResponse():
    chat_logs = request.form.get('chat_logs')
    problem_statement = request.form.get('problem_statement')

    #check if problem statement is empty; if yes, return a bad request
    if problem_statement == "" or problem_statement == None:
        return jsonify({"response": "Bad Request"})
    

    chat_logs = request.form.get('chat_logs')
    results = collection.query(
             query_texts=[problem_statement],
             n_results=3
    )

    #format results into a prompt that can be fed into the llm
    prompt = f"""[INST]Your name is Boris and you are a helpful and intelligent assistant that responds to a developer/employee's questions about Hostari (a company where you can rent out servers to play with your friends). I have provided you with related past problems that has been solved by a developer in the company. You may or may not use this to help the developer/employee's craft a response/solve the problem. Thanks![/INST]
    
    solved problem 1: {results['documents'][0][0]}
    solution 1: {results['metadatas'][0][0]['solution_statement']}
    solved problem 2: {results['documents'][0][1]}
    solution 2: {results['metadatas'][0][1]['solution_statement']}
    solved problem 3: {results['documents'][0][2]}
    solution 3: {results['metadatas'][0][2]['solution_statement']}

    {chat_logs}
    Assistant:"""

    response = get_inference(prompt)
    return jsonify(response)

@app.route('/api/getUserProblem', methods=['POST'])
def getUserProblem():
    chat_logs = request.form.get('chat_logs')
    response = summarize_chat_logs(chat_logs)
    
    reply_content = response.choices[0].message
    args = reply_content.to_dict()['tool_calls'][0]['function']['arguments']
    problem_statement = json.loads(args)['problem_statement']

    return jsonify({"problem_statement": problem_statement})

#route for passing the entire chat logs to the server and storing it in the vector db; this chatlog will automatically be summarized
@app.route('/api/storeChatLogs', methods=['POST'])
def storeChatLogs():
    chat_logs = request.form.get('chat_logs')
    sessionID = request.form.get('sessionID')

    response = summarize_chat_logs(chat_logs)
    
    reply_content = response.choices[0].message
    args = reply_content.to_dict()['tool_calls'][0]['function']['arguments']
    problem_statement = json.loads(args)['problem_statement'] 
    solution_statement = json.loads(args)['solution_statement']

    #store the chat logs in the vector db
    collection.upsert(
        documents=[problem_statement],
        metadatas=[json.loads(args)],
        ids=[sessionID]
    )

    #return success message
    return jsonify({"response": "Chat logs stored successfully!", "problem_statement": problem_statement, "solution_statement": solution_statement})
    


@app.route('/api/generateTicket', methods=['POST'])
def generateTicket():
    instruct = request.form.get('instruct')
    chat_logs = request.form.get('chat_logs')
    prompt = f"""{instruct}{chat_logs}"""

    print(prompt)
    response = get_inference(prompt)
    return jsonify(response)

# TODO: add delete entry    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
