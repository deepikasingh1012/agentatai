
import React, { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { getInquiryByClientId } from "../../../services/AgentServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faClock,
  faComment,
  faInfoCircle,
  faHashtag,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";

export default function SelfAssessment() {
  const [allTickets, setAllTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const [statusCounts, setStatusCounts] = useState({
    Open: 0,
    "In-Progress": 0,
   Resolved:0,
   "No-Response":0,
    
  });
  const clientId = sessionStorage.getItem("clientId");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      let allData = [];
      let page = 1;
      let hasMore = true;

      try {
        while (hasMore) {
          const res = await getInquiryByClientId(clientId, page, 100);
          if (res.data.length > 0) {
            allData = [...allData, ...res.data];
            page++;
          } else {
            hasMore = false;
          }
        }

        setAllTickets(allData);
        const displayData = allData.filter(
          (ticket) =>
            ticket.status?.toUpperCase() === "INP" ||
            ticket.status?.toUpperCase() === "CRS" ||
            ticket.status?.toUpperCase() === "CNR"
        );

        setFilteredTickets(displayData);
        updateStatusCounts(allData);
      } catch (error) {
        console.error("Error fetching all data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [clientId]);

  const updateStatusCounts = (tickets) => {
    const counts = {
      Open: 0,
       "In-Progress": 0,
      Resolved:0,
   "No-Response":0,
     
    };

    tickets.forEach((ticket) => {
      const status = ticket.status?.toUpperCase();
      if (status === "OPN") {
        counts.Open += 1;
      } else if (status === "INP") {
        counts["In-Progress"] += 1;
      } else if (status === "CRS"){ 
        counts.Resolved += 1;
      }else if (status === "CNR"){ 
        counts["No-Response"] += 1;
      }
        
    });

    setStatusCounts(counts);
  };

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date.");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = allTickets.filter((ticket) => {
      if (!ticket.created_at) return false;
      const ticketDate = new Date(ticket.created_at);
      return ticketDate >= from && ticketDate <= to;
    });

    const displayData = filtered.filter(
      (ticket) =>
        ticket.status?.toUpperCase() === "INP" ||
        ticket.status?.toUpperCase() === "CRS" ||
        ticket.status?.toUpperCase() === "CNR"
    );

    setFilteredTickets(displayData);
    setCurrentPage(1);
    updateStatusCounts(filtered);
  };

  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

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

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <Button onClick={handleFilter} className="btn btn-primary w-90">
            Show Report
          </Button>
        </div>

       <div className="col-md-3 d-flex align-items-end ms-n12">
      
            <span className="badge bg-warning text-light me-3 p-1 fs-12">
             In Progress: {statusCounts["In-Progress"]}
            </span>
            <span className="badge bg-danger text-light me-3 p-1 fs-12">
              Resolved: {statusCounts["Resolved"]}
            </span>
             <span className="badge bg-danger text-light me-3 p-1 fs-12">
              No Response: {statusCounts["No-Response"]}
            </span>
          </div>
        </div>
    
      <div className="table-responsive bg-white p-3 rounded shadow">
        <Table striped bordered hover>
          <thead className="table-dark text-white text-center">
            <tr>
              <th className="align-middle" style={{ width: "25%" }}>
                <FontAwesomeIcon icon={faHashtag} /> ID
              </th>
              <th className="align-middle" style={{ width: "25%" }}>
                <FontAwesomeIcon icon={faFileAlt} /> Client Name
              </th>
              <th className="align-middle" style={{ width: "25%" }}>
                <FontAwesomeIcon icon={faClock} /> Created At
              </th>
              <th className="align-middle" style={{ width: "25%" }}>
                <FontAwesomeIcon icon={faInfoCircle} /> Status
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="4">
                    <Skeleton height={30} />
                  </td>
                </tr>
              ))
            ) : currentTickets.length > 0 ? (
              currentTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td> {`CBR-${ticket.User_id}`}</td>
                  <td>{ticket.Client_name}</td>
                  <td className="py-3">
                    {ticket.created_at ? (
                      <>
                        <div>
                          {new Date(ticket.created_at).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                        <div>
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
                  <td>{getStatusDescription(ticket.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
  
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}