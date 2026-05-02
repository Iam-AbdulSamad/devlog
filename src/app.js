const express = require('express')
const session = require('express-session')
const helmet = require('helmet')
const path = require('path')
const authRoutes = require('./routes/auth.routes')
const entryRoutes = require('./routes/entry.routes')
const methodOverride = require('method-override')

const app = express()

// Security headers - always first
app.use(helmet())

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))


// Static files (CSS, JS)
app.use(express.static(path.join(__dirname, '../public')))

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}))

// Template engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Root redirect
app.get('/', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/entries')
    }
    res.redirect('/auth/login')
})

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() })
})

app.use('/auth', authRoutes)
app.use('/entries', entryRoutes)

module.exports = app