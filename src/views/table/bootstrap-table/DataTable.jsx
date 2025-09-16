// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// project-imports
import DataTable from 'sections/tables/bootstrap-table/data-table/DataTable';

// ==============================|| BOOTSTRAP TABLE - BASIC TABLE ||============================== //

export default function BasicDataTablePage() {
  return (
    <Row>
      <Col sm={12}>
        <DataTable />
      </Col>
      
    </Row>
  );
}
