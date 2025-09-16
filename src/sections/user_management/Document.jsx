import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import MainCard from 'components/MainCard';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import DataTable from 'react-data-table-component';
import api from '../../api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentData, setCurrentData] = useState({ id: '', name: '', description: '' });

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/documents');
      setDocuments(res.data);
      setFilteredDocs(res.data);
    } catch (err) {
      Swal.fire('Error', 'Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const filtered = documents.filter(doc =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      (doc.description || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDocs(filtered);
  }, [search, documents]);

  const handleAdd = () => {
    setCurrentData({ id: '', name: '', description: '' });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (doc) => {
    setCurrentData(doc);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (doc) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete document "${doc.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/documents/${doc.id}`);
      fetchDocuments();
      Swal.fire('Deleted!', 'Document has been deleted.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to delete document', 'error');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEditMode && currentData.id) {
        await api.put(`/api/documents/${currentData.id}`, data);
        Swal.fire('Updated!', 'Document has been updated.', 'success');
      } else {
        await api.post(`/api/documents`, data);
        Swal.fire('Added!', 'New document has been added.', 'success');
      }
      setShowModal(false);
      fetchDocuments();
    } catch (err) {
      Swal.fire('Error', 'Failed to save document', 'error');
    }
  };

  const columns = [
    {
      name: 'Index',
      selector: (row, index) => index + 1,
      width: '80px',
      sortable: true,
      center: true,
    },
    {
      name: 'Document Name',
      selector: row => row.name,
      sortable: true,
      center: true,
    },
    {
      name: 'Description',
      selector: row => row.description || '-',
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex justify-content-center gap-2">
          <Button size="sm" variant="warning" onClick={() => handleEdit(row)}><FiEdit /></Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row)}><FiTrash2 /></Button>
        </div>
      ),
      center: true,
    },
  ];

  const customStyles = {
    headCells: { style: { fontWeight: 'bold', fontSize: '15px', textAlign: 'center' } },
    cells: { style: { textAlign: 'center' } },
  };

  return (
    <MainCard title={<h3 className="text-center fw-bold text-primary">Documents List</h3>}>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleAdd}>Add Document</Button>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredDocs}
          pagination
          highlightOnHover
          pointerOnHover
          responsive
          customStyles={customStyles}
          striped
        />
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{isEditMode ? 'Edit Document' : 'Add Document'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => { e.preventDefault(); onSubmit(currentData); }}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Document Name</Form.Label>
              <Form.Control
                type="text"
                value={currentData.name}
                onChange={(e) => setCurrentData({ ...currentData, name: e.target.value })}
                placeholder="Enter document name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentData.description}
                onChange={(e) => setCurrentData({ ...currentData, description: e.target.value })}
                placeholder="Enter description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{isEditMode ? 'Save Changes' : 'Add Document'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
