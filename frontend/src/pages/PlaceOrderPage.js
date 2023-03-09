import React, { useContext, useEffect, useReducer } from 'react'
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async'
import CheckoutSteps from '../components/CheckoutSteps'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link, useNavigate } from 'react-router-dom'
import {FaEdit} from 'react-icons/fa'

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true }
        case 'CREATE_SUCCESS':
            return { ...state, loading: false }
        case 'CREATE_FAIL':
            return { ...state, loading: false }

        default:
            return state
    }
}

export default function PlaceOrderPage() {
    const navigate = useNavigate()

    const [{ loading, error }, dispatch] = useReducer(reducer, {
        loading: false,
        error: ''
    })

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart } = state
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100 // rounds to 2 decimals
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
    )
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10)
    cart.taxPrice = round2(0.15 * cart.itemsPrice)
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice
    const placeOrderHandler = async () => {
        navigate('/orderdetails')
    }
    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart, navigate])

    return (
        <div>
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <h1 className='my-3'>Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card className='my-3'>
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {cart.shippingAddress.name} <br />
                                <strong>Address:</strong> {cart.shippingAddress.address},{' '}
                                {cart.shippingAddress.city},{' '}
                                {cart.shippingAddress.postal},{' '}
                                {cart.shippingAddress.country}.
                            </Card.Text>
                            <Link to='/shipping'> <FaEdit size='1.3em'/> </Link>
                        </Card.Body>
                    </Card>

                    <Card className='my-3'>
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {cart.paymentMethod} <br />
                            </Card.Text>
                            <Link to='/payment'> <FaEdit size='1.3em'/> </Link>
                        </Card.Body>

                    </Card>
                    <Card className='my-3'>
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup className='my-3'>
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id} >
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" />{' '}
                                                <Link to={`/book/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>{item.qty}</Col>
                                            <Col md={3}>{item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to='/cart'> <FaEdit size='1.3em'/> </Link>
                        </Card.Body>

                    </Card>
                </Col>

                <Col md={4}>
                    <Card className='my-3'>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
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
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${cart.totalPrice.toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                        >
                                            Place Order
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
