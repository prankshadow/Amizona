const express = require('express');
const data = require('../data.js');
const Product = require('../models/product_model');
const User = require('../models/user_model');

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    //Written for the development purpose


    //For Product
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(data.products);
    //For user
    await User.deleteMany({});
    const createdUsers = await User.insertMany(data.users);


    res.send({ createdProducts, createdUsers });
});

module.exports = seedRouter;