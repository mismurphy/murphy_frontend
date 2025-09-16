import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import MainCard from 'components/MainCard';
import { Modal, Button, Form } from 'react-bootstrap';

export default function WorkflowSteps() {
  const [steps, setSteps] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [currentStep, setCurrentStep] = useState({
    workflow_template_id: '',
    step_number: '',
    name: '',
    assigned_department: null,
    assigned_user_id: null,
    tat: '',
    is_auto_approved: false,
    stepAction: 'append'
  });
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [stepsRes, depsRes, usersRes, workflowsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/workflow-steps'),
        axios.get('http://localhost:5000/api/departments'),
        axios.get('http://localhost:5000/api/users'),
        axios.get('http://localhost:5000/api/workflows')
      ]);

      setSteps(stepsRes.data.data || stepsRes.data);
      setDepartments(depsRes.data.data || depsRes.data);
      setUsers(usersRes.data.data || usersRes.data);
      setWorkflows(workflowsRes.data.data || workflowsRes.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Open modal for adding
  const handleAdd = () => {
    const lastStep = steps.filter(s => s.workflow_template_id == selectedWorkflow).length;
    setCurrentStep({
      workflow_template_id: selectedWorkflow || '',
      step_number: lastStep + 1,
      name: '',
      assigned_department: null,
      assigned_user_id: null,
      tat: '',
      is_auto_approved: false,
      stepAction: 'append'
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (step) => {
    setCurrentStep({
      ...step,
      assigned_department: step.assigned_department || null,
      assigned_user_id: step.assigned_user_id || null,
      stepAction: 'append'
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Delete a step
  const handleDelete = async (step) => {
    const result = await Swal.fire({
      title: 'Are you sure?', text: `Delete step "${step.name}"?`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/workflow-steps/${step.step_id}`);
        fetchData();
        Swal.fire('Deleted!', 'Workflow step has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete workflow step', 'error');
      }
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentStep(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value === '' ? null : value
    }));
  };

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentStep.name || !currentStep.workflow_template_id || !currentStep.step_number) {
      Swal.fire('Validation Error', 'Please fill all required fields.', 'warning');
      return;
    }

    try {
      const payload = {
        ...currentStep,
        assigned_department: currentStep.assigned_department ? parseInt(currentStep.assigned_department) : null,
        assigned_user_id: currentStep.assigned_user_id || null,
        step_number: parseInt(currentStep.step_number),
        tat: currentStep.tat ? parseInt(currentStep.tat) : null
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/workflow-steps/${currentStep.step_id}`, payload);
        Swal.fire('Updated!', 'Workflow step has been updated.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/workflow-steps', payload);
        Swal.fire('Added!', 'New workflow step has been added.', 'success');
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save workflow step', 'error');
    }
  };

  // DataTable columns
  const columns = [
    { name: '#', selector: (row, index) => index + 1 },
    { name: 'Step Number', selector: row => row.step_number },
    { name: 'Step Name', selector: row => row.name, sortable: true },
    { name: 'TAT', selector: row => row.tat, sortable: true },
    !selectedWorkflow && { name: 'Workflow', selector: row => workflows.find(w => w.workflow_template_id === row.workflow_template_id)?.name || '-' },
    { name: 'Department', selector: row => departments.find(d => d.id === row.assigned_department)?.name || '-'  },
    { name: 'Assigned User', selector: row => users.find(u => u.id === row.assigned_user_id)?.name || '-' },
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
  ].filter(Boolean);

  return (
    <MainCard title={<h3 className="mb-0 text-center fw-bold text-primary">Workflow Steps</h3>}>
      {/* Workflow Selector */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Select
          value={selectedWorkflow || ""}
          onChange={(e) => setSelectedWorkflow(e.target.value)}
          style={{ maxWidth: "300px" }}
        >
          <option value="">-- Select Workflow --</option>
          {workflows.filter(ws => ws.status === 'active').map(ws => (
            <option key={ws.workflow_template_id} value={ws.workflow_template_id}>
              {ws.name}
            </option>
          ))}
        </Form.Select>

        <Button
          variant="outline-primary"
          className="fw-bold shadow-sm"
          onClick={handleAdd}
          disabled={!selectedWorkflow}
        >
          <i className="ti ti-plus me-2" /> Add Step
        </Button>
      </div>

      {/* Steps Table */}
      <DataTable
        columns={columns}
        data={steps.filter(s => {
          const workflow = workflows.find(w => w.workflow_template_id === s.workflow_template_id);
          return workflow?.status === 'active' && (!selectedWorkflow || s.workflow_template_id == selectedWorkflow);
        })}
        // data={steps.filter(s => !selectedWorkflow || s.workflow_template_id == selectedWorkflow)}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{isEditMode ? 'Edit Workflow Step' : 'Add Workflow Step'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Step Name</Form.Label>
              <Form.Control type="text" name="name" value={currentStep.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">TAT</Form.Label>
              <Form.Control type="number" name="tat" value={currentStep.tat || ''} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Step Number</Form.Label>
              <Form.Control
                type="number"
                name="step_number"
                value={currentStep.step_number || ''}
                onChange={handleChange}
                min={1}
                required
                disabled={currentStep.stepAction === 'append'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Step Number Action</Form.Label>
              <Form.Check
                type="radio"
                label="Append (auto last step)"
                name="stepAction"
                value="append"
                checked={currentStep.stepAction === 'append'}
                onChange={() => {
                  const lastStep = steps.filter(s => s.workflow_template_id == currentStep.workflow_template_id).length;
                  setCurrentStep(prev => ({
                    ...prev,
                    stepAction: 'append',
                    step_number: lastStep + 1
                  }));
                }}
              />
              <Form.Check
                type="radio"
                label="Insert and Renumber"
                name="stepAction"
                value="renumber"
                checked={currentStep.stepAction === 'renumber'}
                onChange={() => {
                  setCurrentStep(prev => ({
                    ...prev,
                    stepAction: 'renumber',
                    step_number: '' // clear for manual entry
                  }));
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Department</Form.Label>
              <Form.Select name="assigned_department" value={currentStep.assigned_department || ''} onChange={handleChange}>
                <option value="">-- Select Department --</option>
                {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Assigned User</Form.Label>
              <Form.Select name="assigned_user_id" value={currentStep.assigned_user_id || ''} onChange={handleChange}>
                <option value="">-- Select User --</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Auto Approved" name="is_auto_approved" checked={currentStep.is_auto_approved} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="fw-bold">{isEditMode ? 'Save Changes' : 'Add Step'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
