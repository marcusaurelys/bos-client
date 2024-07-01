from dotenv import load_dotenv
from flask import Flask, request, jsonify
import chromadb
import requests
import json
import os

load_dotenv()
API_URL = os.getenv('API_URL')
API_KEY = os.getenv('API_KEY')

chroma_client = chromadb.HttpClient(host='chromadb', port=8000)
collection = chroma_client.get_or_create_collection(name="problems_statements")

collection.add(
    documents=[
        "The user was unable to start their server because the system indicated that the disk space was full, despite the user having paid for a month of service.",
        "The user was unable to connect to their server despite it showing as live on the dashboard and attempts to restart it and connect directly via IP address/port failed.",
        "The user wanted to know whether he/she can host a server to play with friends, incorporating mods and a prebuilt world."
    ],
    metadatas=[
        {"solution": "The developer resolved the issue by upgrading the user's disk space to 10GB, ensuring the server could go online. Additionally, the developer advised the user to monitor the world file size to prevent future disk space issues, particularly if the server is heavily modded."},
        {"solution": "The developer identified that the server had hit its storage limit and increased the storage, allowing the server to boot properly. The developer also advised the user to use the forgot password feature to resolve login issues with the Hostari panel."},
        {"solution": "The operator confirmed that this setup was feasible with a paid subscription. They explained that for servers in US Central, users could utilize the VSH Dashboard for easier modding, while servers outside US Central would require manual modding through the Hostari Panel or other FTP methods. The user expressed satisfaction and thanks for the information provided."} 
    ],
    ids=["session_f706aa8f-e547-4ce6-85c0-04d515cd933a", "session_c1f948fe-7aa3-414d-8fe8-1a8623ec7a31", "session_cfe4f36b-9934-4ea5-a6d2-405a94549e68"]
)

app = Flask(__name__)

def get_inference(prompt):

    url = f"{API_URL}"
    headers = {
        "x-api-key": f"{API_KEY}",
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

@app.route('/api/greet', methods=['POST'])
def greet():
    data = request.get_json()
    name = data.get('name', 'World')
    return jsonify(message=f'Hello, {name}!')

@app.route('/api/query', methods=['POST'])
def query():
    data = request.form.get('query_text')
    results = collection.query(
        query_texts=[data],
        n_results=2
    )
    return jsonify(results)

@app.route('/api/addDB', methods=['POST'])
def addDB():
    problem = request.form.get('problem_statement')
    solution = request.form.get('solution_statement')
    session_id = request.form.get('session_id')
    collection.add(
        documents=[problem],
        metadatas=[{"solution": solution}],
        ids=[session_id]
    )
    return jsonify(message='Document added successfully!')

@app.route('/api/getInitialResponse', methods=['POST'])
def getResponse():
    initial_statement = request.form.get('chat_logs').partition('\n')[0][6:]
    # prev_data = request.form.get('prev_data')
    # initial_statement = request.form.get('initial_statement')
    chat_logs = request.form.get('chat_logs')
    results = collection.query(
             query_texts=[initial_statement],
             n_results=2
    )

    #format results into a prompt that can be fed into the llm
    prompt = f"""[INST]Your name is boris and you are a helpful and intelligent assistant that responds to users questions about hostari (a company where you can rent out servers to play with your friends). I have provided you with related past problems that has been solved by a developer in the company. You may or may not use this problem to solve the users problem. You can also ask the user for more information if necessary. If the problem still can't be solved, respond with "CAN'T SOLVE". If the user asks for a real person respond with "CAN'T SOLVE". Thanks![/INST]
    
    solved problem 1: {results['documents'][0][0]}
    solution 1: {results['metadatas'][0][0]['solution']}
    solved problem 2: {results['documents'][0][1]}
    solution 2: {results['metadatas'][0][1]['solution']}

    {chat_logs}
    Assitant:"""

    response = get_inference(prompt)

    return jsonify(response)
    #Ask llm for the initial response
    #ask can you solve this problem given the previous problems and solutions?
    #Respond to the user if you can, you can also ask for more information. If you can't solve this problem further, respond with CAN'T SOLVE.
    #if CANT SOLVE, ping developer
    #ci test
    
# TODO: add delete entry
if __name__ == '__main__':
    app.run(port = 5000)
