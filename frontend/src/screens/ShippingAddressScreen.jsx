import React, { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async'
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingAddressScreen = () => {

    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart: { shippingAddress }
    } = state;

    const fName = shippingAddress.fullName;
    const add = shippingAddress.address;
    const cty = shippingAddress.city;
    const ptlcode = shippingAddress.postalCode;
    const cntry = shippingAddress.country;

    const [fullName, setFullName] = useState(fName || '');
    const [address, setAddress] = useState(add || '');
    const [city, setCity] = useState(cty || '');
    const [postalCode, setPostalCode] = useState(ptlcode || '');
    const [country, setCountry] = useState(cntry || '');

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping')
        }
    }, [userInfo, navigate])

    const submitHandler = (event) => {
        event.preventDefault();
        ctxDispatch({
            type: "SAVE_SHIPPING_ADDRESS",
            payload: {
                fullName, address, city, postalCode, country
            },
        });
        localStorage.setItem('shippingAddress', JSON.stringify({
            fullName, address, city, postalCode, country
        }));
        navigate('/payment')
    }

    return (
        <div>
            <Helmet><title>Shipping Address</title></Helmet>
            <Container className='py-3'>
                <CheckoutSteps step1 step2></CheckoutSteps>
            </Container>
            <div>
                
                <Container>
                <h1 className="pb-3">Shipping Address</h1>
                    <Row>
                        <Form onSubmit={submitHandler}>

                            <Form.Group className='mb-3' controlId='fullName'>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control value={fullName} onChange={(ev) => setFullName(ev.target.value)} required></Form.Control>
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='address'>
                                <Form.Label>Address</Form.Label>
                                <Form.Control value={address} onChange={(ev) => setAddress(ev.target.value)} required></Form.Control>
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='city'>
                                <Form.Label>City</Form.Label>
                                <Form.Control value={city} onChange={(ev) => setCity(ev.target.value)} required></Form.Control>
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='postalCode'>
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control value={postalCode} onChange={(ev) => setPostalCode(ev.target.value)} required></Form.Control>
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='country'>
                                <Form.Label>Country</Form.Label>
                                <Form.Control value={country} onChange={(ev) => setCountry(ev.target.value)} required></Form.Control>
                            </Form.Group>
                            <div className='mb-3'>
                                <Button variant='warning' type='submit'>Continue</Button>
                            </div>
                        </Form>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default ShippingAddressScreen