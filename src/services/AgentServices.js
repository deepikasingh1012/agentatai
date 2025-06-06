import axios from "axios";
import { getClientId } from "../services/Service";

// const BASE_URL = "https://ataichatbot.mcndhanore.co.in/atai-api/public/api";
const BASE_URL ="https://api.ataichatbot.mcndhanore.co.in/public/api";
// const BASE_URL = "https://api.ataibot.in/public/api";

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
    return response.data; 
  } catch (error) {
    console.error("Error fetching inquiry status count:", error);
    throw error;
  }
};

export const getCallbackRequests = () =>
  fetchData("GET", "/tickets/all_callback_requests");


export const verifyUserCredentials = async (credentials) => {
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required!");
  }

  const response = await fetchData("POST", "/verify-user-credentials", {
    email: credentials.email,
    password: credentials.password,
  });

  if (response.status === "success" && response.data) {
    const { user_id, client_id, role, username, user_name, abbreviation } = response.data;

    // ✅ Store relevant data in localStorage
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("role", role);
    localStorage.setItem("email", username);
    localStorage.setItem("name", user_name);
    localStorage.setItem("abbreviation", abbreviation);
  }

  return response;
};


export const getInquiryByClientId = async (
  clientId,
  page = 1,
  page_size = 10
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inquiries/${clientId}?page=${page}&page_size=${page_size}`
    );

    // Check if response is valid and contains the expected data
    if (response && response.data && response.data.status) {
      return response.data; 
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
        Client_name: inquiry.Client_name, 
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

export const getOpenInquiries = async (clientId, page = 1, page_size = 10) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inquiries/Open`,
      {
        params: {
          client_id: clientId,
          page,
          page_size: page_size,
        },
      }
    );


    if (response && response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        totalCount: response.data.total_opn_count,
        dataCount: response.data.data_count,
        inquiries: response.data.data,
      };
    } else {
      console.error("Unexpected response structure:", response);
      return { success: false, inquiries: [] };
    }
  } catch (error) {
    console.error("Error fetching Open inquiries:", error);
    return { success: false, inquiries: [] };
  }
};
export const getInProgressInquiries = async (clientId, page = 1, page_size = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/inquiries/In-Progress`, {
      params: {
        client_id: clientId,
        page,
        page_size:page_size,
      },
    });

    if (response && response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        totalCount: response.data.total_inp_count,
        dataCount: response.data.data_count,
        inquiries: response.data.data,
      };
    } else {
      console.error("Unexpected response structure:", response);
      return { success: false, inquiries: [] };
    }
  } catch (error) {
    console.error("Error fetching In-Progress inquiries:", error);
    return { success: false, inquiries: [] };
  }
};
// ✅ Get No-Response Inquiries
export const getNoResponseInquiries = async (clientId, page = 1, page_size = 10) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inquiries/No-Response`,
      {
        params: {
          client_id: clientId,
          page,
          page_size: page_size,
        },
      }
    );


    if (response && response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        totalCount: response.data.total_cnr_count,
        dataCount: response.data.data_count,
        inquiries: response.data.data,
      };
    } else {
      console.error("Unexpected response structure (No-Response):", response);
      return { success: false, inquiries: [] };
    }
  } catch (error) {
    console.error("Error fetching No-Response inquiries:", error);
    return { success: false, inquiries: [] };
  }
};

// ✅ Get Resolved Inquiries
export const getResolvedInquiries = async (clientId, page = 1, page_size = 10) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inquiries/Resolved`,
      {
        params: {
          client_id: clientId,
          page,
          page_size: page_size,
        },
      }
    );

    if (response && response.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        totalCount: response.data.total_crs_count,
        dataCount: response.data.data_count,
        inquiries: response.data.data,
      };
    } else {
      console.error("Unexpected response structure (Resolved):", response);
      return { success: false, inquiries: [] };
    }
  } catch (error) {
    console.error("Error fetching Resolved inquiries:", error);
    return { success: false, inquiries: [] };
  }
};


export const fetchUserById = async (user_id) => {
  if (!user_id) {
    throw new Error("fetchUserById: userId must be provided");
  }

  try {
    // Send a GET to "/manage-user?p_user_id=…"
    const response = await axios.get(
      `${BASE_URL}/manage-user`,
      {
        params: { p_user_id: user_id },
        headers: { "Content-Type": "application/json" },
      }
    );

    const jsonData = response.data;
  
    if (
      jsonData.status === "success" &&
      Array.isArray(jsonData.data) &&
      jsonData.data.length > 0
    ) {
      return jsonData.data[0];
    } else {
      // If “data” is empty or status !== "success", return null
      return null;
    }
  } catch (err) {
    // Surface a clear error message if something goes wrong
    const message =
      err.response?.data?.message ||
      err.message ||
      "Error fetching user by ID";
    throw new Error(message);
  }
};


export const getInquiriesByDateRange = async (
  fromDate,
  toDate,
  clientId,
  page = 1,
  page_size = 10
) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-inquiries-by-client`, {
      params: {
        from_date: fromDate,
        to_date: toDate,
        client_id: clientId,
        page,
        page_size,
      },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inquiries by date:", error);
    return { status: false, data: [], total: 0 };
  }
};
export const getNotificationCount = async (clientId) => {
  if (!clientId) {
    return { success: false, newInquiriesCount: 0, recentInquiries: [] };
  }
  try {
    const { success, newInquiriesCount, recentInquiries } =
      await getRecentInquiries(clientId);
    if (success) {
      return { success, newInquiriesCount, recentInquiries };
    } else {
      return { success: false, newInquiriesCount: 0, recentInquiries: [] };
    }
  } catch (error) {
    console.error("Failed to fetch notification count:", error);
    return { success: false, newInquiriesCount: 0, recentInquiries: [] };
  }
};

export const getTodaysFollowups = async (clientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/followups/today/${clientId}`);

    if (response && response.data && Array.isArray(response.data)) {
      return {
        success: true,
        followups: response.data,
      };
    } else {
      console.error("Unexpected response structure (Today's Followups):", response);
      return { success: false, followups: [] };
    }
  } catch (error) {
    console.error("Error fetching today's followups:", error);
    return { success: false, followups: [] };
  }
};

