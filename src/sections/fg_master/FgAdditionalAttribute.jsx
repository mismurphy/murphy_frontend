import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import axios from "axios";
import { Edit2, Trash2 } from "lucide-react";

import MainCard from "components/MainCard";
import { Button, Modal, Form, Table } from "react-bootstrap";
import Select from "react-select";

export default function FgAttributeTable() {
  const tableRef = useRef(null);
  const [attributes, setAttributes] = useState([]);
  const [fgNames, setFgNames] = useState([]);
  const [units, setUnits] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAttr, setSelectedAttr] = useState(null);

  const columnNames = {
    id: "ID",
    fg_name: "FG Name",
    unit: "Unit",
    vendor: "Vendor",
    Bis_applicable: "BIS Applicable",
    bis_number: "BIS Number",
    hsn_number: "HSN Number",
    master: "Master",
    tanner: "Tanner",
    is_master_restricted: "Master Restricted",
    is_tanner_restricted: "Tanner Restricted",
    oem: "OEM",
    rtp: "RTP",
  };

  // Instead of single formData, we keep rows (for multiple FG names)
  const [formRows, setFormRows] = useState([]);

  // Fetch data
  const fetchAttributes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fg-attributes");
      setAttributes(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const fetchLookups = async () => {
    try {
      const [fgRes, unitRes, vendorRes] = await Promise.all([
        axios.get("http://localhost:5000/api/fg-name"),
        axios.get("http://localhost:5000/api/fg-units"),
        axios.get("http://localhost:5000/api/vendor"),
      ]);
      // only pending fg names
      setFgNames(fgRes.data.filter((fg) => fg.status === "pending_details"));
      setUnits(unitRes.data);
      setVendors(vendorRes.data);
    } catch (err) {
      console.error("Lookup fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchAttributes();
    fetchLookups();
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (attributes.length) {
      const table = $(tableRef.current).DataTable({
        responsive: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        autoWidth: false,
        columnDefs: [{ orderable: false, targets: -1 }],
      });
      return () => table.destroy(true);
    }
  }, [attributes]);

  const tableHeaders = [
    "id",
    "fg_name",
    "unit",
    "vendor",
    "Bis_applicable",
    "bis_number",
    "hsn_number",
    "master",
    "tanner",
    "is_master_restricted",
    "is_tanner_restricted",
    "oem",
    "rtp",
  ];

  // Handlers
  const handleAddNew = () => {
    setIsEditMode(false);
    setFormRows([]);
    setShowModal(true);
  };

  const handleEdit = (attr) => {
    setIsEditMode(true);
    setSelectedAttr(attr);
    setFormRows([
      {
        ...attr,
        fg_id: attr.fg_id,
        fg_unit_id: attr.fg_unit_id,
        Vendor_id: attr.Vendor_id,
      },
    ]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attribute?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/fg-attributes/${id}`);
      fetchAttributes();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle FG Name multiple select (react-select)
  const handleFgNameSelect = (ids) => {
    const newRows = ids.map((fgId) => {
      const fg = fgNames.find((f) => f.id === parseInt(fgId));
      return {
        fg_id: fg?.id || "",
        fg_unit_id: "",
        Vendor_id: "",
        Bis_applicable: false,
        bis_number: "",
        hsn_number: "",
        master: "",
        tanner: "",
        is_master_restricted: false,
        is_tanner_restricted: false,
        oem: false,
        rtp: false,
      };
    });
    setFormRows(newRows); // replace rows for selected FG names
  };

  // Update individual row field
  const handleRowChange = (index, field, value) => {
    setFormRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // update only first row for edit
        await axios.put(
          `http://localhost:5000/api/fg-attributes/${selectedAttr.id}`,
          formRows[0]
        );
      } else {
        // bulk create
        await axios.post("http://localhost:5000/api/fg-attributes/bulk", formRows);
      }
      setShowModal(false);
      fetchAttributes();
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
    }
  };

  return (
    <MainCard title={<h3 className="mb-0 text-center fw-bold">FG Attributes</h3>}>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" size="sm" onClick={handleAddNew}>
          Add Attribute
        </Button>
      </div>

      {/* DataTable */}
      <div className="table-responsive">
        <table ref={tableRef} className="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              {tableHeaders.map((key) => (
                <th key={key}>{columnNames[key] || key}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.fg_name?.fg_name || "-"}</td>
                <td>{row.unit?.name || "-"}</td>
                <td>{row.vendor?.company_name || "-"}</td>
                <td>{row.Bis_applicable ? "Yes" : "No"}</td>
                <td>{row.bis_number || "-"}</td>
                <td>{row.hsn_number || "-"}</td>
                <td>{row.master || "-"}</td>
                <td>{row.tanner || "-"}</td>
                <td>{row.is_master_restricted ? "Yes" : "No"}</td>
                <td>{row.is_tanner_restricted ? "Yes" : "No"}</td>
                <td>{row.oem ? "Yes" : "No"}</td>
                <td>{row.rtp ? "Yes" : "No"}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
                      <Edit2 size={16} />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Attribute" : "Add Attributes"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {!isEditMode && (
              <Form.Group className="mb-3">
                <Form.Label>FG Names (Pending Details)</Form.Label>
                <Select
                  isMulti
                  options={fgNames.map((fg) => ({
                    value: fg.id,
                    label: fg.fg_name,
                  }))}
                  onChange={(selectedOptions) =>
                    handleFgNameSelect(selectedOptions.map((opt) => opt.value))
                  }
                  placeholder="Select FG Names..."
                  classNamePrefix="react-select"
                />
              </Form.Group>
            )}

            {formRows.length > 0 && (
              <div style={{ maxHeight: "60vh", overflowY: "auto", overflowX: "auto" }}>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>FG Name</th>
                      <th>Unit</th>
                      <th>Vendor</th>
                      <th>BIS Applicable</th>
                      <th>BIS No</th>
                      <th>HSN No</th>
                      <th>Master</th>
                      <th>Tanner</th>
                      <th>Master Restricted</th>
                      <th>Tanner Restricted</th>
                      <th>OEM</th>
                      <th>RTP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>{fgNames.find((f) => f.id === row.fg_id)?.fg_name}</td>
                        <td>
                          <Form.Select
                            value={row.fg_unit_id}
                            required
                            onChange={(e) =>
                              handleRowChange(idx, "fg_unit_id", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {units.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Select
                            value={row.Vendor_id}
                            required
                            onChange={(e) =>
                              handleRowChange(idx, "Vendor_id", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {vendors.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.company_name}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={row.Bis_applicable}
                            required
                            onChange={(e) =>
                              handleRowChange(idx, "Bis_applicable", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            value={row.bis_number}
                            required
                            onChange={(e) =>
                              handleRowChange(idx, "bis_number", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            value={row.hsn_number}
                            required
                            onChange={(e) =>
                              handleRowChange(idx, "hsn_number", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            value={row.master}
                            required
                            onChange={(e) =>
                              handleRowChange(idx, "master", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            value={row.tanner}
                            required
                            onChange={(e) =>
                              handleRowChange(idx, "tanner", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={row.is_master_restricted}
                            onChange={(e) =>
                              handleRowChange(
                                idx,
                                "is_master_restricted",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={row.is_tanner_restricted}
                            onChange={(e) =>
                              handleRowChange(
                                idx,
                                "is_tanner_restricted",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={row.oem}
                            onChange={(e) =>
                              handleRowChange(idx, "oem", e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={row.rtp}
                            onChange={(e) =>
                              handleRowChange(idx, "rtp", e.target.checked)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? "Update" : "Save All"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
