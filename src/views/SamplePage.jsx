import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Modal } from "react-bootstrap";

const API_URL = "http://localhost:5000/api/dynamic";

export default function DynamicCrudPage() {
  const [tables] = useState(["tests", "documents", "rights", "fg_name_details", "vendors"]);
  const [selectedTable, setSelectedTable] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [schema, setSchema] = useState({});
  const [lookups, setLookups] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!selectedTable) return;
    fetchData();
    fetchSchema();
  }, [selectedTable]);

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}/${selectedTable}`);
    setRows(res.data);
    if (res.data.length > 0) {
      setColumns(Object.keys(res.data[0]));
    } else {
      setColumns([]);
    }
  };

  const fetchSchema = async () => {
    const res = await axios.get(`${API_URL}/schema/${selectedTable}`);
    const schemaData = {};
    const lookupData = {};

    for (const col of res.data) {
      if (col.REFERENCED_TABLE_NAME) {
        schemaData[col.COLUMN_NAME] = {
          foreign: true,
          refTable: col.REFERENCED_TABLE_NAME,
        };

        // ✅ call only with table name
        const lookupRes = await axios.get(
          `${API_URL}/lookup/${col.REFERENCED_TABLE_NAME}`
        );
        lookupData[col.COLUMN_NAME] = lookupRes.data;
      } else {
        schemaData[col.COLUMN_NAME] = { foreign: false };
      }
    }

    setSchema(schemaData);
    setLookups(lookupData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openModal = (row = {}) => {
    setFormData(row);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (formData.id) {
      await axios.put(`${API_URL}/${selectedTable}/${formData.id}`, formData);
    } else {
      await axios.post(`${API_URL}/${selectedTable}`, formData);
    }
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`${API_URL}/${selectedTable}/${id}`);
    fetchData();
  };

  return (
    <div className="container mt-4">
      <h2>Dynamic CRUD Page</h2>
      <Form.Select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        className="mb-3"
      >
        <option value="">-- Select Table --</option>
        {tables.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Form.Select>

      {selectedTable && (
        <>
          <Button onClick={() => openModal({})} className="mb-2">
            ➕ Add Row
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => openModal(row)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {formData.id ? "Edit Row" : "Add New Row"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {columns.map((col) => (
              <Form.Group key={col} className="mb-2">
                <Form.Label>{col}</Form.Label>
                {schema[col]?.foreign ? (
                  <Form.Select
                    name={col}
                    value={formData[col] || ""}
                    onChange={handleChange}
                  >
                    <option value="">-- Select --</option>
                    {lookups[col]?.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    name={col}
                    value={formData[col] || ""}
                    onChange={handleChange}
                    disabled={col === "id"}
                  />
                )}
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
