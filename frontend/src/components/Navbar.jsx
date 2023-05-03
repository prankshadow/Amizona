import React, { useContext } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { Store } from '../Store'


const Navbar = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const signoutHandler = () => {

        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
    }

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Amazona</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Features</Link>
                        </li>


                        {/* If login show USER name else SIGNIN */}
                        {userInfo ? (
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {userInfo.name}
                                </Link>
                                <ul className="dropdown-menu">
                                    <li>
                                        <ul className="list-unstyled">
                                            {/* <li><Link className="dropdown-item">User Profile</Link></li>
                                            <li><Link className="dropdown-item" to='/orderhistory'>Order history</Link></li> */}
                                            {/* <li><hr className="dropdown-divider" /></li> */}
                                            <li><Link className="dropdown-item" onClick={signoutHandler}>Sign Out</Link></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/signin">Sign In</Link>
                            </li>
                        )}
                        {userInfo && userInfo.isAdmin && (
                            <>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Admin
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item" to="/orderhistory">Order History</Link></li>
                                    </ul>
                                </li>
                            </>
                        )}

                    </ul>
                </div>
                <div className='me-3 position-relative'>
                    <Link to='/cart'><i className="fa-solid fa-cart-shopping fs-4 position-relative" style={{ "color": "#ffffff" }}></i>
                        {cart.cartItems.length > 0 && (
                            <>
                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                                    {/* {cart.cartItems.length} */}
                                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                                </span>
                                <span className="visually-hidden">unread messages</span>
                            </>
                        )}
                    </Link>
                </div>
            </div>
        </nav >

    )
}

export default Navbar