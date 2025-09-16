import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import axios from "axios";
import { Eye, Edit2, Trash2 } from "lucide-react";

import MainCard from "components/MainCard";
import { Button, Modal, Form } from "react-bootstrap";

export default function BasicDataTable() {
  const tableRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [fgName, setfgName] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Sample dropdown data (replace with API fetch if needed)
  const [brands, setBrands] = useState([
    { id: 1, short_code: "BR1", name: "Brand 1" },
  ]);
  const [categories, setCategories] = useState([
    { id: 1, short_code: "CAT1", name: "Category 1" },
  ]);
  const [mounts, setMounts] = useState([
    { id: 1, short_code: "MNT1", name: "Mount 1" },
  ]);
  const [shapes, setShapes] = useState([
    { id: 1, short_code: "SHP1", name: "Shape 1" },
  ]);
  const [colors, setColors] = useState([
    { id: 1, short_code: "CLR1", name: "Color 1" },
  ]);

  const excludedFields = [
    "password",
    "otp",
    "otp_expiry",
    "updatedAt",
    "user_id",
    "mobile",
    "createdAt",
  ];
  const columnNames = { id: "ID", name: "FG Name", email: "FG Code" };

  const [formData, setFormData] = useState({
    brand_id: "",
    category: "",
    code_prefix: "",
    nameP: "",
    nameS: "",
    watt: "",
    mount: "",
    shape: "",
    color: "",
    product_code: "",
    product_name: "",
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fgname = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fg-name");

      // Log the full response
      console.log("Full response:", res);

      // Log only the data array
      console.log("Data fetched:", res.data.data);

      // Set state
      setfgName(res.data.data);
    } catch (err) {
      console.error("Error fetching fg-names:", err);
    }
  };


  useEffect(() => {
    fetchUsers();
    fgname();

  }, []);

  // Initialize DataTable after users are loaded
  useEffect(() => {
    if (users.length) {
      const table = $(tableRef.current).DataTable({
        responsive: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        autoWidth: false,
        columnDefs: [{ orderable: false, targets: -1 }],
      });
      return () => table.destroy(true);
    }
  }, [users]);

  const tableHeaders = users[0]
    ? Object.keys(users[0]).filter((key) => !excludedFields.includes(key))
    : [];

  // --- Modal handlers ---
  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      brand_id: "",
      category: "",
      code_prefix: "",
      nameP: "",
      nameS: "",
      watt: "",
      mount: "",
      shape: "",
      color: "",
      product_code: "",
      product_name: "",
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData({
      brand_id: user.brand_id || "",
      category: user.category || "",
      code_prefix: user.code_prefix || "",
      nameP: user.nameP || "",
      nameS: user.nameS || "",
      watt: user.watt || "",
      mount: user.mount || "",
      shape: user.shape || "",
      color: user.color || "",
      product_code: user.product_code || "",
      product_name: user.product_name || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FG?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/users/${selectedUser.id}`,
          formData
        );
      } else {
        await axios.post(`http://localhost:5000/api/users`, formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Generate FG Code dynamically
  const generateFGCode = (data) => {
    // Combine Brand, Category, Code Prefix, Mount, Shape, Color
    if (!data.brand_id || !data.category || !data.code_prefix) return "";
    return `${data.brand_id}${data.category}${data.code_prefix}${data.mount || ""
      }${data.shape || ""}${data.color || ""}`.toUpperCase();
  };

  // Generate FG Name dynamically
  const generateFGName = (data) => {
    if (!data.nameP) return "";
    return `${data.nameP} ${data.nameS || ""}`.trim();
  };

  // Handle field changes and auto-update code & name
  const handleFormChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    updatedData.product_code = generateFGCode(updatedData);
    updatedData.product_name = generateFGName(updatedData);
    setFormData(updatedData);
  };

  // Handle dropdown including "Add New" option
  const handleDropdownChange = (field, value) => {
    if (value === "add_new") {
      alert(`You clicked Add New for ${field}. Implement your logic here.`);
      handleFormChange(field, "");
    } else {
      handleFormChange(field, value);
    }
  };

  return (
    <MainCard
      title={<h3 className="mb-0 text-center fw-bold">FG Name List</h3>}
    >
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          size="sm"
          className="shadow-sm"
          onClick={handleAddNew}
        >
          <i className="ti ti-user-plus me-1" />
          Add FG NAME
        </Button>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table
          ref={tableRef}
          className="table table-striped table-hover table-bordered align-middle"
          style={{ width: "100%" }}
        >
          <thead className="table-light">
            <tr>
              {tableHeaders.map((key) => (
                <th key={key} className="text-center text-capitalize">
                  {columnNames[key] || key}
                </th>
              ))}
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.id} className="align-middle">
                {tableHeaders.map((key) => (
                  <td key={key} className="text-center">
                    {row[key] || "-"}
                  </td>
                ))}
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="d-flex align-items-center justify-content-center"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="d-flex align-items-center justify-content-center"
                      onClick={() => handleEdit(row)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="d-flex align-items-center justify-content-center"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{isEditMode ? "Edit FG" : "Add New FG"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row g-3">
              {/* Brand & Category */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Brand</Form.Label>
                  <Form.Select
                    value={formData.brand_id}
                    onChange={(e) =>
                      handleDropdownChange("brand_id", e.target.value)
                    }
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.short_code} - {b.name}
                      </option>
                    ))}
                    <option value="add_new">➕ Add New</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) =>
                      handleDropdownChange("category", e.target.value)
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.short_code}>
                        {c.short_code} - {c.name}
                      </option>
                    ))}
                    <option value="add_new">➕ Add New</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Code Prefix & Name */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Code Prefix</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.code_prefix}
                    onChange={(e) =>
                      handleFormChange("code_prefix", e.target.value)
                    }
                    placeholder="e.g. JUN"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Name Primary</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nameP}
                    onChange={(e) => handleFormChange("nameP", e.target.value)}
                    placeholder="e.g. AURA"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Name Secondary</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nameS}
                    onChange={(e) => handleFormChange("nameS", e.target.value)}
                    placeholder="e.g. Smart"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Watt</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.watt}
                    onChange={(e) => handleFormChange("watt", e.target.value)}
                    placeholder="e.g. 3W"
                  />
                </Form.Group>
              </div>

              {/* Mount, Shape & Color */}
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Mount</Form.Label>
                  <Form.Select
                    value={formData.mount}
                    onChange={(e) =>
                      handleDropdownChange("mount", e.target.value)
                    }
                  >
                    <option value="">Select Mount</option>
                    {mounts.map((m) => (
                      <option key={m.id} value={m.short_code}>
                        {m.short_code} - {m.name}
                      </option>
                    ))}
                    <option value="add_new">➕ Add New</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Shape</Form.Label>
                  <Form.Select
                    value={formData.shape}
                    onChange={(e) =>
                      handleDropdownChange("shape", e.target.value)
                    }
                  >
                    <option value="">Select Shape</option>
                    {shapes.map((s) => (
                      <option key={s.id} value={s.short_code}>
                        {s.short_code} - {s.name}
                      </option>
                    ))}
                    <option value="add_new">➕ Add New</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Color</Form.Label>
                  <Form.Select
                    value={formData.color}
                    onChange={(e) =>
                      handleDropdownChange("color", e.target.value)
                    }
                  >
                    <option value="">Select Color</option>
                    {colors.map((c) => (
                      <option key={c.id} value={c.short_code}>
                        {c.short_code} - {c.name}
                      </option>
                    ))}
                    <option value="add_new">➕ Add New</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Auto-generated FG Code & Name */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>FG Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.product_code}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>FG Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.product_name}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="fw-bold">
              {isEditMode ? "Save Changes" : "Add FG"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
