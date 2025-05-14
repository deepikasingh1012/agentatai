// import React, { useState, useEffect } from "react";
// import Skeleton from "react-loading-skeleton";
// import { useNavigate} from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Cell,
//   PieChart,
//   Pie,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   faBriefcase,
//   faEnvelope,
//   faCheckCircle,
//   faSpinner,
// } from "@fortawesome/free-solid-svg-icons";
// import { getInquiryStatusCount } from "../../../services/AgentServices";

// const links = [
//   {
//     name: "Total",
//     url: "/TotalTicket",
//     icon: faBriefcase,
//     bgColor: "bg-primary",
//   },
//   {
//     name: "Opened",
//     url: "/OpenedTicket",
//     icon: faEnvelope,
//     bgColor: "bg-success",
//   },
//   {
//     name: "Closed",
//     url: "/ClosedTicket",
//     icon: faCheckCircle,
//     bgColor: "bg-danger",
//   },
//   {
//     name: "Inprogress",
//     url: "/InprogressTicket",
//     icon: faSpinner,
//     bgColor: "bg-warning",
//   },
// ];

// const COLORS = ["#007bff", "#28a745", "#dc3545", "#ffc107"];
// const clientId = localStorage.getItem("clientId");
// export default function Dashboard() {
//   const [ticketData, setTicketData] = useState({
//     total_count: 0,
//     Opened: 0,
//     Closed: 0,
//     Inprogress: 0,
//   });
//   const navigate = useNavigate();

// const handleBarClick = (statusName) => {
//   navigate("/agent/components/Tickets", { state: { filterFromDashboard: statusName } });
// };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const inquiryStatus = await getInquiryStatusCount();

//       let opened = 0;
//       let closed = 0;
//       let inprogress = 0;

//       inquiryStatus.data.forEach((item) => {
//         switch (item.status) {
//           case "OPN":
//             opened = item.status_count;
//             break;
//           // case 'CLS':
//           case "CRS":
//           case "CNR":
//             closed += item.status_count;
//             break;
//           case "INP":
//             inprogress = item.status_count;
//             break;
//           default:
//             break;
//         }
//       });

//       setTicketData({
//         total_count: inquiryStatus.total_count,
//         Opened: opened,
//         Closed: closed,
//         Inprogress: inprogress,
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const barChartData = [
//     { name: "Total", count: ticketData.total_count, fill: "#007bff" },
//     { name: "Opened", count: ticketData.Opened, fill: "#28a745" },
//     { name: "Closed", count: ticketData.Closed, fill: "#dc3545" },
//     { name: "Inprogress", count: ticketData.Inprogress, fill: "#ffc107" },
//   ];

//   const pieChartData = [
//     { name: "Total", value: ticketData.total_count },
//     { name: "Opened", value: ticketData.Opened },
//     { name: "Closed", value: ticketData.Closed },
//     { name: "Inprogress", value: ticketData.Inprogress },
//   ];

//   return (
//     <div className="container-fluid">
//       <h4 className="text-center text-primary mt-4">Tickets Analysis</h4>

//       <div className="row mt-4">
//         <div className="col-12">
//           <div className="card p-3">
//             {loading ? (
//               <Skeleton height={100} />
//             ) : (
//               <ResponsiveContainer width="100%" height={260}>
//                 <BarChart
//                   data={barChartData}
//                   margin={{ top: 10, right: 100, left: 0, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar
//                     dataKey="count"
//                     name="Ticket Count"
//                     barSize={80}
//                     onClick={({ name }) => handleBarClick(name)}
//                   >
//                     {barChartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.fill} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="row mt-4">
//         <div className="col-md-6">
//           <div className="card p-3">
//             <h5 className="text-center">Ticket Summary</h5>
//             <ul className="list-group">
//               {pieChartData.map((item, index) => (
//                 <li
//                   key={index}
//                   className="list-group-item d-flex justify-content-between align-items-center"
//                   style={{
//                     color: COLORS[index % COLORS.length],
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {item.name}
//                   <span className="badge bg-secondary">{item.value}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="card p-3">
//             {loading ? (
//               <Skeleton height={100} />
//             ) : (
//               <ResponsiveContainer width="100%" height={260}>
//                 <PieChart>
//                   <Pie
//                     data={pieChartData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={82}
//                     fill="#8884d8"
//                     label
//                   >
//                     {pieChartData.map((_, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
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
import { getInquiryStatusCount } from "../../../services/AgentServices";
import { FaListAlt, FaInbox, FaCheckCircle, FaSpinner } from "react-icons/fa";

const COLORS = ["#283593", "#a4b2dc", "#303F9F", "#6679bf"];
// const renderCustomizedLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

const Dashboard = () => {
  const [ticketData, setTicketData] = useState({
    total_count: 0,
    Open: 0,
    Resolved: 0,
    Noresponse: 0,
    Inprogress: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const iconMap = {
    Open: <FaInbox />,
    Resolved: <FaCheckCircle />,
    "No-Response": <FaCheckCircle />,
    "In-Progress": <FaSpinner />,
  };
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
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
      let resolved = 0;
      let noresponse = 0;
      let inprogress = 0;

      inquiryStatus.data.forEach((item) => {
        switch (item.status) {
          case "OPN":
            open = item.status_count;
            break;
          case "CRS":
            resolved = item.status_count;
            break;
          case "CNR":
            noresponse = item.status_count;
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
        Open: open,
        Resolved: resolved,
        Noresponse: noresponse,
        Inprogress: inprogress,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBarClick = (statusName) => {
    navigate("/agent/components/Tickets", {
      state: { filterFromDashboard: statusName },
    });
  };

  const handlePieClick = (_, index) => {
    const statusMap = ["Open", "Resolved", "No-Response", "In-Progress"];
    navigate("/agent/components/Tickets", {
      state: { filterFromDashboard: statusMap[index] },
    });
  };

  const barChartData = [
    { name: "Total", count: ticketData.total_count, fill: "#007bff" },
    { name: "Open", count: ticketData.Open, fill: "#a4b2dc" },
    { name: "Resolved", count: ticketData.Resolved, fill: "#303F9F" },
    { name: "No-Response", count: ticketData.Noresponse, fill: "#303F9F" },
    { name: "In-Progress", count: ticketData.Inprogress, fill: "#6679bf" },
  ];

  const donutChartData = [
    { name: "Open", value: ticketData.Open },
    { name: "Resolved", value: ticketData.Resolved },
    { name: "No-Response", value: ticketData.Noresponse },
    { name: "In-Progress", value: ticketData.Inprogress },
  ];

  const pieChartData = donutChartData;
  const totalTickets =
    ticketData.Resolved +
    ticketData.Noresponse +
    ticketData.Open +
    ticketData.Inprogress;

  return (
    <div className="container-fluid">
      <h4 className="text-center text-primary mt-4">Ticket Insights</h4>

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
