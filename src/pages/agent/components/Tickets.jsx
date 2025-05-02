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
} from "../../../services/AgentServices";
import { useOutletContext } from "react-router-dom";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState({
    ticket_count: 0,
    Opened: 0,
    Closed: 0,
    Inprogress: 0,
  });
  const [filterStatus, setFilterStatus] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ticketsPerPage = 10;
  const { searchQuery } = useOutletContext();
  const location = useLocation();
  const clientId = localStorage.getItem("clientId");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  const statusKeywords = {
    Open: ["OPN"],
    Closed: ["CRS", "CNR"],
    "In-Progress": ["INP"],
  };

  const getStatusDescription = (code) => {
    switch (code?.toUpperCase()) {
      case "OPN":
        return "Open";
      case "INP":
        return "In Progress";
      case "CRS":
        return "Resolved, Closed";
      case "CNR":
        return "No Response, Closed";
      default:
        return code || "Unknown";
    }
  };

  const statusIcons = {
    All: <FaListAlt />,
    Open: <FaInbox />,
    Closed: <FaCheckCircle />,
    "In-Progress": <FaSpinner />,
  };

  const queryParams = new URLSearchParams(location.search);
  const statusFromURL = queryParams.get("status");

  useEffect(() => {
    if (location.state?.filterFromDashboard) {
      const statusFromDashboard = location.state.filterFromDashboard;
      if (
        ["All", "Open", "Closed", "In-Progress"].includes(statusFromDashboard)
      ) {
        setFilterStatus(statusFromDashboard);
      }
    }
  }, [location.state]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async (page) => {
    setLoading(true);
    try {
      const [inquiriesResponse, inquiryStatusCount] = await Promise.all([
        getInquiryByClientId(clientId, page, ticketsPerPage),
        getInquiryStatusCount(),
      ]);

      const inquiries = inquiriesResponse?.data || [];
      setTickets(inquiries);
      setTotalPages(
        Math.ceil(inquiriesResponse.total_records / ticketsPerPage)
      );

      const statusCount = { Opened: 0, Closed: 0, Inprogress: 0 };
      inquiryStatusCount.data.forEach((status) => {
        switch (status.status) {
          case "OPN":
            statusCount.Opened = status.status_count;
            break;
          case "CNR":
          case "CRS":
            statusCount.Closed += status.status_count;
            break;
          case "INP":
            statusCount.Inprogress = status.status_count;
            break;
          default:
            break;
        }
      });

      setTicketData({
        ticket_count: inquiryStatusCount.total_count,
        Opened: statusCount.Opened,
        Closed: statusCount.Closed,
        Inprogress: statusCount.Inprogress,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
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
    setTickets([]);
    setCurrentPage(1);
    fetchData(1);
  }, [filterStatus, searchQuery, dateFilter]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const isWithinDateFilter = (createdDate) => {
    if (!createdDate) return false;
    const date = new Date(createdDate);
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
  // const handleFilter = () => {
  //   if (!fromDate || !toDate) {
  //     alert("Please select both From Date and To Date.");
  //     return;
  //   }

  //   const from = new Date(fromDate);
  //   const to = new Date(toDate);
  //   to.setHours(23, 59, 59, 999);

  //   const filtered = tickets.filter((ticket) => {
  //     if (!ticket.created_at) return false;
  //     const ticketDate = new Date(ticket.created_at);
  //     return ticketDate >= from && ticketDate <= to;
  //   });

  //   setTickets(filtered); // <-- Optionally update state to show filtered data
  //   setTotalPages(1); // only one page since it's all filtered data
  //   setCurrentPage(1);
  // };

  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date.");
      return;
    }

    setLoading(true);
    const allTickets = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await getInquiryByClientId(
          clientId,
          page,
          ticketsPerPage
        );
        const data = response?.data || [];

        allTickets.push(...data);
        const totalRecords = response?.total_records || 0;
        hasMore = allTickets.length < totalRecords;
        page++;
      }

      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      const filtered = allTickets.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= from && ticketDate <= to;
      });

      setTickets(filtered);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching all data for filtering:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    fetchData(1); // reloads the data with default filters
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
        .filter((ticket) => isWithinDateFilter(ticket.created_at))
    : [];

  const getBadgeClass = (statuses) => {
    const status = statuses?.toLowerCase() || "";
    if (status.includes("open") || status === "opn") return "badge bg-success";
    else if (status.includes("assigned")) return "badge bg-info";
    else if (
      status.includes("closed") ||
      status.includes("resolved") ||
      status.includes("response") ||
      status === "cnr" ||
      status === "crs"
    )
      return "badge bg-danger";
    else if (status.includes("in progress") || status === "inp")
      return "badge bg-warning";
    else return "badge bg-secondary";
  };

  const getButtonColor = (status) => {
    if (status === "Open") return "bg-success";
    if (status === "Closed") return "bg-danger";
    if (status === "In-Progress") return "bg-warning";
    return "bg-secondary";
  };
  const getTextColorClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("open") || s === "opn") return "text-success";
    if (s.includes("in progress") || s === "inp") return "text-warning";
    if (
      s.includes("closed") ||
      s.includes("resolved") ||
      s.includes("response") ||
      s === "crs" ||
      s === "cnr"
    )
      return "text-danger";
    return "text-secondary";
  };

  return (
    <div className="container mt-4">
      <div className="row g-2 justify-content-center mb-5">
        {["All", "Open", "Closed", "In-Progress"].map((status) => {
          let count = 0;
          if (status === "All") count = ticketData.ticket_count;
          else if (status === "Open") count = ticketData.Opened;
          else if (status === "Closed") count = ticketData.Closed;
          else if (status === "In-Progress") count = ticketData.Inprogress;
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
                <span className={`badge ${getButtonColor(status)} text-light`}>
                  {count}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="row mb-3">
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
          <div className="col-md-2 d-flex align-items-end"></div>
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
              <th className="w-20">
                <FontAwesomeIcon icon={faInfoCircle} /> Status
              </th>
             
         
              {/* <th>
                <FontAwesomeIcon icon={faClock} /> Updated At
              </th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(ticketsPerPage)].map((_, index) => (
                <tr key={index}>
                  <td colSpan="7" className="text-center">
                    <Skeleton height={30} />
                  </td>
                </tr>
              ))
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id} className="text-center">
                  <td className="text-start">
                    <Link
                      to={`/agent/components/Userconversation?user_id=${ticket.User_id}`}
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
                          )}&nbsp;&nbsp;&nbsp;
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
                  <td className="text-start">
                    {ticket.agent_remarks ?? "No Remark"}
                  </td>
                  <td className="text-start">
                    {ticket.Next_followup
                      ? new Date(ticket.Next_followup).toLocaleDateString(
                          "en-GB"
                        )
                      : "No Follow-Up"}
                  </td>
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
