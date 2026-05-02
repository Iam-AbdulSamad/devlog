const express = require('express')
const router = express.Router()
const {
    showRegister,
    showLogin,
    handleRegister,
    handleLogin,
    handleLogout
} = require('../controllers/auth.controller')

router.get('/register', showRegister)
router.post('/register', handleRegister)

router.get('/login', showLogin)
router.post('/login', handleLogin)

router.post('/logout', handleLogout)

module.exports = router