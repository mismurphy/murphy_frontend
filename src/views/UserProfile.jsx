// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| OTHER - SAMPLE PAGE ||============================== //

export default function UserProfilePage() {
    return (
        <MainCard>
            <Row className="justify-content-center">
                <Col md={6} className="text-center">
                    <InputGroup className="mb-3">
                        <Form.Control type="file" />
                        <Button variant="outline-secondary">Upload</Button>
                    </InputGroup>
                </Col>
            </Row>
            <Row className="g-4">

                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">Name</Form.Label>
                        <Form.Control type="text" placeholder="Readonly input here…" value={'Name'} readOnly />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">Department</Form.Label>
                        <Form.Control type="text" placeholder="Readonly input here…" value={'email@example.com'} readOnly />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">Designation</Form.Label>
                        <Form.Control type="text" placeholder="Readonly input here…" value={'email@example.com'} readOnly />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">Email</Form.Label>
                        <Form.Control type="email" placeholder="Readonly input here…" value={'email@example.com'} readOnly />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="Readonly input here…" value={'email@example.com'} readOnly />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">Aadhar Number</Form.Label>
                        <Form.Control type="text" placeholder="Readonly input here…" value={'email@example.com'} readOnly />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">Pan Number</Form.Label>
                        <Form.Control type="text" placeholder="Readonly input here…" value={'email@example.com'} readOnly />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">DOB</Form.Label>
                        <Form.Control type="date" placeholder="Readonly input here…" value={'email@example.com'} readOnly />
                    </div>
                </Col>
                <Col md={6}>
                    <div className="mb-0">
                        <Form.Label className="col-sm-3 col-form-label">Date of Joining</Form.Label>
                        <Form.Control type="date" placeholder="Readonly input here…" value={'email@example.com'} readOnly />
                    </div>
                </Col>

            </Row>
        </MainCard>
    );
}
