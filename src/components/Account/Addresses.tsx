import { Table, Button } from 'react-bootstrap';

const Addresses = () => {
    return (
        <>
            <h5 className="mt-4">Address Book</h5>
            <Button variant="success" className="mb-3">
                <i className="bi bi-plus-circle-fill"></i> Add New Address
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>123 Tech Avenue, Nairobi, Kenya</td>
                        <td>Shipping</td>
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

export default Addresses;
