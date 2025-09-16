import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import MainCard from 'components/MainCard';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { userValidationSchema } from 'utils/validationSchema';

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
    defaultValues: currentData
  });

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments & roles
  const fetchDepartmentsAndRoles = async () => {
    try {
      const [depRes, roleRes] = await Promise.all([
        axios.get('http://localhost:5000/api/departments'),
        axios.get('http://localhost:5000/api/roles')
      ]);
      setDepartments(depRes.data);
      setRoles(roleRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartmentsAndRoles();
  }, []);

  const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : '');

  // Add new employee
  const handleAdd = () => {
    const emptyData = {
      emp_id: '',
      name: '',
      dep_id: '',
      designation: '',
      role_id: '',
      registered_email: '',
      phone_number: '',
      address: '',
      aadhar_num: '',
      image_aadhar: '',
      pan_num: '',
      image_pan: '',
      dob: '',
      doj: '',
      activeYN: 'Y'
    };
    setCurrentData(emptyData);
    setIsEditMode(false);
    setShowModal(true);
    reset(emptyData);
  };

  // Edit employee
  const handleEdit = (row) => {
    const editData = {
      ...row,
      dep_id: row.dep_id || '',
      role_id: row.role_id || '',
      dob: formatDate(row.dob),
      doj: formatDate(row.doj),
      image_aadhar: row.image_aadhar || '',
      image_pan: row.image_pan || '',
      activeYN: row.activeYN || 'Y'
    };
    setCurrentData(editData);
    setIsEditMode(true);
    setShowModal(true);
    reset(editData);
  };

  // Delete employee
  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete employee "${row.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/employees/${row.emp_id}`);
      setEmployees(employees.filter((e) => e.emp_id !== row.emp_id));
      Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to delete employee', 'error');
    }
  };

  // Toggle Active / Inactive
  const handleActiveToggle = () => {
    const newStatus = watch('activeYN') === 'Y' ? 'N' : 'Y';
    setValue('activeYN', newStatus);
    setCurrentData(prev => ({ ...prev, activeYN: newStatus }));
  };

  // Submit form
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append all non-file fields
    Object.keys(data).forEach((key) => {
      if (key === "image_aadhar" || key === "image_pan") return; // skip file fields
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    // Only append files if the user selected a new one
    if (data.image_aadhar && data.image_aadhar[0]) {
      formData.append("image_aadhar", data.image_aadhar[0]);
    }
    if (data.image_pan && data.image_pan[0]) {
      formData.append("image_pan", data.image_pan[0]);
    }

    try {
      if (isEditMode && currentData.emp_id) {
        await axios.put(`http://localhost:5000/api/employees/${currentData.emp_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        Swal.fire("Updated!", "Employee has been updated.", "success");
      } else {
        await axios.post(`http://localhost:5000/api/employees`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        Swal.fire("Added!", "New employee has been added.", "success");
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire("Error", err.response?.data?.message || "Failed to save employee", "error");
    }
  };

console.log(departments);
console.log(departments['1']);

  return (
    <MainCard title={<h3 className="mb-0 text-center fw-bold text-primary">Employee List</h3>}>
      <div className="d-flex justify-content-end mb-4">
        <Button variant="outline-primary" onClick={handleAdd}>
          <i className="ti ti-plus me-2" /> Add Employee
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Email</th>
                <th>User ID</th>
                <th>Phone</th>
                <th>DOB</th>
                <th>Date Of Joining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {employees.map((row, index) => (
                <tr key={row.emp_id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{row.name || '-'}</td>
                  <td>{departments.find(d => d.id === row.dep_id)?.name || '-'}</td>
                  <td>{row.designation || '-'}</td>
                  <td>{roles.find(d => d.id === row.role_id)?.name || '-'}</td>
                  <td>{row.registered_email || '-'}</td>
                  <td>{row.user_id || '-'}</td>
                  <td>{row.phone_number || '-'}</td>
                  <td>{row.dob ? new Date(row.dob).toLocaleDateString() : '-'}</td>
                  <td>{row.doj ? new Date(row.doj).toLocaleDateString() : '-'}</td>
                  <td className="text-center">
                    <span className={`badge ${row.activeYN === 'Y' ? 'bg-success' : 'bg-secondary'}`}>
                      {row.activeYN === 'Y' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <Button variant="outline-success" size="sm" onClick={() => handleEdit(row)}>
                        <i className="ti ti-pencil me-1" /> Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row)}>
                        <i className="ti ti-trash me-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{isEditMode ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" {...register('name', userValidationSchema.name)} />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </Form.Group>

            {/* Department */}
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select {...register('dep_id', userValidationSchema.dep_id)}>
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Form.Select>
              {errors.dep_id && <small className="text-danger">{errors.dep_id.message}</small>}
            </Form.Group>

            {/* Role */}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select {...register('role_id', userValidationSchema.role_id)}>
                <option value="">Select Role</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Form.Select>
              {errors.role_id && <small className="text-danger">{errors.role_id.message}</small>}
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" {...register('registered_email', userValidationSchema.registered_email)} />
              {errors.registered_email && <small className="text-danger">{errors.registered_email.message}</small>}
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" {...register('phone_number', userValidationSchema.phone_number)} />
              {errors.phone_number && <small className="text-danger">{errors.phone_number.message}</small>}
            </Form.Group>

            {/* Designation */}
            <Form.Group className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control type="text" {...register('designation', userValidationSchema.designation)} />
              {errors.designation && <small className="text-danger">{errors.designation.message}</small>}
            </Form.Group>

            {/* Aadhaar Number & Image */}
            <Form.Group className="mb-3">
              <Form.Label>Aadhaar Number</Form.Label>
              <Form.Control type="text" {...register('aadhar_num', userValidationSchema.aadhar_num)} />
              {errors.aadhar_num && <small className="text-danger">{errors.aadhar_num.message}</small>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Aadhaar Image</Form.Label>
              {currentData.image_aadhar && (
                <div className="mb-2">
                  <img
                    src={`http://localhost:5000/${currentData.image_aadhar}`}
                    alt="Aadhaar"
                    style={{ width: '150px', marginBottom: '10px' }}
                  />
                  <div>Current File: <strong>{currentData.image_aadhar}</strong></div>
                </div>
              )}
              <Form.Control
                type="file"
                {...register('image_aadhar', {
                  validate: (fileList) => {
                    console.log(fileList)
                    // If no file selected
                    if (!fileList || fileList.length === 0) {
                      return isEditMode ? true : 'Aadhaar image is required';
                    }

                    // console.log(isEditMode)

                    const file = fileList[0];

                    // Validate file type
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    console.log(file.type)
                    if (!allowedTypes.includes(file.type)) {
                      return isEditMode ? true : 'Only jpeg, jpg, png files are allowed';
                    }

                    // Validate file size
                    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
                    if (file.size > maxSizeInBytes) {
                      return 'File size must be less than 5 MB';
                    }

                    return true;
                  }
                })}
              />


              {errors.image_aadhar && <small className="text-danger">{errors.image_aadhar.message}</small>}
            </Form.Group>

            {/* PAN Number & Image */}
            <Form.Group className="mb-3">
              <Form.Label>PAN Number</Form.Label>
              <Form.Control type="text" {...register('pan_num', userValidationSchema.pan_num)} />
              {errors.pan_num && <small className="text-danger">{errors.pan_num.message}</small>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>PAN Image</Form.Label>
              {currentData.image_pan && (
                <div className="mb-2">
                  <img
                    src={`http://localhost:5000/${currentData.image_pan}`}
                    alt="PAN"
                    style={{ width: '150px', marginBottom: '10px' }}
                  />
                  <div>Current File: <strong>{currentData.image_pan}</strong></div>
                </div>
              )}
              <Form.Control
                type="file"
                {...register('image_pan', {
                  validate: (fileList) => {
                    console.log(fileList)
                    // If no file selected
                    if (!fileList || fileList.length === 0) {
                      return isEditMode ? true : 'Pan image is required';
                    }

                    // console.log(isEditMode)

                    const file = fileList[0];

                    // Validate file type
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    console.log(file.type)
                    if (!allowedTypes.includes(file.type)) {
                      return isEditMode ? true : 'Only jpeg, jpg, png files are allowed';
                    }

                    // Validate file size
                    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
                    if (file.size > maxSizeInBytes) {
                      return 'File size must be less than 5 MB';
                    }

                    return true;
                  }
                })}
              />


              {errors.image_pan && <small className="text-danger">{errors.image_pan.message}</small>}
            </Form.Group>

            {/* DOB */}
            {/* <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" {...register('dob', userValidationSchema.dob)} />
              {errors.dob && <small className="text-danger">{errors.dob.message}</small>}
            </Form.Group> */}

            {/* DOJ */}
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" {...register('dob', {
                required: 'Date of Birth is required',
                pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Date of Birth must be in YYYY-MM-DD format' },
                validate: (value) => {
                  const today = new Date();
                  const dob = new Date(value);
                  let age = today.getFullYear() - dob.getFullYear();
                  const m = today.getMonth() - dob.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                  return age >= 18 || 'Employee must be at least 18 years old';
                }
              })} />
              {errors.dob && <small className="text-danger">{errors.dob.message}</small>}
            </Form.Group>

            {/* Date of Joining */}
            <Form.Group className="mb-3">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control type="date" {...register('doj', {
                required: 'Date of Joining is required',
                pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Date of Joining must be in YYYY-MM-DD format' },
                validate: (value) => {
                  const today = new Date();
                  const doj = new Date(value);
                  return doj <= today || 'Date of Joining cannot be in the future';
                }
              })} />
              {errors.doj && <small className="text-danger">{errors.doj.message}</small>}
            </Form.Group>

            {/* Active Toggle */}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Active / Inactive"
                checked={watch('activeYN') === 'Y'}
                onChange={handleActiveToggle}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{isEditMode ? 'Save Changes' : 'Add Employee'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
