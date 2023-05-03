import React from 'react';
// import data from '../data'
// import { Link } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import { useReducer } from 'react';
// import logger from 'use-reducer-logger';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const HomeScreen = () => {

    // const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
        const [{ loading, error, products }, dispatch] = useReducer((reducer), {
        products: [],
        loading: true,
        error: '',
    });
    // const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('/api/products');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }

            // setProducts(result.data);
        };
        fetchData();
    }, []);




    return (
        <>
            <Helmet>
                <title>Amazona</title>
            </Helmet>
            {
                loading ? <Loading /> : error ? <MessageBox variant='danger'>{error}</MessageBox> :
                    <>
                        <h1 className="ps-4 pt-3">Featured Products</h1>
                        <div className="products">
                            <Container>

                                <Row>
                                    {products.map(product => (
                                        <Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
                                            <Product product={product}></Product>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        </div>
                    </>
            }
        </>
    )
}

export default HomeScreen