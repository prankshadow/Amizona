const express = require('express');
const Order = require('../models/order_model');
const fetchuser = require('../middleware/fetchuser');
const expressAsyncHandler = require('express-async-handler');


const orderRouter = express.Router();


orderRouter.post('/', fetchuser, expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })), //product:x._id is used to store id to product.
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user.id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New order Created', order });

}));

orderRouter.get('/mine', fetchuser, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id });
    res.send(orders);
}))

orderRouter.get('/:id', fetchuser, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: 'Order Not Found' })
    }
}));

orderRouter.put(
    '/:id/pay',
    fetchuser,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address
            };
            const updatedOrder = await order.save();
            res.send({
                message: 'Order Paid',
                order: updatedOrder
            });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
)


module.exports = orderRouter;