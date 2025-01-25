import { Table, Button } from 'react-bootstrap';

const Wishlist = () => {
    return (
        <>
            <h5 className="mt-4">Wishlist</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <img src="/assets/IMG-20241007-WA0017.jpg" alt="Product" style={{ width: '60px' }} />
                        </td>
                        <td>HP LaserJet Pro MFP M227fdw</td>
                        <td>KSh 32,000</td>
                        <td>
                            <Button size="sm" variant="danger">
                                <i className="bi bi-trash-fill"></i> Remove
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
};

export default Wishlist;
