import { getAllUsers } from "@/db/users";

export async function GET(request: Request) {
    try {
        const res = await getAllUsers();
        const users = await res.toArray();

        // Create a new Response object with the JSON string
        return new Response(JSON.stringify(users), {
            status: 200, // HTTP status code
            headers: {
                'Content-Type': 'application/json' // Indicating the type of response
            }
        });
    } catch (error) {
        // Handle any potential errors
        return new Response(JSON.stringify({ error: 'An error occurred while fetching users.' }), {
            status: 500, // HTTP status code for server error
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}