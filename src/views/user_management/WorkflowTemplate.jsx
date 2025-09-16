// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// project-imports
import DataTable from 'sections/user_management/WorkflowTemplate';

// ==============================|| BOOTSTRAP TABLE - BASIC TABLE ||============================== //

export default function WorkflowTemplate() {
  return (
    <Row>
       <Col sm={12}>
        <DataTable />
      </Col>
      
    </Row>
  );
}
