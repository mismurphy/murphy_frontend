import React, { useState, useEffect } from "react";
import axios from "axios";

const tables = [
  "customers",
  "customers_other_details",
  "customers_photos",
  "customers_shipping_details",
  "customers_billing_details",
  "customers_contact",
  "customers_terms",
];

const fields = {
  customers: ["cust_name", "gst_no", "udyam_reg_no", "cust_status", "pan", "aadhar"],
  customers_other_details: [
    "annual_turnover", "no_counters_in_chain", "list_of_other_products",
    "list_of_other_companies", "appoint_date"
  ],
  customers_photos: [
    "shop_image_1", "shop_image_2", "shop_image_3", "shop_image_4", "gst_certificate_image"
  ],
  customers_shipping_details: [
    "shipping_address", "shipping_city", "shipping_state", "shipping_pin_code"
  ],
  customers_billing_details: [
    "billing_address", "billing_city", "billing_state", "billing_pin_code"
  ],
  customers_contact: ["register_mobile", "register_email"],
  customers_terms: ["tally_name", "cust_branch", "cust_category"],
};

const requiredFields = {
  customers: ["cust_name", "gst_no", "pan"],
  customers_other_details: ["annual_turnover"],
  customers_photos: ["shop_image_1"],
  customers_shipping_details: ["shipping_address"],
  customers_billing_details: ["billing_address"],
  customers_contact: ["register_mobile"],
  customers_terms: ["tally_name"],
};

const initialFormData = Object.fromEntries(
  tables.map(table => [table, {}])
);

const CustomersPage = () => {
  // Table state
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (table, field, value) => {
    setFormData(prev => ({
      ...prev,
      [table]: {
        ...(prev[table] || {}),
        [field]: value,
      },
    }));
  };

  const isStepComplete = stepIndex => {
    const table = tables[stepIndex];
    return (requiredFields[table] || []).every(
      field =>
        formData[table]?.[field] !== undefined &&
        formData[table][field].toString().trim() !== ""
    );
  };

  const handleSave = async () => {
    try {
      if (editingCustomer) {
        await axios.put(
          `http://localhost:5000/api/customers/${editingCustomer.id}`,
          formData
        );
        setMessage("Customer updated!");
      } else {
        await axios.post("http://localhost:5000/api/customers", formData);
        setMessage("Customer added!");
      }
      fetchCustomers();
      closeModal();
    } catch (err) {
      console.error(err);
      setMessage("Error saving customer.");
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      fetchCustomers();
      setMessage("Customer deleted!");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting customer.");
    }
  };

  const openAddModal = () => {
    setFormData(initialFormData);
    setEditingCustomer(null);
    setActiveStep(0);
    setShowModal(true);
  };

  const openEditModal = customer => {
    setFormData(customer);
    setEditingCustomer(customer);
    setActiveStep(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setEditingCustomer(null);
    setActiveStep(0);
  };

  // Search + Pagination
  const filteredCustomers = customers.filter(
    c =>
      c.cust_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.gst_no?.toLowerCase().includes(search.toLowerCase()) ||
      c.pan?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage) || 1;
  const currentData = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const progressPercent = ((activeStep + 1) / tables.length) * 100;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Customers</h3>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, GST or PAN..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>GST No</th>
              <th>PAN</th>
              <th>Aadhar</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (<tr><td colSpan="6" className="text-center">Loading...</td></tr>)
              : currentData.length > 0
              ? currentData.map(cust => (
                  <tr key={cust.id}>
                    <td>{cust.id}</td>
                    <td>{cust.cust_name}</td>
                    <td>{cust.gst_no}</td>
                    <td>{cust.pan}</td>
                    <td>{cust.aadhar}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => openEditModal(cust)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(cust.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : (<tr><td colSpan="6" className="text-center">No customers found.</td></tr>)
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            >Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            >Next</button>
          </li>
        </ul>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCustomer ? "Edit Customer" : "Add Customer"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              {/* Modal Progress Bar + Steps */}
              <div className="px-3 pt-2 mb-3">
                <div className="d-flex justify-content-between mb-1">
                  {tables.map((table, index) => (
                    <span
                      key={table}
                      className={`badge text-bg-${index <= activeStep ? "success" : "secondary"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveStep(index)}
                    >{index + 1}</span>
                  ))}
                </div>
                <div className="progress" style={{ height: "20px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${progressPercent}%` }}
                    aria-valuenow={progressPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >Step {activeStep + 1} of {tables.length}</div>
                </div>
              </div>

              {/* Modal Body Multi-Step Form */}
              <div className="modal-body">
                <h6 className="mb-3 text-capitalize">
                  {tables[activeStep].replaceAll("_", " ")}
                </h6>
                <div className="row">
                  {fields[tables[activeStep]].map(field => (
                    <div className="col-12 col-md-6 mb-3" key={field}>
                      <label className="form-label">{field.replaceAll("_", " ")}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData[tables[activeStep]]?.[field] || ""}
                        required={requiredFields[tables[activeStep]]?.includes(field)}
                        onChange={e =>
                          handleInputChange(tables[activeStep], field, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button
                  className="btn btn-outline-primary"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => prev - 1)}
                >Previous</button>
                <button
                  className="btn btn-outline-primary"
                  disabled={!isStepComplete(activeStep) || activeStep === tables.length - 1}
                  onClick={() => setActiveStep(prev => prev + 1)}
                >Next</button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!isStepComplete(activeStep)}
                >
                  {editingCustomer ? "Update" : "Save & Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {message && (
        <div className="alert alert-info mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
