const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const usersRouter = require('./routes/userRouter')
require('dotenv').config()

const app = express()
app.use(express.json());
app.use(cors())
app.use(usersRouter)

//set up middlewares
app.use('/users', require('./routes/userRouter'))

//set up mongoose
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err) => {
        if (err) throw err;
        console.log('connection to mongodb successful')
    })

    //set up server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})
