import axios from "axios";
import { getClientId } from "../services/Service";

const BASE_URL = "https://ataichatbot.mcndhanore.co.in/atai-api/public/api";

// set your clientId here

const clientId = getClientId();
const fetchData = async (method, url, data = {}) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);

    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong!";

    throw new Error(errorMessage);
  }
};

// 🎯 Inquiry Status Count
export const getInquiryStatusCount = async () => {
  const clientId = localStorage.getItem("clientId");
  try {
    const response = await axios.get(
      `${BASE_URL}/inquiry/status-count/${clientId}`
    );
    return response.data; // will return { success, total_count, data: [...] }
  } catch (error) {
    console.error("Error fetching inquiry status count:", error);
    throw error;
  }
};

export const getCallbackRequests = () =>
  fetchData("GET", "/tickets/all_callback_requests");

// ✅ Verify user credentials (Uses email as username)
export const verifyUserCredentials = async (credentials) => {
  const clientId = localStorage.getItem("clientId");
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required!");
  }

  // console.log("Sending Login Request with:", credentials.email);

  return fetchData("POST", "/verify-user-credentials", {
    email: credentials.email,
    password: credentials.password,
  });
};

export const getInquiryByClientId = async (
  clientId,
  page = 1,
  pageSize = 10
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inquiries/${clientId}?page=${page}&page_size=${pageSize}`
    );

    // Check if response is valid and contains the expected data
    if (response && response.data && response.data.status) {
      return response.data; // structure: { status, message, data: [...] }
    } else {
      console.error("Invalid response data:", response);
      return { status: false, data: [] };
    }
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return { status: false, data: [] };
  }
};

export const updateInquiry = async ({
  p_id,
  p_status,
  p_agent_remarks,
  p_Next_followup,
}) => {
  try {
    const response = await axios.put(`${BASE_URL}/update-inquiry`, {
      p_id,
      p_status,
      p_agent_remarks,
      p_Next_followup,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating inquiry:", error);
    throw error;
  }
};

export const getUserInquiry = async (userId, clientId) => {
  try {
    const trimmedUserId = userId.includes("-")
      ? userId.split("-").pop()
      : userId;

    const response = await axios.get(`${BASE_URL}/user-inquiry`, {
      params: {
        user_id: trimmedUserId,
        client_id: clientId,
      },
    });

    if (response.data?.status === "success") {
      const inquiry = response.data.data;
      return {
        success: true,
        id: inquiry.id,
        User_id: inquiry.User_id,
        clientName: inquiry.client_name, // fixed typo: Client_name → client_name
        contact: inquiry.contact,
        email: inquiry.email,
        created_at: inquiry.created_at,
        updated_at: inquiry.updated_at,
        Next_followup: inquiry.p_Next_followup,
        agent_remarks: inquiry.p_agent_remarks,
        status_code: inquiry.p_status,
        lastQuestion: {
          id: inquiry.last_question?.id || null,
          text: inquiry.last_question?.text || "",
        },
      };
    } else {
      return { success: false, data: null };
    }
  } catch (error) {
    console.error(
      `Error fetching user inquiry for user_id: ${userId} and client_id: ${clientId}`,
      error
    );
    return { success: false, data: null };
  }
};

export const getRecentInquiries = async (clientId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/client/${clientId}/recent-inquiries`
    );

    if (response && response.data) {
      return {
        success: true,
        clientId: response.data.client_id,
        newInquiriesCount: response.data.new_inquiries_count,
        recentInquiries: response.data.recent_inquiries,
      };
    } else {
      console.error(
        "Unexpected response format from recent-inquiries API:",
        response
      );
      return { success: false, newInquiriesCount: 0, recentInquiries: [] };
    }
  } catch (error) {
    console.error(
      `Error fetching recent inquiries for client ${clientId}:`,
      error
    );
    return { success: false, newInquiriesCount: 0, recentInquiries: [] };
  }
};
