const bcrypt = require('bcryptjs');

const data = {

    users: [
        {
            name: 'Prank Shadow',
            email: 'admin@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true
        },
        {
            name: 'Person Sharma',
            email: 'user@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false
        }
    ],
    products: [
        {
            // _id:'1',
            name: 'Nike Slim Shirt',
            slug: 'nike-slim-shirt',
            category: 'Shirts',
            image: '/images/p1.jpg', //679px x 829px
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 4,
            numReviews: 10,
            description: 'high quality shirt'
        },
        {
            // _id:'2',
            name: 'Addidas Slim Shirt',
            slug: 'addidas-slim-shirt',
            category: 'Shirts',
            image: '/images/p2.jpg',
            price: 50,
            countInStock: 0,
            brand: 'Nike',
            rating: 3,
            numReviews: 8,
            description: 'high quality shirt'
        },
        {
            // _id:'3',
            name: 'Nike Slim pant',
            slug: 'nike-slim-pant',
            category: 'Pants',
            image: '/images/p3.jpg',
            price: 70,
            countInStock: 10,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 7,
            description: 'high quality shirt'
        },
        {
            // _id:'4',
            name: 'Addidas fit pant',
            slug: 'addidas-fit-pant',
            category: 'Pants',
            image: '/images/p4.jpg',
            price: 80,
            countInStock: 10,
            brand: 'Nike',
            rating: 5,
            numReviews: 14,
            description: 'high quality shirt'
        },
    ]

}

module.exports = data