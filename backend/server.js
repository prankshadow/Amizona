const express = require('express')
const app = express()
const port = 4000
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const seedRouter = require('./routes/seedRoute')
var cors = require('cors');
const orderRouter = require('./routes/order_route');

dotenv.config(); //for .env to work

//to connect mongoose
mongoose.connect(process.env.MONGODB_URL);

app.use(cors());  //used as middle ware to connect between the server
//to handle incoming JSON payloads
app.use(express.json());

//connection to mongoose if connected or error
mongoose.connection.on('connected', () => {
    console.log("Successfully connected to the server (mongodb)");
})
mongoose.connection.on('error', (error) => {
    console.log("Some error occured while connecting to the mongodb")
})

//Dummy products
app.use('/api/seed', seedRouter)


//For users
require('./models/user_model')
app.use('/api/users', require('./routes/user_route'))

//For products
require('./models/product_model')
app.use('/api/products', require('./routes/product_route'))

//For Orders
app.use('/api/orders', orderRouter);

//PayPal
app.get('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
});



app.listen(port, () => console.log(`Server Started on port ${port}!`))