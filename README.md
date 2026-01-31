# ShopEase-Backend
## What on this Project
This is the server for the react frontend named ShopEase. With in this server user see request for product list and a explicit product and request for buy product and to buy user have to make a profile on it and user all history saved in mongodb database. On that way authentication and authorization happen on this way i will explain this in details.
## Dependency used on this priject.
+ Express.js
+ Cookie-parser
+ cors
+ bcrypt.js
+ dotenv
+ helmet
+ jsonwebtoken
+ mongoose
+ express-validator
+ express-rate-limit
+ express-mongo-sanitize

## File structure
```text
root/
├── config/
│   └── db.js
├── controllers/
│   └── productController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── product.js
│   ├── refreshToken.js
│   └── user.js
├── routes/
│   ├── auth.js
│   ├── product.js
│   └── profile.js
├── utils/
│   ├── ratelimiter.js
│   └── token.js
└── server.js
```

## Routes
+ http://localhost:3000/products
+ http://localhost:3000/products/(fjoqwerfwefiqowfjuiu) inside braces is id string
+ http://localhost:3000/user/register
+ http://localhost:3000/user/login
+ http://localhost:3000/user/refresh

### How Product Route work
+ GET request from user with '/products'  -> Hello
+ GET request from user with '/products/id_string' retrieve that id strign data from database
### How User Route work

