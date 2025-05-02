import React, { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaEnvelopeOpen,
  FaCheckCircle,
  FaSpinner
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
  Cell
} from "recharts";

import { getInquiryStatusCount } from "../../services/AdminService";
import { useAuth } from "../../context/AuthProvider";

const statusMap = {
  ASN: { label: "Assigned", icon: <FaBriefcase />, color: "primary" },
  CLS: { label: "Closed", icon: <FaCheckCircle />, color: "danger" },
  CNR: { label: "Cancelled", icon: <FaEnvelopeOpen />, color: "secondary" },
  CRS: { label: "Created", icon: <FaEnvelopeOpen />, color: "info" },
  INP: { label: "In Progress", icon: <FaSpinner />, color: "warning" },
  OPN: { label: "Opened", icon: <FaEnvelopeOpen />, color: "success" }
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const [statusCounts, setStatusCounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Total");

  useEffect(() => {
    const fetchStatusData = async () => {
      setLoading(true);
      try {
        const res = await getInquiryStatusCount();
        const apiData = res.data || [];
        const totalCount = res.total_count || 0;

        // Ensure all statuses in statusMap are present, defaulting to 0
        const defaultMapped = Object.keys(statusMap).map(status => ({
          status,
          status_count: 0
        }));

        // Merge API data with defaults, keeping unique statuses
        const merged = [...defaultMapped, ...apiData];
        const normalized = merged.reduce((acc, curr) => {
          const existing = acc.find(item => item.status === curr.status);
          if (!existing) acc.push(curr);
          else existing.status_count += curr.status_count;
          return acc;
        }, []);

        setStatusCounts(normalized);
        setTotal(totalCount);
      } catch (error) {
        console.error("Error fetching status count:", error);
      }
      setLoading(false);
    };

    fetchStatusData();
  }, []);

  const getChartData = () => {
    const chartData = statusCounts.map(item => {
      const mapInfo = statusMap[item.status] || {};
      return {
        name: mapInfo.label || item.status,
        count: item.status_count,
        color: `var(--bs-${mapInfo.color || "secondary"})`
      };
    });
    return [{ name: "Total", count: total, color: "#007bff" }, ...chartData];
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <p className="fw-semibold">
          Welcome Admin for Client ID: <span className="text-primary">{user?.clientId}</span>
        </p>
      </div>

      <h2 className="text-center text-primary fw-bold mb-4">Inquiry Summary</h2>

      <div className="row g-4">
        {/* Cards Section */}
        <div className="col-lg-4">
          <div className="row g-3">
            <Card title="Total" value={total} icon={<FaBriefcase />} color="primary" onClick={() => setSelectedFilter("Total")} />
            {statusCounts.map((item, idx) => {
              const mapInfo = statusMap[item.status] || {};
              return (
                <Card
                  key={idx}
                  title={mapInfo.label || item.status}
                  value={item.status_count}
                  icon={mapInfo.icon || <FaBriefcase />}
                  color={mapInfo.color || "secondary"}
                  onClick={() => setSelectedFilter(mapInfo.label || item.status)}
                />
              );
            })}
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
                  <BarChart data={getChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Count">
                      {getChartData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={selectedFilter === entry.name ? entry.color : "#dee2e6"}
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
      className={`card text-white bg-${color} h-100 text-center p-3 shadow-sm`}
      onClick={onClick}
      role="button"
    >
      <div className="fs-2 mb-2">{icon}</div>
      <h5 className="mb-0">{title}</h5>
      <p className="fs-5">{value}</p>
    </div>
  </div>
);
