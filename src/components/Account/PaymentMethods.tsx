import { Table, Button } from 'react-bootstrap';

const PaymentMethods = () => {
    return (
        <>
            <h5 className="mt-4">Payment Methods</h5>
            <Button variant="success" className="mb-3">
                <i className="bi bi-plus-circle-fill"></i> Add New Payment Method
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Credit Card</td>
                        <td>**** **** **** 1234</td>
                        <td>
                            <Button size="sm" variant="warning" className="me-2">
                                <i className="bi bi-pencil-square"></i> Edit
                            </Button>
                            <Button size="sm" variant="danger">
                                <i className="bi bi-trash-fill"></i> Delete
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
};

export default PaymentMethods;
