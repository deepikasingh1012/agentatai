import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  updateInquiry,
  getUserInquiry,
  getInquiryByClientId,
} from "../../../services/AgentServices";
import {
  FaArrowLeft,
  FaClipboardList,
  FaComment,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faClock } from "@fortawesome/free-solid-svg-icons";

const UserConversation = () => {
  const [tickets, setTickets] = useState([]);
  const [inquiry, setInquiry] = useState(null);
  const [agentRemarks, setAgentRemarks] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [remarkError, setRemarkError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [followUpError, setFollowUpError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("user_id");
  console.log("🧾 Extracted userId:", userId);

  const statusOptions = [
    { code: "OPN", label: "Open" },
    {
      code: "INP",
      label: "In Progress, communication is going on with client.",
    },
    { code: "CRS", label: "Resolved and Closed" },
    { code: "CNR", label: "No Response from Client so Closed" },
  ];

  const [status, setStatus] = useState("");
  const clientId = localStorage.getItem("clientId");

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(location.search);
      const userIdFromURL = queryParams.get("user_id");

      if (!userIdFromURL) {
        setError("No user ID provided.");
        setLoading(false);
        return;
      }

      const page = 1;
      const pageSize = 10;

      const [inquiries, userInquiry] = await Promise.all([
        getInquiryByClientId(clientId, page, pageSize),
        getUserInquiry(userId, clientId),
      ]);

      setTickets(inquiries?.data || []);

      const inquiryData = inquiries?.data?.[0];

      if (inquiryData) {
        const mergedData = {
          id: inquiryData.id,
          Client_name: inquiryData.Client_name,
          contact: inquiryData.contact,
          email: inquiryData.email,
          created_at: inquiryData.created_at,
          updated_at: inquiryData.updated_at,
          last_question: inquiryData.last_question,
          conversation_duration: inquiryData.conversation_duration,
          User_id: inquiryData.User_id,
          Next_followup: inquiryData.Next_followup,
         
        };
console.log("inquiryData",inquiryData);
        if (userInquiry?.success) {
          mergedData.id = userInquiry.id || mergedData.id;
          mergedData.Client_name =
            userInquiry.clientName || mergedData.Client_name;
          mergedData.contact = userInquiry.contact || mergedData.contact;
          mergedData.email = userInquiry.email || mergedData.email;
          mergedData.last_question =
            userInquiry.lastQuestion || inquiryData.last_question;
          mergedData.conversation_duration =
            userInquiry.conversationDuration ||
            inquiryData.conversation_duration;
          mergedData.User_id =  userInquiry.User_id ||  inquiryData.User_id;
          mergedData.Next_followup =
            userInquiry.Next_followup || inquiryData.Next_followup;
          mergedData.created_at =
            userInquiry.created_at || mergedData.created_at;
          mergedData.updated_at =
            userInquiry.updated_at || mergedData.updated_at;
        }
console.log("userInquiry",userInquiry);
        setInquiry(mergedData);
        console.log("mergedData",mergedData);

        // 💡 Reset form fields on every ticket load
        setAgentRemarks("");
        setStatus("");
        setFollowUpDate("");

        setError(null);
      } else {
        setError("No inquiry data found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch inquiry data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const canCloseTicket = () => {
    if (!inquiry?.Next_followup) return true;

    const followUpDate = new Date(inquiry.Next_followup);
    const now = new Date();

    // Set both dates to midnight for accurate comparison
    followUpDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return now >= followUpDate; // same as !isBefore
  };

  const isFollowUpLocked = () => {
    if (!inquiry?.Next_followup) return false;

    const followUpDate = new Date(inquiry.Next_followup);
    const now = new Date();

    // Set both dates to midnight
    followUpDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return now < followUpDate; // isBefore
  };

  const handleDateClick = (date) => {
    setFollowUpDate(date); // Store the selected date in state
    console.log("Follow-up date selected:", date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset error states
    setRemarkError("");
    setStatusError("");
    setFollowUpError("");

    let isValid = true;

    if (!agentRemarks.trim()) {
      setRemarkError("Remark is required.");
      isValid = false;
    }

    if (!status) {
      setStatusError("Please select a status.");
      isValid = false;
    }

    if (!isFollowUpDisabled() && !followUpDate) {
      setFollowUpError("Follow-up date is required.");
      isValid = false;
    }

    if (isFollowUpLocked()) {
      setStatusError(
        "You can only change the status after the follow-up date."
      );
      setLoading(false);
      return;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      console.log("📝 Submitting the form...");
      console.log("👉 Current Inquiry Object:", inquiry);
      console.log("👉 Current Agent Remark:", agentRemarks);
      console.log("👉 Current Status Code:", status);
      console.log("👉 Current Follow-Up Date:", followUpDate);

      const statusLabel =
        statusOptions.find((opt) => opt.code === status)?.label || "Open";

      const payload = {
        p_id: inquiry.id,
        p_status: statusLabel,
        p_agent_remarks: agentRemarks,
        p_Next_followup: followUpDate,
      };

      console.log("🚀 Final Payload to updateInquiry:", payload);

      const response = await updateInquiry(payload);
      // await fetchData();
      console.log("✅ Inquiry updated successfully:", response);

      // Clear form fields after successful update
      setAgentRemarks("");
      setStatus("");
      setFollowUpDate("");

      navigate("/agent/components/Tickets", { replace: true });
    } catch (err) {
      console.error("❌ Error updating inquiry:", err.message);
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data?.message?.toLowerCase().includes("closed")
      ) {
        setError("This ticket is already closed. No further updates allowed.");
      } else {
        setError("Failed to update inquiry. Please try again.");
      }
      // finally {
      //   setLoading(false);
    }
  };

  const isFollowUpDisabled = () => {
    const label = statusOptions.find((opt) => opt.code === status)?.label;
    return (
      label === "Resolved and Closed" ||
      label === "No Response from Client so Closed"
    );
  };

  const inquiryDetails = inquiry
    ? {
        p_id: inquiry.id,
        p_status: statusOptions.find((opt) => opt.code === status)?.label || "",
        p_User_id: inquiry.User_id ?? inquiry.User_id ?? null,
        p_Client_name: inquiry.client_name ?? inquiry.Client_name ?? "no",
        p_contact: inquiry.contact ?? "no",
        p_email: inquiry.email ?? "no",
        p_last_question: inquiry.last_question ?? "",
        p_agent_remarks: agentRemarks,
        p_Next_followup: followUpDate,
        p_created_at: inquiry.created_at ?? "no",
        p_updated_at: inquiry.updated_at ?? "no",
      }
    : null;
     console.log("inquirydetails",inquiryDetails);


    // const formatDateTime = (datetime) => {
    //   if (!datetime) return "N/A";
    //   const dateObj = new Date(datetime);
    //   const date = dateObj.toLocaleDateString("en-GB");
     
    //   const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    //   return (
    //     <>
    //       <div>{date}</div>
    //       <div>{time}</div>
    //     </>
    //   );
    // };
    

  return (
    <div className="container my-4">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
        <FaArrowLeft className="me-2" />
        Back
      </button>

      <h4 className="mb-4">
        <FaClipboardList className="me-2" />
        Details of Ticket ID: {`CBR-${userId}`}
      </h4>

      <div className="table-responsive mb-4">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th className="text-start">
                <FaUser className="me-1" /> Name
              </th>
              <th className="text-start">
                <FaEnvelope className="me-1" /> Email
              </th>
              <th className="text-start">
                <FaPhone className="me-1" /> Contact
              </th>
              {/* <th>
                <FontAwesomeIcon icon={faClock} /> Created At
              </th>
              <th>
                <FontAwesomeIcon icon={faClock} /> Updated At
              </th> */}
              <th className="text-start">
                <FaClock className="me-1" /> Conversation Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {inquiry ? (
              <tr>
                <td className="text-start">
                  {inquiry.Client_name
                    ? inquiry.Client_name.charAt(0).toUpperCase() +
                      inquiry.Client_name.slice(1)
                    : "No Name"}
                </td>
                <td className="text-start">{inquiry.email || "No Email"}</td>
                <td className="text-start">
                  {inquiry.contact || "No Contact"}
                </td>
                {/* <td className="text-start">
          {inquiry.created_at ? (
            <>
              <div>
                {new Date(inquiry.created_at).toLocaleDateString("en-GB")}
              </div>
              <div>
                {new Date(inquiry.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </td>

        <td className="text-start">
          {inquiry.updated_at ? (
            <>
              <div>
                {new Date(inquiry.updated_at).toLocaleDateString("en-GB")}
              </div>
              <div>
                {new Date(inquiry.updated_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </td> */}

                <td className="text-start">
                  {inquiry.conversation_duration || "No conversation duration"}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col-6">
          <table className="table table-bordered h-100 mt-3">
            <thead>
              <tr>
                <th>
                  Last Response from "
                  {inquiry?.Client_name
                    ? inquiry.Client_name.charAt(0).toUpperCase() +
                      inquiry.Client_name.slice(1)
                    : "Client"}
                  "
                </th>
              </tr>
            </thead>
            <tbody>
              {inquiry && inquiry.last_question ? (
                <tr>
                  <td className="text-black">
                    <strong>Last Response :</strong>{" "}
                    {inquiry.last_question.text}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="text-warning text-center">
                    <FaExclamationTriangle className="me-2" />
                    No Last Question available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <FaComment className="me-2" /> Remark
              </label>
              <textarea
                className="form-control"
                rows="3"
                value={agentRemarks}
                onChange={(e) => {
                  const input = e.target.value;
                  const capitalized =
                    input.charAt(0).toUpperCase() + input.slice(1);
                  setAgentRemarks(capitalized);
                }}
                placeholder="Enter your remark"
              />
              {remarkError && (
                <div className="text-danger mt-1">{remarkError}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaClipboardList className="me-2" /> Status
              </label>
              <div
                title={
                  isFollowUpLocked()
                    ? "Status change is locked until the follow-up date."
                    : ""
                }
              >
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isFollowUpLocked() || isFollowUpDisabled()}
                >
                  <option value="">Select a status</option>
                  {statusOptions.map((option) => (
                    <option
                      key={option.code}
                      value={option.code}
                      disabled={option.code === "OPN"}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {statusError && (
                <div className="text-danger mt-1">{statusError}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaCalendarAlt className="me-2" /> Follow-Up Date
              </label>
              {/* <input
                type="date"
                className="form-control"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                disabled={isFollowUpLocked()}
                min={new Date().toISOString().split("T")[0]} // 🧠 disables past dates
                // min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              /> */}
              <input
                type="date"
                className="form-control"
                placeholder="Select follow-up date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                disabled={isFollowUpLocked() || isFollowUpDisabled()}
                onClick={
                  !(isFollowUpLocked() || isFollowUpDisabled())
                    ? handleDateClick
                    : null
                }
              />
              {followUpError && (
                <div className="text-danger mt-1">{followUpError}</div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100">
              Submit
            </button>
            {error && (
              <div className="alert alert-danger mt-3">
                <FaExclamationTriangle className="me-2" />
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserConversation;
