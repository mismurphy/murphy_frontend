import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import axios from "axios";

import MainCard from 'components/MainCard';
import { Button } from 'react-bootstrap';

export default function BasicDataTable() {
    const tableRef = useRef(null);
    const [users, setUsers] = useState([]);

    // Fields to exclude
    const excludedFields = ['password', 'otp', 'otp_expiry', 'updated_at'];

    // Mapping API keys to friendly column names
    const columnNames = {
        id: "ID",
        name: "Full Name",
        email: "Email",
        mobile: "Mobile",
        createdAt: "Created At",
    };

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Initialize DataTable after users are loaded
    useEffect(() => {
        if (users.length) {
            const table = $(tableRef.current).DataTable({
                responsive: true,
                pageLength: 10,
                lengthMenu: [5, 10, 25, 50],
                autoWidth: false,
                columnDefs: [
                    { orderable: false, targets: -1 } // Disable ordering on Action column
                ],
            });
            return () => table.destroy(true);
        }
    }, [users]);

    // Filtered headers
    const tableHeaders = users[0]
        ? Object.keys(users[0]).filter((key) => !excludedFields.includes(key))
        : [];

    return (
        <MainCard title={<h3 className="mb-0 text-center fw-bold">User List</h3>}>
            {/* <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" size="sm" className="shadow-sm">
                    <i className="ti ti-user-plus me-1" />
                    Add User
                </Button>
            </div> */}

            <div className="table-responsive shadow-sm rounded">
                <table
                    ref={tableRef}
                    className="table table-striped table-hover table-bordered align-middle"
                    style={{ width: '100%' }}
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
                                {tableHeaders.map((key) => {
                                    let value = row[key];

                                    // Format date fields
                                    if (key === 'created_at' ) {
                                        value = value ? new Date(value).toLocaleString() : '-';
                                    }

                                    return (
                                        <td key={key} className="text-center">
                                            {value !== null ? value : '-'}
                                        </td>
                                    );
                                })}
                                <td className="text-center">
                                    <Button variant="secondary" size="sm" disabled>
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainCard>
    );
}
