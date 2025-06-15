// import React, { useEffect, useState } from 'react';
// import { getClient, deleteClient } from '../../../services/Service';  // Assuming your backend already handles status updates
// import { Button, Table, Pagination } from 'react-bootstrap';
// import * as XLSX from 'xlsx';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const AllClient = () => {
//   const [clients, setClients] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const fetchClients = async () => {
//     const response = await getClient();
//     if (response.status === 'success') {
//       setClients(response.data);
//     } else {
//       console.error('Failed to fetch clients:', response.message);
//     }
//   };




//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(clients);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
//     XLSX.writeFile(workbook, "AllClients.xlsx");
//   };

//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentClients = clients.slice(indexOfFirst, indexOfLast);

//   const totalPages = Math.ceil(clients.length / itemsPerPage);
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3 text-center">All Clients</h4>
//       <div className="d-flex justify-content-end mb-2">
//         <Button variant="success" onClick={exportToExcel}>Export to Excel</Button>
//       </div>
//       <div className="table-responsive">
//         <Table striped bordered hover>
//           <thead className="table-dark text-center">
//             <tr>
//               <th>#</th>
//               <th>Orgnization Name</th>
//               {/* <th>GSTIN</th> */}
//               <th>Email</th>
//               <th>Contact</th>
//               {/* <th>Address</th> */}
//               <th>No. of Employees</th>
//               {/* <th>Description</th>

//               <th>Actions</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {currentClients.map((client) => (
//               <tr key={client.id}>
//                 <td className="text-center">{client.id}</td>
//                 <td>{client.Name || '-'}</td>
//                 {/* <td>{client.GSTIN && client.GSTIN !== 'null' ? client.GSTIN : '-'}</td> */}
//                 <td>{client.Email && client.Email !== 'null' ? client.Email : '-'}</td>
//                 <td>{client.ContactNumber && client.ContactNumber !== 'null' ? client.ContactNumber : '-'}</td>
//                 {/* <td>{client.Address && client.Address !== 'null' ? client.Address : '-'}</td> */}
//                 <td>{client.NoofEmp || 0}</td>

//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//             <div className="d-flex justify-content-center align-items-center gap-2 mt-3 flex-wrap">
//     {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
//         <button
//             key={pageNumber}
//             className={`btn btn-sm ${currentPage === pageNumber ? "btn-primary" : "btn-outline-primary"}`}
//             onClick={() => setCurrentPage(pageNumber)}
//         >
//             {pageNumber}
//         </button>
//     ))}
// </div>
//     </div>
//   );
// };

// export default AllClient;


import React, { useEffect, useState } from 'react';
import { getClient, updateClientById } from '../../../services/Service';
import { Button, Table, Toast, ToastContainer } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { FaEdit, FaSave } from 'react-icons/fa';

const AllClient = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editedEmail, setEditedEmail] = useState('');
  const [editedContact, setEditedContact] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [emailError, setEmailError] = useState('');
const [contactError, setContactError] = useState('');


  const itemsPerPage = 10;

  // useEffect(() => {
  //   fetchClients();
  // }, []);

  useEffect(() => {
    fetchClients();

    const refreshHandler = () => {
      console.log("🔄 Refreshing clients from AddStaff...");
      fetchClients();
    };

    window.addEventListener("refreshClients", refreshHandler);

    return () => {
      window.removeEventListener("refreshClients", refreshHandler);
    };
  }, []);


  const fetchClients = async () => {
    const response = await getClient();
    if (response.status === 'success') {
      setClients(response.data);
    } else {
      console.error('Failed to fetch clients:', response.message);
    }
  };

  const handleEditClick = (client) => {
    setEditingClientId(client.id);
    setEditedEmail(client.Email);
    setEditedContact(client.ContactNumber);

  };

  const handleSaveClick = async (client) => {

    // const isValidEmail = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/.test(editedEmail);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedEmail);
  const isValidContact = /^[6-9]\d{9}$/.test(editedContact);

  // Reset errors
  setEmailError('');
  setContactError('');

  let hasError = false;

  if (!isValidEmail) {
    setEmailError('Enter a valid email address (e.g., user@example.com).');
    hasError = true;
  }

  if (!isValidContact) {
    setContactError('Enter a valid 10-digit mobile number (starting with 6–9).');
    hasError = true;
  }

  if (hasError) return; // ⛔ Skip saving
  
    try {
      const updatedData = {
        client_id: client.id,
        client_name: client.Name || '',
        client_email: editedEmail,
        client_contact_number: editedContact,
      };

      await updateClientById(updatedData);
      setEditingClientId(null);
      fetchClients(); // Refresh after update
      setShowToast(true); // Show success toast
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
    XLSX.writeFile(workbook, 'AllClients.xlsx');
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClients = clients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(clients.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-center">All Clients</h4>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={exportToExcel}>Export to Excel</Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Organization Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>No. of Employees</th>
              <th>Actions</th>
            </tr>
          </thead>
          
        <tbody>
  {currentClients.map((client) => (
    <tr key={client.id}>
      <td className="text-center">{client.id}</td>
      <td>{client.Name || '-'}</td>

      {/* ✅ Email field + error */}
      <td>
        {editingClientId === client.id ? (
          <>
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="form-control"
            />
            {emailError && (
              <div className="alert alert-warning py-1 mt-1 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <small>{emailError}</small>
              </div>
            )}
          </>
        ) : (
          client.Email || '-'
        )}
      </td>

      {/* ✅ Contact number field + error */}
      <td>
        {editingClientId === client.id ? (
          <>
            <input
              type="tel"
              value={editedContact}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setEditedContact(value);
                }
              }}
              className="form-control"
            />
            {contactError && (
              <div className="alert alert-warning py-1 mt-1 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <small>{contactError}</small>
              </div>
            )}
          </>
        ) : (
          client.ContactNumber || '-'
        )}
      </td>

      <td>{client.NoofEmp || 0}</td>
      <td className="text-center">
        {editingClientId === client.id ? (
          <Button
            variant="success"
            size="sm"
            className="me-2"
            onClick={() => handleSaveClick(client)}
          >
            <FaSave />
          </Button>
        ) : (
          <Button
            variant="link"
            size="sm"
            className="text-primary me-2 p-0"
            onClick={() => handleEditClick(client)}
          >
            <FaEdit size={18} />
          </Button>
        )}
      </td>
    </tr>
  ))}
</tbody>

        </Table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`btn btn-sm ${currentPage === pageNumber ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* ✅ Toast for update confirmation */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Client updated successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AllClient;
