import React, { useEffect, useState } from 'react';
import { getClient, deleteClient } from '../../../services/Service';  // Assuming your backend already handles status updates
import { Button, Table, Pagination } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AllClient = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const response = await getClient();
    if (response.status === 'success') {
      setClients(response.data);
    } else {
      console.error('Failed to fetch clients:', response.message);
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const result = await deleteClient(email);

      if (result.status === 'success') {
        alert('Client deleted successfully!');
        fetchClients();  // Fetch the updated list of clients
      } else {
        alert('Failed to delete client: ' + result.message);
      }
    }
  };

  const handleStatusChange = async (email, currentStatus) => {
    const newStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive';

    // Assuming that your backend is set up to handle this update logic
    const result = await fetch(`/api/clients/status/${email}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await result.json();

    if (data.status === 'success') {
      alert(`Client status updated to ${newStatus}`);
      fetchClients(); // Fetch the updated list of clients
    } else {
      alert('Failed to update client status: ' + data.message);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "AllClients.xlsx");
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClients = clients.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-center">All Clients</h4>
      <div className="d-flex justify-content-end mb-2">
        <Button variant="success" onClick={exportToExcel}>Export to Excel</Button>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Name</th>
              {/* <th>GSTIN</th> */}
              <th>Email</th>
              <th>Contact</th>
              {/* <th>Address</th> */}
              <th>No. of Employees</th>
              {/* <th>Description</th>
              <th>Status</th>
              <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {currentClients.map((client) => (
              <tr key={client.id}>
                <td className="text-center">{client.id}</td>
                <td>{client.Name || '-'}</td>
                {/* <td>{client.GSTIN && client.GSTIN !== 'null' ? client.GSTIN : '-'}</td> */}
                <td>{client.Email && client.Email !== 'null' ? client.Email : '-'}</td>
                <td>{client.ContactNumber && client.ContactNumber !== 'null' ? client.ContactNumber : '-'}</td>
                {/* <td>{client.Address && client.Address !== 'null' ? client.Address : '-'}</td> */}
                <td>{client.NoofEmp || 0}</td>
                {/* <td>{client.description && client.description !== 'null' ? client.description : '-'}</td>
                <td className="text-center">
                  <Button
                    variant={client.Status === 'Active' ? 'success' : 'secondary'}
                    size="sm"
                    onClick={() => handleStatusChange(client.Email, client.Status)}
                  >
                    {client.Status === 'Active' ? 'Active' : 'Inactive'}
                  </Button>
                </td> */}
                {/* <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="info" size="sm">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(client.Email)}>
                      <FaTrash />
                    </Button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination className="justify-content-center">
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default AllClient;
