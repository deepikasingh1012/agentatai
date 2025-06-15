import React, { useEffect, useState } from "react";
import { getStaff, updateStaff, softDeleteStaff } from "../../../services/AdminService";
import { FaEdit, FaTrash, FaSave, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AllStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedStaff, setEditedStaff] = useState({});
  // const clientId = localStorage.getItem("clientId");
  const clientId = sessionStorage.getItem("clientId");
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10; // Show 10 staff members per page

  useEffect(() => {
    if (clientId) {
      fetchStaff();
    }
  }, [clientId]);

  const fetchStaff = async () => {
    try {
      const response = await getStaff();
      if (response?.status === "success" && Array.isArray(response.data)) {
        setStaffList(response.data);
      } else {
        setStaffList([]);
        toast.error("No valid staff data found.");
      }
    } catch (error) {
      setStaffList([]);
      toast.error("Error fetching staff.");
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
      toast.error("Missing user ID!");
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

      await updateStaff(updateData);
      toast.success("Staff updated successfully!");
      setEditingId(null);
      fetchStaff();
    } catch (error) {
      toast.error("Update failed. Try again!");
    }
  };

  // const handleDeleteStaff = async (userId) => {
  //   if (window.confirm("Are you sure you want to inactive this staff member?")) {
  //     try {
  //       const response = await softDeleteStaff(userId);
  //       if (response.status === "success") {
  //         toast.success(response.message);
  //         fetchStaff(); // refresh list
  //       } else {
  //         toast.error("Failed to delete staff.");
  //       }
  //     } catch (error) {
  //       toast.error("Error during soft delete.");
  //     }
  //   }
  // };
  
  const handleDeleteStaff = async (userId) => {
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to inactive this staff member?</p>
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-sm btn-danger me-2"
              onClick={async () => {
                try {
                  const response = await softDeleteStaff(userId);
                  if (response.status === "success") {
                    toast.success(response.message);
                    fetchStaff(); // refresh list
                  } else {
                    toast.error("Failed to delete staff.");
                  }
                } catch (error) {
                  toast.error("Error during soft delete.");
                }
                toast.dismiss(toastId); // Close confirmation toast
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => toast.dismiss(toastId)}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };
  

  const handleDownloadExcel = () => {
    if (staffList.length === 0) {
      toast.info("No staff data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(staffList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StaffData");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Staff_List.xlsx");
    toast.success("Excel file downloaded!");
  };

  const totalPages = Math.ceil(staffList.length / itemsPerPage);
const paginatedStaff = staffList.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center bg-secondary text-white p-3 rounded mb-3">
        <h4 className="mb-2 mb-md-0">Manage Staff</h4>
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
                {/* <th>ID</th> */}
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length > 0 ? (
                paginatedStaff.map((staff) => (

                  <tr key={staff.user_id}>
                    {/* <td>{staff.user_id}</td> */}
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
        onClick={() => handleDeleteStaff(staff.user_id)}
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

           <div className="d-flex justify-content-center align-items-center gap-2 mt-3 flex-wrap">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <button
            key={pageNumber}
            className={`btn btn-sm ${currentPage === pageNumber ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setCurrentPage(pageNumber)}
        >
            {pageNumber}
        </button>
    ))}
</div>
        </div>
      )}
    </div>
  );
};

export default AllStaff;
