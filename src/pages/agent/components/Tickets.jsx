import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaCheckCircle, FaSpinner, FaListAlt, FaInbox } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faClock,
  faComment,
  faInfoCircle,
  faHashtag,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  getInquiryByClientId,
  getInquiryStatusCount,
  getOpenInquiries,
  getInProgressInquiries,
  getNoResponseInquiries,
  getResolvedInquiries,
  getInquiriesByDateRange,
} from "../../../services/AgentServices";
import { useOutletContext } from "react-router-dom";
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.REACT_APP_ID_SECRET;
if (!SECRET_KEY) {
  console.error("🔒 REACT_APP_ID_SECRET is not defined! Encryption will fail.");
}

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState({
    ticket_count: 0,
    Open: 0,
    Inprogress: 0,
    Resolved: 0,
    Noresponse: 0,
  });
  const [filterStatus, setFilterStatus] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const page_size = 10;
  const { searchQuery } = useOutletContext();
  const location = useLocation();
  const clientId = localStorage.getItem("clientId");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  const statusKeywords = {
    Open: ["open", "OPN"],
    "In-Progress": ["in progress", "INP"],
    Resolved: ["resolved", "CRS"],
    "No-Response": ["no response", "CNR"],
  };

  const getStatusDescription = (code) => {
    switch (code?.toUpperCase()) {
      case "OPN":
        return "Open";
      case "INP":
        return "In-Progress";
      case "CRS":
        return "Resolved";
      case "CNR":
        return "No-Response";
      default:
        return code || "Unknown";
    }
  };

  const statusIcons = {
    All: <FaListAlt />,
    Open: <FaInbox />,
    "In-Progress": <FaSpinner />,
    Resolved: <FaCheckCircle />,
    "No-Response": <FaCheckCircle />,
  };

  const queryParams = new URLSearchParams(location.search);
  const statusFromURL = queryParams.get("status");

  useEffect(() => {
    if (location.state?.filterFromDashboard) {
      const statusFromDashboard = location.state.filterFromDashboard;
      if (
        ["All", "Open", "In-Progress", "Resolved", "No-Response"].includes(
          statusFromDashboard
        )
      ) {
        setFilterStatus(statusFromDashboard);
      }
    }
  }, [location.state]);
  const pageFromQuery = parseInt(queryParams.get("page") || "1", 10);
  //   useEffect(() => {
  //     fetchData();
  //   }, []);

  //   useEffect(() => {
  //   fetchData(pageFromQuery, filterStatus);
  // }, [filterStatus, pageFromQuery]);

  useEffect(() => {
    fetchData(pageFromQuery, filterStatus);
  }, []);

    useEffect(() => {
    // Only fetch “All” or status‑filtered if not in date‑filter mode:
    if (!(fromDate && toDate)) {
      fetchData(currentPage, filterStatus);
    }
  }, [currentPage, filterStatus]);


  // useEffect(() => {
  //   fetchData(currentPage, filterStatus);
  // }, [currentPage, filterStatus]);

  const fetchData = async (page = 1, status = filterStatus) => {
    setLoading(true);
    try {
      let response;
      switch (status) {
        case "Open":
          response = await getOpenInquiries(clientId, page, page_size);
          break;
        case "In-Progress":
          response = await getInProgressInquiries(clientId, page, page_size);
          break;
        case "Resolved":
          response = await getResolvedInquiries(clientId, page, page_size);
          break;
        case "No-Response":
          response = await getNoResponseInquiries(clientId, page, page_size);
          break;

        default:
          response = await getInquiryByClientId(clientId, page, page_size);
          break;
      }

      // Normalize response
      const items = response.inquiries || response.data || [];
      const totalCount = response.totalCount || response.total_records || 0;

      setTickets(items);
      setTotalPages(Math.ceil(totalCount / page_size));

      // Update status counts
      const statusCountRaw = await getInquiryStatusCount();
      const counts = { Open: 0, Inprogress: 0, Resolved: 0, Noresponse: 0 };
      statusCountRaw.data.forEach((st) => {
        switch (st.status) {
          case "OPN":
            counts.Open = st.status_count;
            break;
          case "INP":
            counts.Inprogress = st.status_count;
            break;
          case "CRS":
            counts.Resolved = st.status_count;
            break;
          case "CNR":
            counts.Noresponse = st.status_count;
            break;
        }
      });
      setTicketData({
        ticket_count: statusCountRaw.total_count,
        Open: counts.Open,
        Inprogress: counts.Inprogress,
        Resolved: counts.Resolved,
        Noresponse: counts.Noresponse,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusFromURL) {
      setFilterStatus(statusFromURL);
    }
  }, [statusFromURL]);

  useEffect(() => {
  // Reset tickets and go back to page 1 when filters change
    setTickets([]);
    setCurrentPage(1);
    fetchData(1,filterStatus);
  }, [filterStatus, searchQuery, dateFilter]);

  // useEffect(() => {
  //    if (!fromDate && !toDate) {
  //      setTickets([]);
  //     setCurrentPage(1);
     
  //    }
  //  }, [ fromDate, toDate]);

  //   useEffect(() => {
  //     fetchData(currentPage, filterStatus);
  //   }, [currentPage]);

  // useEffect(() => {
    // On mount, only call fetchData if NOT in date‐filter mode:
  //   if (!(fromDate && toDate)) {
  //     fetchData(pageFromQuery, filterStatus);
  //   }
  // }, []);

  // useEffect(() => {
  //   // Whenever page or status change, only call fetchData if NOT date‐filtering:
  //   if (!(fromDate && toDate)) {
  //     fetchData(currentPage, filterStatus);
  //   }
  // }, [currentPage, filterStatus, fromDate, toDate]);

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  //   fetchData(page, filterStatus);
  // };

    useEffect(() => {
    if (fromDate && toDate) {
      (async () => {
        setLoading(true);
        try {
          const response = await getInquiriesByDateRange(
            fromDate,
            toDate,
            clientId,
            1,
            page_size
          );
          if (response?.status) {
            setTickets(response.data || []);
            setCurrentPage(1);
            setTotalPages(Math.ceil(Number(response.total) / page_size));
          } else {
            setTickets([]);
            setTotalPages(1);
          }
        } catch (err) {
          console.error("Error in date‑range useEffect:", err);
          setTickets([]);
          setTotalPages(1);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [fromDate, toDate]);
   console.log(fromDate, toDate);

       const handlePageChange = async (page) => {
    
    if (fromDate && toDate) {
      // We are in “date-filter” mode → fetch that page from getInquiriesByDateRange
      setLoading(true);
      try {
        const response = await getInquiriesByDateRange(
          fromDate,
          toDate,
          clientId,
          page,
          page_size
        );
        if (response?.status) {
          setTickets(response.data || []);
          setCurrentPage(page);
          setTotalPages(Math.ceil(Number(response.total) / page_size));
        } else {
          console.error(
            "Invalid response from date range API (pagination)",
            response
          );
          setTickets([]);
        }
      } catch (err) {
        console.error("Error fetching paged date-range:", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Normal status‐based pagination
      setCurrentPage(page);
      fetchData(page, filterStatus);
    }
  };



  const isWithinDateFilter = (createdDate) => {
    if (!createdDate) return false;
    const date = new Date(createdDate);

    // 1) manual from/to override
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      return date >= from && date <= to;
    }
    const today = new Date();

    switch (dateFilter) {
      case "Today":
        return date.toDateString() === today.toDateString();
      case "ThisWeek": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return date >= startOfWeek && date <= endOfWeek;
      }
      case "ThisMonth":
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      case "ThisYear":
        return date.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  };

  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date.");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    if (from > to) {
      alert("‘From’ date cannot be after ‘To’ date.");
      return;
    }

    setLoading(true);
    try {
      const response = await getInquiriesByDateRange(
        fromDate,
        toDate,
        clientId,
        1,
        page_size
      );
      if (response?.status) {
        setTickets(response.data || []);
        setCurrentPage(1);
        setTotalPages(Math.ceil(Number(response.total) / page_size));
      } else {
        console.error("Invalid response from date range API", response);
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching inquiries by date range:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleReset = () => {
  //   setFromDate("");
  //   setToDate("");
  //   fetchData(1); // reloads the data with default filters
  // };
  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setDateFilter("All");
    setFilterStatus("All");
    fetchData(1);
    setCurrentPage(1);
  };

  const filteredTickets = Array.isArray(tickets)
    ? tickets
        .filter((ticket) => {
          const status = (ticket.status || "").toUpperCase();
          if (!filterStatus || filterStatus === "All") return true;
          const statusFilter = statusKeywords[filterStatus] || [];
          return statusFilter.includes(status);
        })
        .filter(
          (ticket) =>
            (ticket.Client_name || "")
              .toLowerCase()
              .includes((searchQuery || "").toLowerCase()) ||
            (ticket.User_id
              ? ticket.User_id.toString().includes(searchQuery)
              : false)
        )
        // .filter((ticket) => isWithinDateFilter(ticket.created_at))
        .filter((ticket) =>
          fromDate && toDate ? true : isWithinDateFilter(ticket.created_at)
        )
    : [];
  const getBadgeClass = (statuses) => {
    const status = statuses?.toLowerCase() || "";
    if (status.includes("open") || status === "opn") return "badge bg-success";
    else if (status.includes("in progress") || status === "inp")
      return "badge bg-warning";
    // else if (status.includes("assigned")) return "badge bg-info";
    else if (status.includes("resolved") || status === "crs")
      return "badge bg-danger";
    else if (status.includes("no response") || status === "cnr")
      return "badge bg-danger";
    else return "badge bg-secondary";
  };

  const getButtonColor = (status) => {
    if (status === "Open") return "bg-success";
    if (status === "In-Progress") return "bg-warning";
    if (status === "Resolved") return "bg-danger";
    if (status === "No-Response") return "bg-danger";

    return "bg-secondary";
  };

  const getTextColorClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("open") || s === "opn") return "text-success";
    if (s.includes("in progress") || s === "inp") return "text-warning";
    if (s.includes("resolved") || s === "crs") return "text-danger";
    if (s.includes("no response") || s === "cnr") return "text-danger";
    return "text-secondary";
  };
  // const makeToken = (id) =>
  //   encodeURIComponent(CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString());
  const makeToken = (id) => {
    if (!SECRET_KEY) {
      throw new Error(
        "Encryption secret (REACT_APP_ID_SECRET) is not defined."
      );
    }
    return encodeURIComponent(
      CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString()
    );
  };

  return (
    <div className="container mt-4">
      <div className="row g-2 justify-content-center mb-5">
        {["All", "Open", "In-Progress", "Resolved", "No-Response"].map(
          (status) => {
            let count = 0;
            if (status === "All") count = ticketData.ticket_count;
            else if (status === "Open") count = ticketData.Open;
            else if (status === "In-Progress") count = ticketData.Inprogress;
            else if (status === "Resolved") count = ticketData.Resolved;
            else if (status === "No-Response") count = ticketData.Noresponse;

            return (
              <div key={status} className="col-6 col-md-auto d-flex">
                <button
                  className={`btn ${
                    filterStatus === status
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } rounded-pill w-100 d-flex align-items-center justify-content-center gap-2`}
                  onClick={() => setFilterStatus(status)}
                >
                  {statusIcons[status]} {status}
                  <span
                    className={`badge ${getButtonColor(status)} text-light`}
                  >
                    {count}
                  </span>
                </button>
              </div>
            );
          }
        )}
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <Form.Group>
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="col-md-2">
          <Form.Group>
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <Button onClick={handleFilter} className="btn btn-primary w-100">
            Show
          </Button>
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <Button onClick={handleReset} className="btn btn-secondary w-100">
            Reset
          </Button>
          {/* <div className="row mb-3 justify-content-end">
          <div className="col-auto"> */}
          <div className="col-md-1  d-flex align-items-end justify-content-end w-100"></div>
          <Form.Label className="invisible">Date Filter</Form.Label>
          <select
            className="form-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="All">All </option>
            <option value="Today">Today</option>
            <option value="ThisWeek">This Week</option>
            <option value="ThisMonth">This Month</option>
            <option value="ThisYear">This Year</option>
          </select>
        </div>
        {/* </div>
        </div> */}
      </div>

      <div className="table-responsive bg-white p-3 rounded shadow">
        <table className="table table-bordered table-hover align-middle text-nowrap m-0">
          <thead className="table-dark text-white text-start sticky-top">
            <tr>
              {/* <th>
                <FontAwesomeIcon icon={faFileAlt} /> Client Name
              </th> */}
              <th className="w-30">
                <FontAwesomeIcon icon={faHashtag} /> ID
              </th>
              <th className="w-30">
                <FontAwesomeIcon icon={faClock} /> Ticket Received Date
              </th>
              <th className="w-50 text-truncate">
                <FontAwesomeIcon icon={faComment} /> Remark
              </th>
              <th className="w-20">
                <FontAwesomeIcon icon={faStarSolid} /> Follow-Up Date
              </th>
              {(!filterStatus || filterStatus === "All") && (
                <th className="w-20">
                  <FontAwesomeIcon icon={faInfoCircle} /> Status
                </th>
              )}

              {/* <th>
                <FontAwesomeIcon icon={faClock} /> Updated At
              </th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(page_size)].map((_, index) => (
                <tr key={index}>
                  <td colSpan="7" className="text-center">
                    <Skeleton height={30} />
                  </td>
                </tr>
              ))
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.User_id} className="text-center">
                  <td className="text-start">
                    <Link
                      to={`/agent/components/Userconversation?token=${makeToken(
                        ticket.User_id
                      )}&page=${currentPage}`}
                      className={`text-decoration-none fw-bold ${getTextColorClass(
                        ticket.status
                      )}`}
                    >
                      {`CBR-${ticket.User_id}`}
                    </Link>
                  </td>
                  {/* <td className="text-start">
          {ticket.Client_name
            ? ticket.Client_name
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")
            : ""}
        </td> */}
                  <td className="text-start">
                    {ticket.created_at ? (
                      <>
                        <div>
                          {new Date(ticket.created_at).toLocaleDateString(
                            "en-GB"
                          )}
                          &nbsp;&nbsp;&nbsp;
                          {new Date(ticket.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  {/* <td className="text-start text-wrap text-break">
                    {ticket.agent_remarks ?? "No Remark"}
                  </td> */}
                  <td className="text-start text-wrap text-break">
                    {ticket.agent_remarks
                      ? ticket.agent_remarks.split(",").pop().trim()
                      : "No Remark"}
                  </td>
                  <td className="text-start">
                    {ticket.Next_followup
                      ? new Date(ticket.Next_followup).toLocaleDateString(
                          "en-GB"
                        )
                      : "No Follow-Up"}
                  </td>
                  {(!filterStatus || filterStatus === "All") && (
                    <td className="text-start">
                      <span
                        className={`badge ${getBadgeClass(
                          ticket.status
                        )} text-light d-flex align-items-center justify-content-center w-auto`}
                        style={{ width: "120px", height: "30px" }}
                      >
                        {getStatusDescription(ticket.status)}
                      </span>
                    </td>
                  )}

                  {/* <td className="text-start">
          {ticket.updated_at ? (
            <>
              <div>
                {new Date(ticket.updated_at).toLocaleDateString("en-GB")}
              </div>
              <div>
                {new Date(ticket.updated_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Tickets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <ul className="pagination flex-wrap justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
