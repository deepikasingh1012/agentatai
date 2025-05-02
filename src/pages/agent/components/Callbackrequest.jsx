import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getCallbackRequests } from "../../../services/AgentServices";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaQuestionCircle,
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

export default function Callbackrequest() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const ticketsPerPage = 5;

  const { searchQuery } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const callbackRequests = await getCallbackRequests();
        setTickets(callbackRequests);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load callback requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTickets = tickets
    .map((ticket) => ({
      ...ticket,
      status: ticket.status || "Pending",
    }))
    .filter(
      (ticket) =>
        (ticket.ticket_title || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase()) ||
        (ticket.ticket_id
          ? ticket.ticket_id.toString().includes(searchQuery)
          : false) ||
        (ticket.user_name || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase()) ||
        (ticket.contact
          ? ticket.contact.toString().includes(searchQuery)
          : false) ||
        (ticket.email || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase())
    )
    .sort((a, b) => new Date(b.updated) - new Date(a.updated));

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const startIndex = currentPage * ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    startIndex,
    startIndex + ticketsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-11">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title mb-3 text-primary">Callback Requests</h5>

              {/* Table Responsive Wrapper */}
              <div className="table-responsive">
                <table className="table table-bordered table-striped mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th><FaUser className="me-1" />User Name</th>
                      <th><FaPhone className="me-1" />Contact</th>
                      <th><FaEnvelope className="me-1" />Email</th>
                      <th><FaQuestionCircle className="me-1" />Query</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.length > 0 ? (
                      currentTickets.map((ticket) => (
                        <tr key={ticket.ticket_id}>
                          <td>
                            <Link to={`/dashboardlayout/user_conversation?user_id=${ticket.ticket_id}`}>
                              {ticket.ticket_id}
                            </Link>
                          </td>
                          <td className="text-break">{ticket.user_name}</td>
                          <td className="text-break">{ticket.contact}</td>
                          <td className="text-break">{ticket.email}</td>
                          <td className="text-break">{ticket.userquery || "No query"}</td>
                          <td>
                            <span
                              className={`badge bg-${ticket.status === "Callback done" ? "success" : "warning"} d-flex align-items-center gap-1`}
                            >
                              {ticket.status === "Callback done" ? <FaCheckCircle /> : <FaClock />}
                              {ticket.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No callback requests available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  <FaArrowLeft /> Prev
                </button>
                <span className="small">
                  Page {currentPage + 1} of {totalPages || 1}
                </span>
                <button
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next <FaArrowRight />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
