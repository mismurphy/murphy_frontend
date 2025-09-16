import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import DataTable from 'react-data-table-component';

import MainCard from 'components/MainCard';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Workflow() {
  const [workflows, setWorkflows] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentData, setCurrentData] = useState({
    workflow_template_id: '',
    name: '',
    tat: '',
    document_id: '',
    status: 'active'
  });

  // Fetch all documents
  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load documents', 'error');
    }
  };

  // Fetch all workflows
  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/workflows');
      const data = res.data.data || [];

      const formatted = data.map(w => ({
        ...w,
        documentName: w.document?.name || '-'
      }));

      setWorkflows(formatted);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load workflows', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (documents.length > 0) {
      fetchWorkflows();
    }
  }, [documents]);

  // Add Workflow
  const handleAdd = () => {
    setCurrentData({
      workflow_template_id: '',
      name: '',
      tat: '',
      document_id: '',
      status: 'active'
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  // Edit Workflow
  const handleEdit = (row) => {
    setCurrentData({
      ...row,
      status: row.status.toLowerCase(),
      document_id: row.document_id?.toString() || ''
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Delete Workflow
  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete workflow "${row.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/workflows/${row.workflow_template_id}`);
        setWorkflows(workflows.filter(w => w.workflow_template_id !== row.workflow_template_id));
        Swal.fire('Deleted!', 'Workflow has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete workflow', 'error');
      }
    }
  };

  // Toggle Status
  const handleToggleStatus = async (row) => {
    const newStatus = row.status === 'active' ? 'inactive' : 'active';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Change status of "${row.name}" to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, set to ${newStatus}`
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/workflows/${row.workflow_template_id}`, {
          ...row,
          status: newStatus
        });

        setWorkflows(workflows.map(w =>
          w.workflow_template_id === row.workflow_template_id
            ? { ...w, status: newStatus }
            : w
        ));

        Swal.fire('Updated!', `Workflow status set to ${newStatus}.`, 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to update status', 'error');
      }
    }
  };

  // Form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentData(prev => ({ ...prev, [name]: value }));
  };

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentData.name || currentData.tat === '' || !currentData.document_id) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    const payload = {
      ...currentData,
      tat: parseInt(currentData.tat, 10),
      document_id: parseInt(currentData.document_id, 10),
      status: currentData.status.toLowerCase()
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/workflows/${currentData.workflow_template_id}`, payload);
        await fetchWorkflows();
        Swal.fire('Updated!', 'Workflow has been updated.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/workflows', payload);
        await fetchWorkflows();
        Swal.fire('Added!', 'New workflow has been added.', 'success');
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save workflow', 'error');
    }
  };

  // DataTable Columns
  const columns = [
    { name: '#', selector: (_, index) => index + 1, width: '60px' },
    { name: 'Workflow Name', selector: row => row.name, sortable: true },
    { name: 'TAT', selector: row => row.tat, sortable: true },
    { name: 'Document', selector: row => row.documentName, sortable: true },
    {
      name: 'Status',
      cell: row => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id={`switch-${row.workflow_template_id}`}
            checked={row.status === 'active'}
            onChange={() => handleToggleStatus(row)}
          />
          <label className="form-check-label" htmlFor={`switch-${row.workflow_template_id}`}>
            {row.status === 'active' ? 'Active' : 'Inactive'}
          </label>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    },
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex gap-2">
          <Button variant="outline-success" size="sm" onClick={() => handleEdit(row)}>
            <i className="ti ti-pencil me-1" />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row)}>
            <i className="ti ti-trash me-1" />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ];

  return (
    <MainCard title={<h3 className="mb-0 text-center fw-bold text-primary">Workflow List</h3>}>
      <div className="d-flex justify-content-end mb-4">
        <Button variant="outline-primary" className="fw-bold shadow-sm" onClick={handleAdd}>
          <i className="ti ti-plus me-2" />
          Add Workflow
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={workflows}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{isEditMode ? 'Edit Workflow' : 'Add Workflow'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label className="fw-bold">Workflow Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter workflow name"
                value={currentData.name}
                onChange={handleChange}
                disabled={isEditMode}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="tat">
              <Form.Label className="fw-bold">TAT (in days)</Form.Label>
              <Form.Control
                type="number"
                name="tat"
                placeholder="Enter turnaround time"
                value={currentData.tat}
                onChange={handleChange}
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="document_id">
              <Form.Label className="fw-bold">Select Document</Form.Label>
              <Form.Select
                name="document_id"
                value={currentData.document_id}
                onChange={handleChange}
              >
                <option value="">-- Select Document --</option>
                {documents.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
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
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
