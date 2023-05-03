import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import Container from 'react-bootstrap/esm/Container';
import CheckoutSteps from '../components/CheckoutSteps';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import { Store } from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import Loading from '../components/Loading';


const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
}


const PlaceOrderScreen = () => {

    const navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false
    })

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const placeOrderHandler = async () => {
        try {
            dispatch({
                type: 'CREATE_REQUEST'
            });

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        authentication: userInfo.token
                    }
                }
            );
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);

        } catch (error) {
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(error));
        }
    }

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart, navigate])

    return (
        <div>
            <Helmet><title>Shipping Address</title></Helmet>
            <Container className='py-3'>
                <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            </Container>

            <Container>
                <h1 className="pb-3">Place Order</h1>
                <Row>
                    <Col md={8}>
                        {/* For shipping address FROM localStorage */}
                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>Shipping</Card.Title>
                                <Card.Text>
                                    <strong>Name: </strong>{cart.shippingAddress.fullName}<br />
                                    <strong>Address: </strong>{cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.postalCode},{cart.shippingAddress.country}
                                </Card.Text>
                                <Link to='/shipping'>Edit</Link>
                            </Card.Body>
                        </Card>

                        {/* For Payment FROM localStorage */}
                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>Payment</Card.Title>
                                <Card.Text>
                                    <strong>Method: </strong>{cart.paymentMethod}
                                </Card.Text>
                                <Link to='/payment'>Edit</Link>
                            </Card.Body>
                        </Card>

                        {/* For items */}
                        <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title>Items</Card.Title>
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item) => (
                                        <ListGroup.Item key={item._id}>
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <img src={item.image} className='img-fluid rounded img-thumbnail' alt={item.name}></img>{' '}
                                                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={3}><span>{item.quantity}</span></Col>
                                                <Col md={3}>${item.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Link to='/cart'>Edit</Link>
                            </Card.Body>
                        </Card>

                    </Col>

                    {/* Right column */}
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Order Summary</Card.Title>
                                <ListGroup variant='flush'>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items</Col>
                                            <Col>${cart.itemsPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping</Col>
                                            <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax</Col>
                                            <Col>${cart.taxPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Order Total</strong></Col>
                                            <Col><strong>${cart.totalPrice.toFixed(2)}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <div className='d-grid'>
                                            <Button type='button' variant='warning' onClick={placeOrderHandler} disabled={cart.cartItems.length === 0}>Place Order</Button>
                                        </div>
                                        {loading && <Loading />}
                                    </ListGroup.Item>

                                </ListGroup>
                            </Card.Body>
                        </Card>

                        {cart.itemsPrice < 100 &&
                            <Card className='mt-3'>
                                <Card.Body>
                                    <Card.Text>
                                        <span className='text-danger'>Add items worth $100 for free shipping</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        } {''}

                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default PlaceOrderScreen