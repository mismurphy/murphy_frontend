// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// project-imports
import DataTable from 'sections/fg_master/FgNameCreate';

// ==============================|| BOOTSTRAP TABLE - BASIC TABLE ||============================== //

export default function FgMasterCreate() {
  return (
    <Row>
       <Col sm={12}>
        <DataTable />
      </Col>
      
    </Row>
  );
}
