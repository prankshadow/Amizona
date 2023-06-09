import axios from 'axios';
import React, { useEffect } from 'react'
import { useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../components/Rating';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { useContext } from 'react';
import { Store } from '../Store';



const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const ProductScreen = () => {

    const navigate = useNavigate();
    const params = useParams();
    const { slug } = params;


    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/products/slug/${slug}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry the Product is out of stock');
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity }
        });
        navigate('/cart');
    };

    return (
        loading ? <Loading /> : error ? <MessageBox variant='danger'>{error}</MessageBox>
            :
            (<div>
                <Container className='mt-3'>
                    <Row>
                        <Col md={6}>
                            <img className='single-product-img' src={product.image} alt={product.image} />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Helmet>
                                        <title>{product.name}</title>
                                    </Helmet>
                                    <h1>{product.name}</h1>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating rating={product.rating} numReviews={product.numReviews} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price : ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description:
                                    <p>{product.description}</p>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>${product.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>{product.countInStock > 0 ?
                                                    (<Badge bg="success">
                                                        In Stock
                                                    </Badge>) :
                                                    (<Badge bg="danger">
                                                        Out of Stock
                                                    </Badge>
                                                    )
                                                }</Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {product.countInStock > 0 ? (
                                            (<ListGroup.Item>
                                                <div className='d-grid'>
                                                    <Button variant='warning'
                                                        onClick={addToCartHandler} >
                                                        Add to cart
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>)
                                        ) : (<ListGroup.Item>
                                            <div className='d-grid'>
                                                <h6 style={{ "color": "red" }}>
                                                    The Product will be available soon
                                                </h6>
                                            </div>
                                        </ListGroup.Item>)
                                        }

                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>)
    );
}

export default ProductScreen