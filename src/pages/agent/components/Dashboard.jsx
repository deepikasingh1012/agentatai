
import React, { useState, useEffect,useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
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
import { getInquiryStatusCount,    getTodaysFollowups } from "../../../services/AgentServices";
import { FaListAlt, FaInbox, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer, Slide } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";


const COLORS = ["#AEB0B2", "#85898C", "#5D6166", "#343A40"];
// const renderCustomizedLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

const Dashboard = () => {
  const [ticketData, setTicketData] = useState({
    total_count: 0,
    Open: 0,
    Inprogress: 0,
    Resolved: 0,
    Noresponse: 0,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const iconMap = {
    Open: <FaInbox />,
    "In-Progress": <FaSpinner />,
    Resolved: <FaCheckCircle />,
    "No-Response": <FaCheckCircle />,
  };
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const inquiryStatus = await getInquiryStatusCount();

      let open = 0;
      let inprogress = 0;
      let resolved = 0;
      let noresponse = 0;

      inquiryStatus.data.forEach((item) => {
        switch (item.status) {
          case "OPN":
            open = item.status_count;
            break;
          case "INP":
            inprogress = item.status_count;
            break;
          case "CRS":
            resolved = item.status_count;
            break;
          case "CNR":
            noresponse = item.status_count;
            break;

          default:
            break;
        }
      });

      setTicketData({
        total_count: inquiryStatus.total_count,
        Open: open,
        Inprogress: inprogress,
        Resolved: resolved,
        Noresponse: noresponse,
      });
  
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


    useEffect(() => {
          toast.dismiss();
    const clientId = localStorage.getItem("clientId");
    const userId = localStorage.getItem("user_id");

    if (clientId && userId) {
      getTodaysFollowups(clientId)
        .then(({ success, followups }) => {
          if (success && followups.length > 0) {
            toast.info(
              ({ closeToast }) => (
                <div>
                  <p>You have {followups.length} follow-ups scheduled today.</p>
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        closeToast();
                        navigate(`/agent/components/Notifications`);
                      }}
                    >
                      OK
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                       onClick={() => {
                        closeToast();
                        navigate(`/agent/components/Tickets`);
                       }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ),
              {
                //  autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: true,
                transition: Slide,
              }
            );
          }
        })
      .catch((err) => console.error("Error fetching today's followups:", err));
  }
  fetchData();
}, []);

  const handleBarClick = (statusName) => {
    navigate("/agent/components/Tickets", {
      state: { filterFromDashboard: statusName },
    });
  };

  const handlePieClick = (_, index) => {
    const statusMap = ["Open", "In-Progress", "Resolved", "No-Response"];
    navigate("/agent/components/Tickets", {
      state: { filterFromDashboard: statusMap[index] },
    });
  };

  const barChartData = [
    // { name: "Total", count: ticketData.total_count, fill: "#007bff" },

    { name: "Open", count: ticketData.Open, fill: "#AEB0B2" },
    { name: "In-Progress", count: ticketData.Inprogress, fill: "#85898C" },
    { name: "Resolved", count: ticketData.Resolved, fill: "#5D6166" },
    { name: "No-Response", count: ticketData.Noresponse, fill: "#343A40" },
  ];

  const donutChartData = [
    { name: "Open", value: ticketData.Open },
    { name: "In-Progress", value: ticketData.Inprogress },
    { name: "Resolved", value: ticketData.Resolved },
    { name: "No-Response", value: ticketData.Noresponse },
  ];

  const pieChartData = donutChartData;
  const totalTickets =
    ticketData.Resolved +
    ticketData.Inprogress +
    ticketData.Noresponse +
    ticketData.Open;

  return (
    <div className="container-fluid  position-relative" >
       <ToastContainer position="top-end" className="p-3" transition={Slide} />{" "}
     
      <h4 className="text-center text-primary mt-0">Ticket Insights</h4>

      <div className="row mt-4 d-flex align-items-stretch">
        <div className="col-12">
          <div className="card p-3 h-100">
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

      <div className="row mt-4 d-flex align-items-stretch">
        <div className="col-md-6">
          <div className="card p-3 h-100">
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
                  <span className="d-flex align-items-center gap-2">
                    {iconMap[item.name]} {item.name}
                  </span>
                  <span className="badge bg-secondary">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 h-100">
            {loading ? (
              <Skeleton height={100} />
            ) : (
              <div
                className="position-relative"
                style={{ width: "100%", height: 200 }}
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={donutChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={2}
                      onClick={handlePieClick}
                      label={renderCustomizedLabel}
                      labelLine={false}
                      startAngle={360} // <-- makes it anticlockwise
                      endAngle={0} // <-- makes it anticlockwise
                    >
                      {donutChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#ffffff"
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <h5 className="text-primary fw-bold mb-0">
                    {ticketData.total_count}
                  </h5>
                  <small className="text-secondary">Total Tickets</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
