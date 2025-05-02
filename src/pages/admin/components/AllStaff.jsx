import React, { useEffect, useState } from "react";
import { getStaff, updateStaff, deleteStaff } from "../../../services/AdminService"; // Import API functions
import { FaEdit, FaTrash, FaSave, FaDownload } from "react-icons/fa"; // ✅ Added Download Icon

import * as XLSX from "xlsx"; // ✅ Import XLSX for Excel file handling
import { saveAs } from "file-saver";

const AllStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedStaff, setEditedStaff] = useState({});
  const clientId = localStorage.getItem("clientId");
  const [modal, setModal] = useState({ show: false, message: "", onConfirm: null });
  useEffect(() => {
    if (clientId) {
      fetchStaff();
    }
  }, [clientId]);

  const fetchStaff = async () => {
    try {
      const response = await getStaff();
      console.log("✅ Fetched Staff for Client ID:", clientId, response);

      if (response?.status === "success" && Array.isArray(response.data)) {
        setStaffList(response.data);
      } else {
        console.error("❌ No valid staff data found:", response);
        setStaffList([]);
      }
    } catch (error) {
      console.error("❌ Error fetching staff:", error);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (staff) => {
    setEditingId(staff.user_id);
    setEditedStaff({ ...staff });
  };

  const handleEditChange = (field, value) => {
    setEditedStaff((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!editedStaff.user_id) {
      console.error("❌ Error: Missing user_id in update request", editedStaff);
      setModal({ show: true, message: "❌ Error: Missing user ID!", onConfirm: null });
      return;
    }

    try {
      const updateData = {
        p_user_id: editedStaff.user_id,
        p_user_name: editedStaff.user_name.trim(),
        p_email: editedStaff.email.trim(),
        p_mobile: editedStaff.mobile.trim(),
        p_status: editedStaff.status,
        p_client_id: clientId,
      };

      console.log("📤 Sending Update Request:", updateData);

      await updateStaff(updateData);
      setModal({ show: true, message: "✅ Staff updated successfully!", onConfirm: fetchStaff });
      setEditingId(null);
      fetchStaff();
    } catch (error) {
      console.error("❌ Error updating staff:", error.response?.data || error.message);
      setModal({ show: true, message: "❌ Update failed. Try again!", onConfirm: null });
    }
  };


  const confirmDelete = (userId) => {
    setModal({
      show: true,
      message: "⚠️ Are you sure you want to delete this staff member?",
      onConfirm: () => handleDelete(userId),
    });
  };

  const handleDelete = async (userId) => {
    try {
      await deleteStaff(userId);
      setModal({ show: true, message: "✅ Staff deleted successfully!", onConfirm: fetchStaff });
    } catch (error) {
      console.error("❌ Error deleting staff:", error);
      setModal({ show: true, message: "❌ Deletion failed!", onConfirm: null });
    }
  };

 

  const handleDownloadExcel = () => {
    if (staffList.length === 0) {
      alert("No staff data available to export.");
      return;
    }
  
    const worksheet = XLSX.utils.json_to_sheet(staffList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StaffData");
  
    // Convert to binary and create a Blob
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
    // Save file
    saveAs(data, "Staff_List.xlsx");
    setModal({ show: true, message: "✅ Excel file downloaded!", onConfirm: null });
  };
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center bg-secondary text-white p-3 rounded mb-3">
        <h4 className="mb-0">Manage Staff</h4>
        <button className="btn btn-success d-flex align-items-center" onClick={handleDownloadExcel}>
          <FaDownload className="me-2" /> Download Excel
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading staff...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length > 0 ? (
                staffList.map((staff) => (
                  <tr key={staff.user_id}>
                    <td>{staff.user_id}</td>
                    <td>
                      {editingId === staff.user_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editedStaff.user_name}
                          onChange={(e) => handleEditChange("user_name", e.target.value)}
                        />
                      ) : (
                        staff.user_name
                      )}
                    </td>
                    <td>
                      {editingId === staff.user_id ? (
                        <input
                          type="email"
                          className="form-control"
                          value={editedStaff.email}
                          onChange={(e) => handleEditChange("email", e.target.value)}
                        />
                      ) : (
                        staff.email
                      )}
                    </td>
                    <td>
                      {editingId === staff.user_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editedStaff.mobile}
                          onChange={(e) => handleEditChange("mobile", e.target.value)}
                        />
                      ) : (
                        staff.mobile
                      )}
                    </td>
                    <td>
                      {editingId === staff.user_id ? (
                        <select
                          className="form-select"
                          value={editedStaff.status}
                          onChange={(e) => handleEditChange("status", Number(e.target.value))}
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      ) : staff.status === 0 ? (
                        "Inactive"
                      ) : (
                        "Active"
                      )}
                    </td>
                    <td>
                      {editingId === staff.user_id ? (
                        <FaSave
                          className="text-success fs-5"
                          role="button"
                          onClick={handleSaveChanges}
                          title="Save"
                        />
                      ) : (
                        <>
                          <FaEdit
                            className="text-primary me-2 fs-5"
                            role="button"
                            onClick={() => handleEditClick(staff)}
                            title="Edit"
                          />
                          <FaTrash
                            className="text-danger fs-5"
                            role="button"
                            onClick={() => confirmDelete(staff.user_id)}
                            title="Delete"
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No staff members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.show && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div className="bg-white p-4 rounded text-center shadow w-100" style={{ maxWidth: "400px" }}>
            <p className="mb-3">{modal.message}</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setModal({ show: false });
                modal.onConfirm && modal.onConfirm();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStaff;