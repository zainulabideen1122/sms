const express = require('express')
const app = express();
const connection = require('./config/db')
const authRouter = require('./Routes/auth')
const userRouter = require('./Routes/user')
const settingsRouter = require('./Routes/roles')
const courseRouter = require('./Routes/course')
const cors = require('cors')
const authMiddleware = require('./middleware/auth')
const {getAllPermissions, getUserPermissions} = require('./utils/Permissions')
require('dotenv').config()
app.use(express.json());
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };
  
app.use(cors(corsOptions));

app.use('/auth', authRouter)
app.use('/user',authMiddleware, userRouter)
app.use('/settings', authMiddleware, settingsRouter)
app.use('/courses', authMiddleware, courseRouter)

app.post('/protected', authMiddleware,(req, res)=>{

    res.send("Wellcome to the protected route!")
    
})
app.get('/', (req, res)=>{
    getAllPermissions(req, res);
})
app.get('/userPermission/:role', (req, res)=>{
    getUserPermissions(req, res);
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server is up at ${process.env.PORT}!`)
    connection.connect(function(err){
        if(err) throw err;
        console.log("Database connected!")
    })
})