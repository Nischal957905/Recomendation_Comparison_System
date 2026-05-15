import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import { fileURLToPath } from 'url'
import { dirname,join } from 'path'
import root from './routes/main.js'
import cookieParser from "cookie-parser"
import error from "./middleware/error.js"
import routeInstitute from './routes/institute.js'
import routeComparison from "./routes/comparison.js"
import routeCollege from "./routes/college.js"
import routeSchool from "./routes/school.js"
import routeAuth from "./routes/auth.js"
import routeAdmin from "./routes/admin.js"
import routeDiscussion from "./routes/discussion.js"
import dbConnection from './config/dbConnection.js'
import { logger, eventLogs } from './middleware/logger.js'
import core from './config/continuousOperatingReference.js'

//Configuration on dot env file for setting up a environment for database.
dotenv.config();

const app = express()
app.use(logger) //function for logging web app log into the logs directories
app.use(cors(core)) //implementation of cors policy to block or allow access
app.disable('x-powered-by')
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'no-referrer')
    res.setHeader('Permissions-Policy', 'geolocation=(self)')
    next()
})
app.use(express.static('public', {
    dotfiles: 'ignore',
    fallthrough: true,
    maxAge: '1h',
    setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff')
    }
})) //declaration of entrypoint directoyr file
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
app.use('/',root); //declaration of routes path
app.use('/auth', routeAuth)
app.use('/institution', routeInstitute);
app.use('/admin', routeAdmin)
app.use('/discussion', routeDiscussion);
app.use('/comparison', routeComparison);
app.use('/college',routeCollege);
app.use('/school', routeSchool)
dbConnection().catch((connectionError) => {
    console.error('MongoDB connection failed:', connectionError.message)
    process.exit(1)
})

const PORT = process.env.PORT || process.env.port || 8800

//Usage of filename and dirname to convert plain js into es6 module.
//Necessary to define path later on

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req,res)=>{
    res.json("Response Given")
})

//Function for handling requests fo error requests
app.use((req,res) => {
    res.status(404)
    if(req.accepts('html')){
        const viewPath = join(__dirname, '.', 'view', 'Error.html');
        res.sendFile(viewPath)
    }
    else if(req.accepts('json')){
        res.json({message: '404 Not found'})
    }
    else{
        res.type('txt').send('404 not found')
    }
})

app.use(error)

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDb.")
    app.listen(PORT, ()=>{
        console.log("Connected to Server")
    })
})

mongoose.connection.on('error', errors => {
    console.log(errors)
    eventLogs(`${errors.no}: ${errors.code}\t${errors.syscall}\t${errors.hostname}`, 'mongoErrorLogs.log')
})

const shutdown = async () => {
    try {
        await mongoose.connection.close()
    } finally {
        process.exit(0)
    }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)


