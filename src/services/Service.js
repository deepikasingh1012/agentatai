import axios from "axios";



const BASE_URL = "https://dev-atai-api.raghavsolars.com/public/api";

export const getClientId = () => localStorage.getItem("clientId");



// ✅ Check if client ID is valid
export const checkClientId = async (clientId) => {
  try {
    console.log("Sending request to validate client ID:", clientId);

    const response = await axios.post(`${BASE_URL}/check-client`, { client_id: clientId });

    console.log("Client ID validation response:", response.data);

    return response.data.message === "Client exists"; // Ensure API response is handled correctly
  } catch (error) {
    console.error("Error checking client ID:", error.response?.data || error.message);
    return false; // Return false on error
  }
};

// ✅ Send client ID to API after login (for confirmation)
export const sendClientIdToAPI = async (clientId) => {
  try {
    console.log("Sending Client ID to API after login:", clientId);

    const response = await axios.post(`${BASE_URL}/check-client`, { client_id: clientId });

    console.log("API Response after login:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending client ID to API:", error.response?.data || error.message);
    throw error;
  }
};