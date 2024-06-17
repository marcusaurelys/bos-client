import { updateTicket } from "@/db/tickets";

export async function PATCH(request: Request) {
    try {
        const ticketId = request.url.split('tickets/')[1];
        const params = await request.json();

        updateTicket(ticketId, params);

        // Create a new Response object with the JSON string
        return new Response(JSON.stringify({ message: 'Edited successfully.' }), {
            status: 200, // HTTP status code
            headers: {
                'Content-Type': 'application/json' // Indicating the type of response
            }
        });
    } catch (error) {
        // Handle any potential errors
        return new Response(JSON.stringify({ error: 'An error occurred while updating ticket.' }), {
            status: 500, // HTTP status code for server error
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}