import express from 'express'
import path from 'path';
import data from './data.js'
import mongoose from 'mongoose'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import dotenv from 'dotenv'
import orderRouter from './routes/orderRoutes.js'
dotenv.config()


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {console.log('Success connect to DB')})
  .catch(err => {
    console.log(err.message)
  })

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})
app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));


app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message})
})

//test
app.get('/api/products', (req, res) => {
  res.send(data.products)
})


const PORT = 2000;


app.listen(PORT, () =>{
  console.log(`Server running at http://localhost:${PORT}`)
})