import React, { useContext, useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import { Store } from '../Store'
import { toast } from 'react-toastify';
import { getError } from '../utils';

const SignupScreen = () => {
    const navigate = useNavigate();
    const { search } = useLocation();

    const redirectInURL = new URLSearchParams(search).get('redirect');
    const redirect = redirectInURL ? redirectInURL : '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password does not match')
            return;
        }

        try {

            const requestData = { name, email, password }

            const { data } = await axios.post("/api/users/signup", requestData);
            ctxDispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/')
        } catch (error) {
            // console.log(error);
            toast.error(getError(error));
        }

    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    return (
        <Container className='small-container'>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <h1 className='my-3'>Sign Up</h1>

            <Form onSubmit={submitHandler}>

                <Form.Group className='mb-3' controlId='text'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text'
                        value={name}
                        onChange={(ev) => setName(ev.target.value)} required />
                </Form.Group>

                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email'
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)} required />
                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password'
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)} required />
                </Form.Group>
                <div className='mb-3'>

                    <Form.Group className='mb-3' controlId='confirmpassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password'
                            value={confirmPassword}
                            onChange={(ev) => setConfirmPassword(ev.target.value)} required />
                    </Form.Group>
                    <div className='mb-3'>

                        <Button type='submit' variant='warning'>Sign Up</Button>

                    </div>
                    <div className='mb-3'>
                        Already have account? {' '}
                        <Link to={`/signup?redirect=${redirect}`}>
                            Sign-In
                        </Link>
                    </div>
                </div>
            </Form>
        </Container>

    )
}

export default SignupScreen