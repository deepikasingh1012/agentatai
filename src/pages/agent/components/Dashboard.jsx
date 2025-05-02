import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts";
import {
  faBriefcase,
  faEnvelope,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { getInquiryStatusCount } from "../../../services/AgentServices";


const links = [
  {
    name: "Total",
    url: "/TotalTicket",
    icon: faBriefcase,
    bgColor: "bg-primary",
  },
  {
    name: "Opened",
    url: "/OpenedTicket",
    icon: faEnvelope,
    bgColor: "bg-success",
  },
  {
    name: "Closed",
    url: "/ClosedTicket",
    icon: faCheckCircle,
    bgColor: "bg-danger",
  },
  {
    name: "Inprogress",
    url: "/InprogressTicket",
    icon: faSpinner,
    bgColor: "bg-warning",
  },
];

const COLORS = ["#007bff", "#28a745", "#dc3545", "#ffc107"];
const clientId = localStorage.getItem("clientId");
export default function Dashboard() {
  const [ticketData, setTicketData] = useState({
    total_count: 0,
    Opened: 0,
    Closed: 0,
    Inprogress: 0,
  });
  const navigate = useNavigate();

const handleBarClick = (statusName) => {
  navigate("/agent/components/Tickets", { state: { filterFromDashboard: statusName } });
};

  const fetchData = async () => {
    setLoading(true);
    try {
      const inquiryStatus = await getInquiryStatusCount();

      let opened = 0;
      let closed = 0;
      let inprogress = 0;

      inquiryStatus.data.forEach((item) => {
        switch (item.status) {
          case "OPN":
            opened = item.status_count;
            break;
          // case 'CLS':
          case "CRS":
          case "CNR":
            closed += item.status_count;
            break;
          case "INP":
            inprogress = item.status_count;
            break;
          default:
            break;
        }
      });

      setTicketData({
        total_count: inquiryStatus.total_count,
        Opened: opened,
        Closed: closed,
        Inprogress: inprogress,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const barChartData = [
    { name: "Total", count: ticketData.total_count, fill: "#007bff" },
    { name: "Opened", count: ticketData.Opened, fill: "#28a745" },
    { name: "Closed", count: ticketData.Closed, fill: "#dc3545" },
    { name: "Inprogress", count: ticketData.Inprogress, fill: "#ffc107" },
  ];

  const pieChartData = [
    { name: "Total", value: ticketData.total_count },
    { name: "Opened", value: ticketData.Opened },
    { name: "Closed", value: ticketData.Closed },
    { name: "Inprogress", value: ticketData.Inprogress },
  ];

  return (
    <div className="container-fluid">
      <h4 className="text-center text-primary mt-4">Tickets Analysis</h4>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card p-3">
            {loading ? (
              <Skeleton height={100} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 10, right: 100, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Ticket Count"
                    barSize={80}
                    onClick={({ name }) => handleBarClick(name)}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="text-center">Ticket Summary</h5>
            <ul className="list-group">
              {pieChartData.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{
                    color: COLORS[index % COLORS.length],
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                  <span className="badge bg-secondary">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            {loading ? (
              <Skeleton height={100} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={82}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
