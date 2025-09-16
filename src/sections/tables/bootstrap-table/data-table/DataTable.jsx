import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

import MainCard from 'components/MainCard';
import { Modal, Button, Form } from 'react-bootstrap'; // make sure react-bootstrap is installed

export default function BasicDataTable() {
  const tableRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [currentData, setCurrentData] = useState({ id: '', firstName: '', lastName: '', username: '' });

  useEffect(() => {
    const table = $(tableRef.current).DataTable();
    return () => table.destroy(true);
  }, []);

  const handleEdit = (row) => {
    setCurrentData(row);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Data:', currentData);
    setShowModal(false);
  };

  return (
    <MainCard
      title="Bootstrap 5 DataTable with Modal Form"
      subheader={<p className="mb-0">DataTable with sorting, pagination, search, and editable modal form</p>}
    >
      <table ref={tableRef} className="table table-striped table-bordered table-dark" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {[ // Example data
            { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@ediy' },
            { id: 2, firstName: 'Jacob', lastName: 'Thornton', username: '@fat' },
            { id: 3, firstName: 'Larry', lastName: 'Bird', username: '@twitter' },
          ].map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.firstName}</td>
              <td>{row.lastName}</td>
              <td>{row.username}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={currentData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={currentData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={currentData.username}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
