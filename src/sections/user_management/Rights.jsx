import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

import MainCard from 'components/MainCard';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

export default function Rights() {
  const [rights, setRights] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentData, setCurrentData] = useState({
    id: '',
    name: '',
    dep_id: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch all rights
  const fetchRights = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/rights');
      setRights(res.data);
    } catch (err) {
      Swal.fire('Error', 'Failed to load rights', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      Swal.fire('Error', 'Failed to load departments', 'error');
    }
  };

  useEffect(() => {
    fetchRights();
    fetchDepartments();
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (rights.length > 0) {
      const table = $('#rightsTable').DataTable({
        paging: true,
        searching: true,
        info: false,
        lengthChange: false,
        destroy: true
      });
      return () => table.destroy();
    }
  }, [rights]);

  const handleAdd = () => {
    setCurrentData({ id: '', name: '', dep_id: '' });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (row) => {
    setCurrentData({
      id: row.id,
      name: row.name || '',
      dep_id: row.dep_id ? String(row.dep_id) : ''
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete right "${row.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/rights/${row.id}`);
        setRights(rights.filter((d) => d.id !== row.id));
        Swal.fire('Deleted!', 'Right has been deleted.', 'success');
      } catch {
        Swal.fire('Error', 'Failed to delete right', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for duplicate name
    const exists = rights.find(
      (r) =>
        r.name.toLowerCase() === currentData.name.trim().toLowerCase() &&
        r.id !== currentData.id
    );
    if (exists) {
      return Swal.fire('Exists', 'Right name already exists.', 'warning');
    }

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/rights/${currentData.id}`, {
          name: currentData.name,
          dep_id: currentData.dep_id || null
        });

        setRights((prev) =>
          prev.map((r) =>
            r.id === currentData.id
              ? { ...r, name: currentData.name, dep_id: currentData.dep_id }
              : r
          )
        );

        Swal.fire('Updated!', 'Right has been updated.', 'success');
      } else {
        const res = await axios.post('http://localhost:5000/api/rights', {
          name: currentData.name,
          dep_id: currentData.dep_id || null
        });

        setRights((prev) => [...prev, res.data]);

        Swal.fire('Added!', 'New right has been added.', 'success');
      }

      setShowModal(false);
    } catch (err) {
      Swal.fire('Error', 'Failed to save right', 'error');
    }
  };

  return (
    <MainCard title={<h3 className="mb-0 text-center fw-bold">Rights List</h3>}>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-primary" onClick={handleAdd}>
          <i className="ti ti-plus me-1" />
          Add Right
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table id="rightsTable" className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Index</th>
                <th>Right Name</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rights.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>
                    {departments.find((d) => d.id === Number(row.dep_id))
                      ?.name || '-'}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Right' : 'Add Right'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Right Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter right name"
                value={currentData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="dep_id">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="dep_id"
                value={currentData.dep_id}
                onChange={handleChange}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Save Changes' : 'Add Right'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
