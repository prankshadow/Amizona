import React, { useContext, useEffect, useState } from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';



const PaymentMethodScreen = () => {

    const navigate = useNavigate();

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { shippingAddress, paymentMethod }
    } = state;

    const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || 'Paypal');

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');
    }

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    return (
        <div>
            <Container className='py-3'>
                <CheckoutSteps step1 step2 step3></CheckoutSteps>
            </Container>
            <Helmet><title>Payment Method</title></Helmet>
            <Container>
                <h1 className="pb-3">Payment Method</h1>
                <Form onSubmit={submitHandler}>
                    <div className='mb-3'>
                        <Form.Check
                            type='radio'
                            id='Paypal'
                            label='Paypal'
                            value='Paypal'
                            checked={paymentMethodName === 'Paypal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <Form.Check
                            type='radio'
                            id='Stripe'
                            label='Stripe'
                            value='Stripe'
                            checked={paymentMethodName === 'Stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <Button type='submit' variant='warning'>Continue</Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default PaymentMethodScreen