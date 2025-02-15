const express = require('express')
const app = express()
const port = 8888
var cors = require('cors')
const connectToDatabse = require('../backend/DB/db')
connectToDatabse()

app.use(express.json())
app.use(cors())
app.use('/auth', require('./Routes/auth'))
app.use('/product', require('./Routes/product'))
app.use('/order', require('./Routes/order'))
app.use('/user', require('./Routes/user'))
app.use('/review', require('./Routes/reviewRoutes'))
app.use('/wishlist', require('./Routes/wishlistRoutes'))
app.use('/payment', require('./Routes/paymentRoutes'))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})