import axios from "axios";



// const BASE_URL = "https://ataichatbot.mcndhanore.co.in/atai-api/public/api";
const BASE_URL = "https://api.ataibot.in/public/api";

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

// ✅ Add new Client member
export const addClient = async (clientData) => {
  try {
    const response = await axios.post(`${BASE_URL}/insert-client`, clientData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error adding client:", error.response?.data || error.message);
    throw error;
  }
};

  
  
// ✅ Fetch all clients
export const getClient = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/clients`);
    console.log("✅ Fetched all clients:", response.data);
    return response.data; // return full response (status, message, data)
  } catch (error) {
    console.error("❌ Error fetching clients:", error.response?.data || error.message);
    return { status: 'error', message: 'Failed to fetch clients', data: [] };
  }
};



  
  
  
  
  
  
  // ✅ Update Client member (PUT API)
  export const updateClient = async (ClientData) => {
    try {
      const response = await axios.put(`${BASE_URL}/manage-user`, ClientData, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("✅ Client updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating Client:", error.response?.data || error.message);
      throw error;
    }
  };
  
// ✅ Delete Client
export const deleteClient = async (email) => {
  try {
    const response = await axios.delete(`${BASE_URL}/client`, { data: { email } });
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', error);
    return { status: 'error', message: error.message };
  }
};




  // ✅ Function to update user password
export const updatePassword = async (userId, newPassword, confirmPassword) => {
    try {
      const response = await axios.post(`${BASE_URL}/update-password`, {
        user_id: userId,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
  
      return response.data;
    } catch (error) {
      console.error("❌ Error updating password:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update password.");
    }
  };

 