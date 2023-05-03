const express = require('express')
const mongoose = require('mongoose');
const ProductModel = mongoose.model('Product');
const productRoute = express.Router();

//To get all products
productRoute.get('/', async (req, res) => {
    const products = await ProductModel.find();
    res.send(products);
});

//Find product using its slug
productRoute.get('/slug/:slug', async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });
    if (product) {
        res.send(product)
    } else {
        res.status(400).json({ message: "Product not found" })
    }
});

//Find product using its _id
productRoute.get('/:id', async (req, res) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
        res.send(product)
    } else {
        res.status(400).json({ message: "Product not found :id" })
    }
})

module.exports = productRoute