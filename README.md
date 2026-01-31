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
+ http://localhost:3000/products/this_is_the_id_string
+ http://localhost:3000/user/register
+ http://localhost:3000/user/login
+ http://localhost:3000/user/logout
+ http://localhost:3000/user/refresh

### How Product Route work
+ GET request from user with '/products' 
<br> <br>
 **->** 
 it look at the query object 
 <br> <br>
  `{category: 'categery string', price: number, page: number}` 
  <br> <br> 
  **->** 
  and retrieve document from database match those query. 
  <br> <br> 
+ GET request from user with '/products/id_string' 
<br> <br> 
**->** 
it find out the document that have id of the requested id_string and response that to client. 
### How User Route work 
+ POST request on route '/register' 
<br> <br> 
**note:** 
I don't use body data santization and validation but it is the highest priority to do it first. 
<br> <br> 
the request body have to look like this 
`{name: "usernaem", password: "password", email: "userEmail}` 
<br> <br> 
**->** 
It check the database to find is the user already exist on the database if not then insert all the data to create a user on database and hash the password befor saving to database. 
<br> <br> 
`const exist = userDatabase.findOne({email}); 
if (exist) return res.status(400).json({message: "User already Exist}); 
const hashPassword = bcrypt.hash(password, 10); 
const newUser = new userDatabase({name, email, password: hashPassword}) await.userDatabase.save(); res.statue(201).json({message: "User created successfully"})` 
<br> <br> 
**->** 
and send appropriate response to client on successfull or unsuccessfull operation. 
<br> <br> 
+ POST request on route '/login' 
<br> <br> 
the request body have to look like this 
`{email: "username", password: "password"}` 
<br> <br> 
**->** 
Firstly it check is the qequest email match any email on the database. 
<br> <br> 
**->** 
If the user not exist client get the error. 
<br> <br>
**->** For the case email exist it go for next check where it compaire password with database password of that existing user. <br> <br>
**->** 
If the password not match client get the error. 
<br> <br> 
`const exist = userDatabase.findOne({email}); if (!exist) return res.status(400).json({message: "Invalid Credentials"}); const isMatch = await bcrypt.compare(password, exist.password); if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});` 
<br> <br> 
**->** 
user match with both password and email then go for next operation. <br> <br> 
**->** 
now by using user public data from data base maky payload for user. And generate accessToken from that payload. 
<br> <br> 
`const payload = {name: user.name, id: user._id}; const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: ACCESS_EXPIRATION});` 
<br> <br> 
**->** 
Now generate refresh token with unique id. 
<br> <br> 
`const uniqueId = crypto.randomBytes(16).toString("hex"); const refreshPayload = {name: user.name, id: uniqueId}; const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, {expiresIn: REFRESH_EXPIRATION});` 
<br> <br> 
**->** Then create a database where only refreshtoken save with 