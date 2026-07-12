const express = require('express')
const cors = require('cors')
const path = require('path')
const {conneDB} = require('./config/db')
require('dotenv').config()
 const taskRouter = require('./routes/taskRoute')
const userRouter = require('./routes/userRoute')
const projectRouter = require('./routes/projectRoute')

const taskAssignmentRouter = require('./routes/taskAssignmentRoute')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
// Allow requests from your specific frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.get('/', (req, res) => res.send('Hello World!'))

 app.use('/task', taskRouter)
 app.use('/project',projectRouter)
app.use('/user', userRouter)
app.use('/assign', taskAssignmentRouter)

app.use('/uploads',express.static('uploads'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// http://localhost:5003/uploads/