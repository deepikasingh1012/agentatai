import axios from "axios";
import { getClientId } from '../services/Service'; // adjust path if needed

// const BASE_URL = "https://ataichatbot.mcndhanore.co.in/atai-api/public/api";
  // const BASE_URL = "https://api.ataibot.in/public/api";
  const BASE_URL ="https://api.ataichatbot.mcndhanore.co.in/public/api";

// const fetchData = async (method, url, data = {}) => {
//     try {
//       const response = await axios({ method, url: `${BASE_URL}${url}`, data });
//       return response.data;
//     } catch (error) {
//       console.error("Error:", error);
  
      
//       const errorMessage =
//         error.response?.data?.message || error.message || "Something went wrong!";
  
//       throw new Error(errorMessage);
//     }
//   };



export const getRecentInquiries = async (clientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/client/${clientId}/recent-inquiries`);
    
    if (response && response.data) {
      return {
        success: true,
        clientId: response.data.client_id,
        newInquiriesCount: response.data.new_inquiries_count,
        recentInquiries: response.data.recent_inquiries
      };
    } else {
      console.error("Unexpected response format from recent-inquiries API:", response);
      return { success: false, newInquiriesCount: 0, recentInquiries: [] };
    }

  } catch (error) {
    console.error(`Error fetching recent inquiries for client ${clientId}:`, error);
    return { success: false, newInquiriesCount: 0, recentInquiries: [] };
  }
};


  export const getInquiryStatusCount = async () => {
   const clientId = sessionStorage.getItem("clientId");

 // or get it from user context
    const response = await axios.get(`${BASE_URL}/inquiry/status-count/${clientId}`);
    return response.data;
  };

  export const fetchQuestions = async (clientId) => { // ✅ Now accepts clientId dynamically
    if (!clientId) throw new Error("Client ID is missing.");
  
    try {
      const response = await axios.get(`${BASE_URL}/get-questions`, {
        params: { client_id: clientId }, // ✅ Uses the latest clientId
      });
      return response.data || { questions: [] };
    } catch (error) {
      console.error("Error fetching questions:", error.response?.data || error.message);
      return { questions: [] };
    }
  };
  
  
  // ✅ Fetch & Format Data for Drag & Drop
  export const getQuestions = async () => {
    const clientId = getClientId();
    if (!clientId) throw new Error("Client ID is missing.");
  
    try {
      const response = await axios.get(`${BASE_URL}/get-questions`, { 
        params: { client_id: clientId } 
      });
      return response.data.questions;
    } catch (error) {
      console.error("Error fetching questions:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // ✅ Send a new question to API
  export const sendQuestionsToAPI = async (questionData) => {
    const clientId = getClientId();
    if (!clientId) throw new Error("Client ID is missing.");
  
    try {
      const response = await axios.post(`${BASE_URL}/manage-question`, 
        { ...questionData, client_id: clientId }, 
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending question:", error.response?.data || error.message);
      throw error;
    }
  };

  export const deleteQuestion = async (questionData) => {
    const { p_id, p_question_text, p_client_id } = questionData;
  
    if (!p_id) throw new Error("Question ID is missing.");
    if (!p_client_id) throw new Error("Client ID is missing.");
    if (!p_question_text) questionData.p_question_text = "No Text Available"; // ✅ Ensure it is not undefined
  
    try {
      console.log("📤 Sending DELETE request for ID:", p_id);
  
      const response = await axios.delete(`${BASE_URL}/delete-question`, {
        data: {
          action_type: "D",
          ...questionData,
        },
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("✅ Delete API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting question:", error.response?.data || error.message);
      throw error;
    }
  };
  
  
  
  
  export const updateQuestion = async (questionData) => {
    const clientId = getClientId();
    if (!clientId) throw new Error("Client ID is missing.");
  
    try {
      // ✅ Ensure each question has a `p_id`
      const validQuestions = questionData.questions.map((question) => ({
        ...question,
        p_id: question.p_id || question.questionId, // Ensure `p_id` exists
      }));
  
      console.log("Sending Update Request:", validQuestions);
  
      const response = await axios.put(`${BASE_URL}/update-question`, 
        { questions: validQuestions, client_id: clientId }, // ✅ Correct payload
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Update Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating question:", error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Add new staff member
export const addStaff = async (staffData) => {
    try {
      const response = await axios.post(`${BASE_URL}/manage-user`, staffData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error adding staff:", error.response?.data || error.message);
      throw error;
    }
  };
  
  
  export const getStaff = async () => {
    const clientId = getClientId();
    if (!clientId) throw new Error("Client ID is missing.");
  
    try {
      const response = await axios.get(`${BASE_URL}/manage-user`, {
        params: { p_ClientId: clientId }, 
      });
  
      console.log("✅ Fetched Staff for Client ID:", clientId, response.data);
  
      return response.data; // ✅ Ensuring the correct data structure is returned
    } catch (error) {
      console.error("❌ Error fetching staff:", error.response?.data || error.message);
      return { data: [] }; // ✅ Ensure response structure remains consistent
    }
  };
  
  export const softDeleteStaff = async (userId) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/soft-delete`, {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error("Error in soft delete:", error.response?.data || error.message);
      throw error;
    }
  };
  
  
  
  
  
  
  // ✅ Update staff member (PUT API)
  export const updateStaff = async (staffData) => {
    try {
      const response = await axios.put(`${BASE_URL}/manage-user`, staffData, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("✅ Staff updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating staff:", error.response?.data || error.message);
      throw error;
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


  // for chatbot 

 

export const fetchAllClients = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/clients`);
    return response.data?.data || []; // ✅ Extract the actual array
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};


export const getClientContactNumber = async (clientId) => {
  try {
    const clients = await fetchAllClients();
    const client = clients.find((c) => String(c.id) === String(clientId));
    return client?.ContactNumber || "8421924019";
  } catch (error) {
    console.error("Error getting client contact number:", error);
    return "8421924019";
  }
};

 