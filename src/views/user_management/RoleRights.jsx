import React, { useState, useEffect } from "react";
import { Table, Form, Row, Col, Button, Modal } from "react-bootstrap";
import axios from "axios";
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

const RoleRights = () => {
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rights, setRights] = useState([]);
  const [roleRightsData, setRoleRightsData] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [checkedRights, setCheckedRights] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState(null);
  const [modalCheckedRights, setModalCheckedRights] = useState({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depRes, rolesRes, rightsRes, roleRightsRes, workflowsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/departments"),
          axios.get("http://localhost:5000/api/roles"),
          axios.get("http://localhost:5000/api/rights"),
          axios.get("http://localhost:5000/api/roleRights"),
          axios.get("http://localhost:5000/api/workflows"),
        ]);
        setDepartments(depRes.data);
        setRoles(rolesRes.data);
        setRights(rightsRes.data);
        setRoleRightsData(roleRightsRes.data);
        setWorkflows(workflowsRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (selectedRole) {
      const table = $('#rolesRightsTable').DataTable({
        paging: true,
        searching: true,
        info: false,
        lengthChange: false,
        destroy: true,
      });
      return () => table.destroy();
    }
  }, [selectedRole, rights, checkedRights]);

  useEffect(() => {
    if (showModal) {
      const modalTable = $('#modalRolesRightsTable').DataTable({
        paging: true,
        searching: true,
        info: false,
        lengthChange: false,
        destroy: true,
      });
      return () => modalTable.destroy();
    }
  }, [showModal]);

  // Filter roles based on department
  useEffect(() => {
    if (!selectedDept) return setFilteredRoles([]);
    setFilteredRoles(roles.filter((r) => r.dep_id === parseInt(selectedDept)));
    setSelectedRole("");
    setCheckedRights({});
  }, [selectedDept, roles]);

  // Set checked rights for selected role
  useEffect(() => {
  if (!selectedRole) return setCheckedRights({});
  
  // Find the selected role in roleRightsData
  const role = roleRightsData.find((r) => r.id === parseInt(selectedRole));
  if (!role) return setCheckedRights({});

  const rightsForRole = rights.reduce((acc, r) => {
    // Check if this right exists in the role's rights array
    acc[r.id] = role.rights?.some((rr) => rr.id === r.id) || false;
    return acc;
  }, {});

  setCheckedRights(rightsForRole);
}, [selectedRole, roleRightsData, rights]);


  const handleCheck = (right_id) => {
    setCheckedRights({ ...checkedRights, [right_id]: !checkedRights[right_id] });
  };

  const handleSave = async () => {
    if (!selectedRole) return alert("Select a role first");
    try {
      await axios.post("http://localhost:5000/api/roleRights", {
        roleId: parseInt(selectedRole),
        rights: Object.keys(checkedRights)
          .filter((rId) => checkedRights[rId])
          .map((rId) => parseInt(rId)),
      });
      const res = await axios.get("http://localhost:5000/api/roleRights");
      setRoleRightsData(res.data);
      alert("Rights assigned/updated!");
    } catch (err) {
      console.error(err);
      alert("Error saving rights!");
    }
  };

  const assignedRoles = roleRightsData
  .filter((role) => role.rights && role.rights.length > 0) // only roles that have rights
  .map((role) => {
    const dept = departments.find((d) => d.id === role.dep_id);
    return {
      role_id: role.id,
      role_name: role.name,
      department_name: dept?.name || "",
    };
  });



    console.log(assignedRoles);

  const handleView = async (role_id) => {
  const role = roleRightsData.find((r) => r.id === role_id);
  setModalRole(role);
  if (!role) return setModalCheckedRights({});
  const rightsForRole = rights.reduce((acc, r) => {
    acc[r.id] = role.rights?.some((rr) => rr.id === r.id) || false;
    return acc;
  }, {});
  setModalCheckedRights(rightsForRole);
  setShowModal(true);
};


  const handleModalCheck = (right_id) => {
    setModalCheckedRights({ ...modalCheckedRights, [right_id]: !modalCheckedRights[right_id] });
  };

  const handleModalSave = async () => {
    if (!modalRole) return;
    try {
      await axios.post("http://localhost:5000/api/roleRights", {
        roleId: modalRole.id,
        rights: Object.keys(modalCheckedRights)
          .filter((rId) => modalCheckedRights[rId])
          .map((rId) => parseInt(rId)),
      });
      const res = await axios.get("http://localhost:5000/api/roleRights");
      setRoleRightsData(res.data);
      setShowModal(false);
      alert("Rights updated!");
    } catch (err) {
      console.error(err);
      alert("Error saving rights!");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Role Rights Management</h3>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Department</Form.Label>
            <Form.Select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="">Select Role</option>
              {filteredRoles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {selectedRole && (
        <>
          <h5>Assign Rights</h5>
          <Table id="rolesRightsTable" striped bordered hover>
            <thead>
              <tr>
                <th>Right</th>
                <th>Workflow</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {rights.map((r) => {
                const workflow = workflows.find((w) => w.workflow_template_id === r.workflow_template_id);
                return (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.name || "-"}</td>
                    <td className="text-center">
                      <Form.Check
                        type="checkbox"
                        checked={checkedRights[r.id] || false}
                        onChange={() => handleCheck(r.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Button variant="primary" onClick={handleSave}>Save Rights</Button>
        </>
      )}

      <h5 className="mt-5">Already Assigned Roles</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Department</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignedRoles.map((ar) => (
            <tr key={ar.role_id}>
              <td>{ar.department_name}</td>
              <td>{ar.role_name}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleView(ar.role_id)}>View</Button>
              </td>
            </tr>
          ))}
          {assignedRoles.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No roles assigned yet</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalRole &&
              `${departments.find((d) => d.id === modalRole.dep_id)?.name} - ${modalRole.name}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table id="modalRolesRightsTable" striped bordered hover>
            <thead>
              <tr>
                <th>Right</th>
                <th>Workflow</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {rights.map((r) => {
                const workflow = workflows.find((w) => w.workflow_template_id === r.workflow_template_id);
                return (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.name || "-"}</td>
                    <td className="text-center">
                      <Form.Check
                        type="checkbox"
                        checked={modalCheckedRights[r.id] || false}
                        onChange={() => handleModalCheck(r.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleModalSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleRights;
