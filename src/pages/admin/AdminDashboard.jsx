// import React, { useState, useEffect } from "react";
// import {
//   FaBriefcase,
//   FaEnvelopeOpen,
//   FaCheckCircle,
//   FaSpinner
// } from "react-icons/fa";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
//   Cell
// } from "recharts";

// import { getInquiryStatusCount } from "../../services/AdminService";
// import { useAuth } from "../../context/AuthProvider";

// const COLORS = {
//   Total: "#007bff",
//   Opened: "#a4b2dc",
//   Closed: "#303F9F",
//   Inprogress: "#6679bf"
// };

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const [statusCounts, setStatusCounts] = useState({
//     Opened: 0,
//     Closed: 0,
//     Inprogress: 0,
//     Total: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [selectedFilter, setSelectedFilter] = useState("Total");

//   useEffect(() => {
//     const fetchStatusData = async () => {
//       setLoading(true);
//       try {
//         const res = await getInquiryStatusCount();
//         const apiData = res.data || [];
//         const totalCount = res.total_count || 0;

//         let opened = 0;
//         let closed = 0;
//         let inprogress = 0;

//         apiData.forEach(item => {
//           switch (item.status) {
//             case "OPN":
//               opened += item.status_count;
//               break;
//             case "CLS":
//             case "CRS":
//             case "CNR":
//               closed += item.status_count;
//               break;
//             case "INP":
//               inprogress += item.status_count;
//               break;
//             default:
//               break;
//           }
//         });

//         setStatusCounts({
//           Total: totalCount,
//           Opened: opened,
//           Closed: closed,
//           Inprogress: inprogress
//         });
//       } catch (error) {
//         console.error("Error fetching status count:", error);
//       }
//       setLoading(false);
//     };

//     fetchStatusData();
//   }, []);

//   const getChartData = () => [
//     { name: "Total", count: statusCounts.Total, color: COLORS.Total },
//     { name: "Opened", count: statusCounts.Opened, color: COLORS.Opened },
//     { name: "Closed", count: statusCounts.Closed, color: COLORS.Closed },
//     { name: "Inprogress", count: statusCounts.Inprogress, color: COLORS.Inprogress }
//   ];

//   const cards = [
//   {
//     title: "Total",
//     value: statusCounts.Total,
//     icon: <FaBriefcase />,
//     color: COLORS.Total
//   },
//   {
//     title: "Opened",
//     value: statusCounts.Opened,
//     icon: <FaEnvelopeOpen />,
//     color: COLORS.Opened
//   },
//   {
//     title: "Closed",
//     value: statusCounts.Closed,
//     icon: <FaCheckCircle />,
//     color: COLORS.Closed
//   },
//   {
//     title: "Inprogress",
//     value: statusCounts.Inprogress,
//     icon: <FaSpinner />,
//     color: COLORS.Inprogress
//   }
// ];

//   return (
//     <div className="container py-4">
//       <div className="mb-4">
//         {/* <p className="fw-semibold">
//           Welcome Admin for Client ID:{" "}
//           <span className="text-primary">{user?.clientId}</span>
//         </p> */}

//       </div>

//       <h2 className="text-center text-primary fw-bold mb-4">Inquiry Summary</h2>

//       <div className="row g-4">
//         {/* Cards Section */}
//         <div className="col-lg-4">
//           <div className="row g-3">
//             {cards.map((card, idx) => (
//               <Card
//                 key={idx}
//                 title={card.title}
//                 value={card.value}
//                 icon={card.icon}
//                 color={card.color}
//                 onClick={() => setSelectedFilter(card.title)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Chart Section */}
//         <div className="col-lg-8">
//           <div className="card shadow">
//             <div className="card-body">
//               <h5 className="card-title">Inquiry Overview</h5>
//               {loading ? (
//                 <p className="text-center my-4">Loading...</p>
//               ) : (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart
//                     data={getChartData()}
//                     margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" name="Count">
//                       {getChartData().map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={
//                             selectedFilter === entry.name
//                               ? entry.color
//                               : "#dee2e6"
//                           }
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const Card = ({ title, value, icon, color, onClick }) => (
//   <div className="col-6">
//     <div
//       className="card h-100 text-center p-3 shadow-sm text-white"
//       onClick={onClick}
//       role="button"
//       style={{ backgroundColor: color }}
//     >
//       <div className="fs-2 mb-2">{icon}</div>
//       <h5 className="mb-0">{title}</h5>
//       <p className="fs-5">{value}</p>
//     </div>
//   </div>
// );
import React, { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaEnvelopeOpen,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

import { getInquiryStatusCount } from "../../services/AdminService";
import { useAuth } from "../../context/AuthProvider";

const COLORS = {
  Total: "#26327F",
  Opened: "#007bff",
  Inprogress: "#a4b2dc",
  Resolved: "#303F9F",
  Noresponse: "#6679bf",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [statusCounts, setStatusCounts] = useState({
    Total: 0,
    Opened: 0,
    Inprogress: 0,
    Resolved: 0,
    Noresponse: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Total");

  useEffect(() => {
    const fetchStatusData = async () => {
      setLoading(true);
      try {
        const res = await getInquiryStatusCount();
        const apiData = res.data || [];
        const totalCount = res.total_count || 0;

        let opened = 0;
        let resolved = 0;
        let noresponse = 0;
        let inprogress = 0;

        apiData.forEach((item) => {
          switch (item.status) {
            case "OPN":
              opened += item.status_count;
              break;
            case "INP":
              inprogress += item.status_count;
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

        setStatusCounts({
          Total: totalCount,
          Opened: opened,
          Resolved: resolved,
          Noresponse: noresponse,
          Inprogress: inprogress,
        });
      } catch (error) {
        console.error("Error fetching status count:", error);
      }
      setLoading(false);
    };

    fetchStatusData();
  }, []);

  const getChartData = () => [
    { name: "Total", count: statusCounts.Total, color: COLORS.Total },
    { name: "Open", count: statusCounts.Opened, color: COLORS.Opened },
    {
      name: "In-progress",
      count: statusCounts.Inprogress,
      color: COLORS.Inprogress,
    },
    { name: "Resolved", count: statusCounts.Resolved, color: COLORS.Resolved },
    {
      name: "No-Response",
      count: statusCounts.Noresponse,
      color: COLORS.Noresponse,
    },
  ];

  const cards = [
    // {
    //   title: "Total",
    //   value: statusCounts.Total,
    //   icon: <FaBriefcase />,
    //   color: COLORS.Total,
    // },
    {
      title: "Open",
      value: statusCounts.Opened,
      icon: <FaEnvelopeOpen />,
      color: COLORS.Opened,
    },
    {
      title: "In-Progress",
      value: statusCounts.Inprogress,
      icon: <FaSpinner />,
      color: COLORS.Inprogress,
    },
    {
      title: "Resolved",
      value: statusCounts.Resolved,
      icon: <FaCheckCircle />,
      color: COLORS.Resolved,
    },
    {
      title: "No-Response",
      value: statusCounts.Noresponse,
      icon: <FaCheckCircle />,
      color: COLORS.Noresponse,
    },
  ];

  return (
    <div className="container py-4">
      <div className="mb-4">
        {/* <p className="fw-semibold">
          Welcome Admin for Client ID:{" "}
          <span className="text-primary">{user?.clientId}</span>
        </p> */}
      </div>

      <h2 className="text-center text-primary fw-bold mb-4">Inquiry Summary</h2>

      <div className="row g-4">
        {/* Cards Section */}
        <div className="col-lg-4">
          <div className="row g-3">
            {cards.map((card, idx) => (
              <Card
                key={idx}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                onClick={() => setSelectedFilter(card.title)}
              />
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Inquiry Overview</h5>
              {loading ? (
                <p className="text-center my-4">Loading...</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getChartData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Count">
                      {getChartData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            selectedFilter === entry.name
                              ? entry.color
                              : "#dee2e6"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value, icon, color, onClick }) => (
  <div className="col-6">
    <div
      className="card h-100 text-center p-3 shadow-sm text-white"
      onClick={onClick}
      role="button"
      style={{ backgroundColor: color }}
    >
      <div className="fs-2 mb-2">{icon}</div>
      <h5 className="mb-0">{title}</h5>
      <p className="fs-5">{value}</p>
    </div>
  </div>
);
