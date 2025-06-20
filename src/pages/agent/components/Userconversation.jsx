import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  updateInquiry,
  getUserInquiry,
  getInquiryByClientId,
  fetchUserById,
  getInquiryDuration,
} from "../../../services/AgentServices";
import {
  FaArrowLeft,
  FaClipboardList,
  FaComment,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaComments,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faClock } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.REACT_APP_ID_SECRET;

// const bytes = CryptoJS.AES.decrypt(decodeURIComponent(token), SECRET_KEY);
// const userId = bytes.toString(CryptoJS.enc.Utf8);

const UserConversation = () => {
  const [tickets, setTickets] = useState([]);
  const [inquiry, setInquiry] = useState(null);
  const [agentRemarks, setAgentRemarks] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [remarkError, setRemarkError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [followUpError, setFollowUpError] = useState("");
  const [originalStatusCode, setOriginalStatusCode] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [lastRemarkInput, setLastRemarkInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationDuration, setConversationDuration] = useState(null);


  const queryParams = new URLSearchParams(useLocation().search);
  const token = queryParams.get("token");
  // decrypt it to get the real userId
  let decryptedUserId;
  try {
    const bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(token || ""),
      SECRET_KEY
    );
    decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    decryptedUserId = null;
    console.error("Invalid or missing token");
  }

  // const queryParams = new URLSearchParams(location.search);
  // const userId = queryParams.get("user_id");
  // console.log("🧾 Extracted userId:", userId);

  console.log("🧾 Decrypted userId:", decryptedUserId);

  const statusOptions = [
    // { code: "OPN", label: "Open" },
    {
      code: "INP",
      label: "In Progress, communication is going on with client.",
    },
    { code: "CRS", label: "Resolved and Closed" },
    { code: "CNR", label: "No Response from Client so Closed" },
  ];

  const [status, setStatus] = useState("");

  const clientId = sessionStorage.getItem("clientId")|| "";
  const user_id = sessionStorage.getItem("userId")|| "";

  useEffect(() => {
    if (!user_id) return;

    setIsLoading(true);
    fetchUserById(user_id)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user_id]);

useEffect(() => {
  const fetchDuration = async () => {
    if (!inquiry?.id) return;
    const res = await getInquiryDuration(inquiry.id);
    if (res.success && res.duration) {
      setConversationDuration(res.duration);
    }
  };

  fetchDuration();
}, [inquiry?.id]);


  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(location.search);
      const userIdFromURL = decryptedUserId;

      if (!userIdFromURL) {
        setError("No user ID provided.");
        setLoading(false);
        return;
      }

      const page = parseInt(queryParams.get("page") || "1", 10);
      const page_size = 10;

      const [inquiries, userInquiry] = await Promise.all([
        getInquiryByClientId(clientId, page, page_size),
        getUserInquiry(decryptedUserId, clientId),
      ]);

      console.log("🛠 full inquiries payload:", inquiries);
      console.log("🛠 full userInquiry payload:", userInquiry);

      setTickets(inquiries?.data || []);

      // const inquiryData = inquiries?.data?.[0];
      const inquiryData = Array.isArray(inquiries.data)
        ? inquiries.data.find(
            (item) => String(item.User_id) === String(decryptedUserId)
          )
        : null;

      let finalInquiry = inquiryData;
      if (!finalInquiry && userInquiry?.success) {
        finalInquiry = {
          id: userInquiry.id,
          Client_name: userInquiry.Client_name,
          contact: userInquiry.contact,
          email: userInquiry.email,
          created_at: userInquiry.created_at,
          updated_at: userInquiry.updated_at,
          last_question: userInquiry.lastQuestion,
          duration: userInquiry.duration,
          p_agent_remarks: userInquiry.agent_remarks,
          p_status: userInquiry.status_code,
          p_Next_followup: userInquiry.Next_followup,
          User_id: userInquiry.User_id,
          user_id: userInquiry.user_id,
        };
      }

      if (!finalInquiry) {
        setError("No inquiry data found for this user.");
        setLoading(false);
        return;
      }

      console.log("📋 finalinquiry:", finalInquiry);
      const lastQuestionText =
        finalInquiry.last_question?.text ||
        finalInquiry.lastQuestion?.text ||
        "";

      if (finalInquiry) {
        const mergedData = {
          ...finalInquiry,
          ...userInquiry,
          last_question: { text: lastQuestionText },
          id: finalInquiry.id,
          Client_name: finalInquiry.Client_name,
          contact: finalInquiry.contact,
          email: finalInquiry.email,
          created_at: finalInquiry.created_at,
          updated_at: finalInquiry.updated_at,

          duration: finalInquiry.duration,
          User_id: finalInquiry.User_id,
          user_id: finalInquiry.user_id,
          Next_followup:
            finalInquiry.p_Next_followup ?? finalInquiry.Next_followup,
          agent_remarks:
            finalInquiry.p_agent_remarks ?? finalInquiry.agent_remarks,
          status_code: finalInquiry.p_status ?? finalInquiry.status,
        };

        console.log("finalInquiry", finalInquiry);
        setInquiry(mergedData);
        setOriginalStatusCode(mergedData.status_code);
        setInquiry(data => ({ ...data, duration: conversationDuration }));
        console.log("mergedData", mergedData);

        // 💡 Reset form fields on every ticket load
        setAgentRemarks(mergedData.agent_remarks ?? "");
        setStatus(mergedData.status_code ?? "");
        if (mergedData.Next_followup) {
          const d = new Date(mergedData.Next_followup);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          setFollowUpDate(`${yyyy}-${mm}-${dd}`);
        } else {
          setFollowUpDate("");
        }

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
  //  useEffect(() => {
  //    fetchData(currentPage, filterStatus);
  //  }, [ filterStatus,location.search]);

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

  // helper to tell if this ticket is already closed
  const isTicketClosed = () => status === "CRS" || status === "CNR";

  const isOriginallyClosed = () =>
    originalStatusCode === "CRS" || originalStatusCode === "CNR";

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
    if (status === "OPN") {
      setStatusError("Please select a status.");
      setLoading(false);
      return;
    }

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
        user_id: user_id,
        p_status: statusLabel,
        p_agent_remarks: agentRemarks,
        p_Next_followup: followUpDate,
      };

      const response = await updateInquiry(payload);
      // await fetchData();
      console.log("✅ Inquiry updated successfully:", response);

      //  form fields after successful update
      setAgentRemarks(inquiry.p_agent_remarks ?? "");
      setStatus(inquiry.p_status ?? "");
      if (inquiry.p_Next_followup) {
        const d = new Date(inquiry.p_Next_followup);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        setFollowUpDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setFollowUpDate("");
      }

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
        p_User_id: inquiry.User_id ?? null,
        user_id: user_id ,
        p_Client_name: inquiry.Client_name ?? inquiry.Client_name ?? "no",
        p_contact: inquiry.contact ?? "no",
        p_email: inquiry.email ?? "no",
        p_last_question: inquiry.lastQuestion ?? "",
        p_agent_remarks: agentRemarks,
        p_Next_followup: followUpDate,
        p_created_at: inquiry.created_at ?? "no",
        p_updated_at: inquiry.updated_at ?? "no",
        
      }
    : null;

  console.log("inquirydetails", inquiryDetails);

  useEffect(() => {
    if (inquiry?.p_agent_remarks) {
      const remarksArray = inquiry.p_agent_remarks.split(",");
      const lastRemark = remarksArray[remarksArray.length - 1].trim();
      setAgentRemarks(lastRemark); // Show only the latest remark
    }
  }, [inquiry]);

  return (
    <div className="container my-4">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
        <FaArrowLeft className="me-2" />
        Back
      </button>

      <h4 className="mb-4">
        <FaClipboardList className="me-2" />
        Details of Ticket ID: {`CBR-${decryptedUserId || "unknown"}`}
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
                <FaPhoneAlt className="me-1" /> Contact
              </th>

              {/* <th>
                <FontAwesomeIcon icon={faClock} /> Created At
              </th>*/}
              <th>
                <FontAwesomeIcon icon={faClock} /> Ticket Updated Date
              </th>
              <th className="text-start">
                <FaComments className="me-1" /> Conversation Duration
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
        </td>*/}

                <td className="text-start">
                  {inquiry.updated_at ? (
                    <div>
                      {new Date(inquiry.updated_at).toLocaleDateString("en-GB")}{" "}
                      &nbsp;&nbsp;&nbsp;
                      {new Date(inquiry.updated_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="text-start">
                  {conversationDuration ?? "No conversation duration"}
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
              {inquiry && inquiry.lastQuestion && inquiry.lastQuestion.text ? (
                <tr>
                  <td className="text-black">
                    <strong>Last Response :</strong> {inquiry.lastQuestion.text}
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

              {/* Past Remarks inside the same table */}
              <tr>
                <td>
                  <strong>Past Remarks:</strong>
                 {inquiry?.agent_remarks ? (
    <ul className="list-group list-group-flush mt-2">
      {inquiry.agent_remarks.split(",").map((remark, i) => (
        <li key={i} className="list-group-item px-0">
          {remark.trim()}
        </li>
      ))}
    </ul>
  ) : (
    <div className="text-muted mt-2">No past remarks available.</div>
  )}
                  {/* {inquiry?.agent_remarks} */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-6">
          {isOriginallyClosed() && (
            <div className="alert alert-warning">
              This ticket was already closed ,updates are disabled.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <FaComment className="me-2" /> Remark
              </label>
              <textarea
                className="form-control"
                rows="3"
                // value={agentRemarks}
                value={
                  agentRemarks
                    ? agentRemarks.split(",").slice(-1)[0]
                    : ""
                }
                onChange={(e) => {
                  const input = e.target.value;
                  const capitalized =
                    input.charAt(0).toUpperCase() + input.slice(1);
                  setAgentRemarks(capitalized);
                }}
                // onChange={(e) => setAgentRemarks(e.target.value)}
                placeholder="Enter your remark"
                disabled={isOriginallyClosed()}
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
                  disabled={isOriginallyClosed() || isFollowUpLocked()}
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

              <input
                type="date"
                className="form-control"
                placeholder="Select follow-up date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                disabled={
                  isOriginallyClosed() ||
                  isFollowUpLocked() ||
                  isFollowUpDisabled()
                }
                onClick={
                  !(isFollowUpLocked() || isFollowUpDisabled())
                    ? handleDateClick
                    : null
                }
                min={(() => {
                  const d = new Date();
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, "0");
                  const day = String(d.getDate()).padStart(2, "0");
                  return `${y}-${m}-${day}`;
                })()}
              />
              {followUpError && (
                <div className="text-danger mt-1">{followUpError}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={isOriginallyClosed()}
            >
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
