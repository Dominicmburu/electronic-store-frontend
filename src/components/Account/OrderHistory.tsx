import { Table, Button } from 'react-bootstrap';

const OrderHistory = () => {
    return (
        <>
            <h5 className="mt-4">Order History</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ORD1001</td>
                        <td>October 10, 2024</td>
                        <td>KSh 74,500</td>
                        <td>Delivered</td>
                        <td>
                            <Button size="sm" variant="info">
                                <i className="bi bi-eye"></i> View
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
};

export default OrderHistory;
