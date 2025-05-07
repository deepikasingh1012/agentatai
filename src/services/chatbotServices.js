
import axios from "axios";

import { getClientId } from '../services/Service';
const API_URL = "https://ataichatbot.mcndhanore.co.in/atai-api/";





export const initRecordingConversation = async (sessionId) => {
    try {
        console.log("🟢 Starting API call to initialize recording...");
        console.log("🔹 Payload Sent:", { user_id: sessionId });

        const response = await axios.post(
            `${API_URL}/public/api/init_recording_conversation`,
            { user_id: sessionId },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("✅ Recording initialized successfully:", response.data);
        return response.data;
    } catch (error) {
        console.log("Error", error);
        // console.error("❌ Error initializing recording:");
        // console.error("🔹 Request Config:", error.config);
        // console.error("🔹 Response Data:", error.response?.data || "No response data");
        // console.error("🔹 Full Error Details:", error.toJSON ? error.toJSON() : error);
        throw error;
    }
};


export const fetchQuestions = async () => {
    try {
        const clientId = getClientId();
        const response = await axios.get(`${API_URL}/public/api/get-questions`, {
            params: { client_id: clientId },
        });
        console.log("Fetched Questions:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching questions:", error.response?.data || error.message);
        throw error;
    }
};

export const submitCallbackPreference = async (sessionId, preference) => {
    try {
        const response = await axios.post(`${API_URL}/public/api/submit_callback_preference`, {
            user_id: sessionId,
            message: preference,
        });

        return response.data;
    } catch (error) {
        console.error("Error submitting callback preference:", error);
        return { message: "An error occurred. Please try again." };
    }
};



export const submitInquiry = async (inquiryData) => {
    try {
        const response = await axios.post(
            `${API_URL}/public/api/manage-inquiry`,
            inquiryData,
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("✅ Inquiry submitted:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error submitting inquiry:", error.response?.data || error.message);
        return { message: "Failed to submit inquiry." };
    }
};


// export const sendUserDetailsToBackend = async (sessionId, details) => {
//     if (!sessionId || !details?.userName || !details?.userContact || !details?.userEmail) {
//         console.error("🚨 Missing required fields:", details);
//         return { message: "Invalid user details." };
//     }

//     const requestBody = {
//         user_id: sessionId,  // Pass sessionId as user_id
//         message: `${details.userName}, ${details.userContact}, ${details.userEmail}`  // Concatenate details in message
//     };

//     console.log("✅ Sending Data to Backend:", requestBody);

//     try {
//         const response = await axios.post(`${API_URL}/public/api/submit_details`, requestBody);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error submitting user details:", error.response?.data || error.message);

//         // 🔥 Check if the issue is a 404 error
//         if (error.response?.status === 404) {
//             console.error("❌ API Endpoint Not Found: Check if the route exists in Laravel.");
//         }

//         return { message: "An error occurred. Please try again." };
//     }
// };


export const submitUserQueryToBackend = async (sessionId, query, userDetails) => {
    if (!sessionId || !query || !userDetails?.userName || !userDetails?.userContact || !userDetails?.userEmail) {
        console.error("🚨 Missing required fields:", { sessionId, query, userDetails });
        return { message: "Invalid query data. Please submit your details first." };
    }

    const requestBody = {
        user_id: sessionId,
        message: `${userDetails.userName}, ${userDetails.userContact}, ${userDetails.userEmail}`,
        user_query: query,  // ✅ Send user_query along with user details
    };

    console.log("✅ Sending Query to Backend:", requestBody);

    try {
        const response = await axios.post(`${API_URL}/public/api/submit_details`, requestBody);
        console.log("response message", response.data)
        return response.data;

    } catch (error) {
        console.error("❌ Error submitting user query:", error.response?.data || error.message);
        return { message: error.response?.data?.message || "An error occurred while submitting the query." };
    }
};



export const submitUserRating = async (sessionId, rating) => {
    try {
        const response = await axios.post(`${API_URL}/public/api/submit_satisfaction`, {
            user_id: sessionId,
            message: rating,
        });

        console.log("📩 Rating API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to submit rating:", error.response?.data || error.message);
        return { message: "❌ Failed to submit rating. Please try again." };
    }
};

export const terminateChat = async (sessionId) => {
    try {
        console.log("🔄 Calling terminate API with sessionId:", sessionId);
        const response = await axios.post(`${API_URL}/public/api/terminate`, { user_id: sessionId });
        console.log("✅ Terminate API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in terminateChat:", error.response?.data || error.message);
        throw error;
    }
};





export const handleTerminateResponse = async (sessionId, userMessage) => {
    const clientId = getClientId();
    if (!sessionId || typeof sessionId !== "string" || sessionId.trim() === "") {
        console.error("❌ Invalid session ID provided:", sessionId);
        throw new Error("Invalid session ID provided for terminate_response API.");
    }

    if (!userMessage || (userMessage !== "Yes" && userMessage !== "No")) {
        console.error("❌ Invalid user response provided:", userMessage);
        throw new Error("Invalid response provided for terminate_response API.");
    }

    try {
        const payload = {
            user_id: sessionId,
            message: userMessage.trim(),
            client_id: clientId,
        };
        console.log("🔄 Sending payload to terminate_response API:", payload);

        const response = await axios.post(`${API_URL}/public/api/terminate_response`, payload);

        console.log("✅ Terminate Response API Response:", response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("❌ Backend Error in handleTerminateResponse:", error.response.data);
            throw error.response.data;
        } else {
            console.error("❌ Unexpected Error in handleTerminateResponse:", error.message);
            throw new Error("Network error or unexpected issue occurred while calling terminate_response API.");
        }
    }
};



// export const sendDataToDatabase = async (sessionId, selectedOptionText) => {
//     if (!sessionId || typeof sessionId !== "string") {
//         console.error("❌ Invalid session ID:", sessionId);
//         return;
//     }

//     if (!selectedOptionText || typeof selectedOptionText !== "string") {
//         console.error("❌ Invalid selected option text:", selectedOptionText);
//         return;
//     }

//     try {
//         const payload = {
//             user_id: sessionId,
//             selected_option: selectedOptionText // only storing sessionId and Last selected Text(option)
//         };

//         console.log("🔄 Sending payload to database:", payload);

//         const response = await axios.post("https://dev-atai-api.raghavsolars.com/public/api/storeData", payload); // Replace with the actual API endpoint
//         console.log("✅ Data successfully stored in database:", response.data);
//     } catch (error) {
//         console.error("❌ Error storing data to database:", error.response?.data || error.message);


//         if (error.response) {
//             console.log("📌 Backend Response Status:", error.response.status);
//             console.log("📌 Backend Response Data:", error.response.data);
//             console.log("📌 Backend Response Headers:", error.response.headers);
//         }

//     }
// };