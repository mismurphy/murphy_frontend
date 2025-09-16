// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// project-imports
import DataTable from 'sections/user_management/Roles';

// ==============================|| BOOTSTRAP TABLE - BASIC TABLE ||============================== //

export default function Roles() {
  return (
    <Row>
       <Col sm={12}>
        <DataTable />
      </Col>
      
    </Row>
  );
}
