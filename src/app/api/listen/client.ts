// Singleton object for storing how many invalidating server actions were called. 
// We send this to the client Listener component to check if a client-side router reload is needed to refresh the data
export const updateObject = {
  update: 0,
}
