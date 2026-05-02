const { register, login } = require('../services/auth.service')

const showRegister = (req, res) => {
    res.render('auth/register', { error: null })
}

const showLogin = (req, res) => {
    res.render('auth/login', { error: null })
}

const handleRegister = async (req, res) => {
    const { email, password } = req.body

    try {
        await register(email, password)
        res.redirect('/auth/login')
    } catch (error) {
        res.render('auth/register', { error: error.message })
    }
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await login(email, password)

        // Save user to session - this is what keeps them logged in
        req.session.userId = user.id
        req.session.userEmail = user.email

        res.redirect('/entries')
    } catch (error) {
        res.render('auth/login', { error: error.message })
    }
}

const handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
}

module.exports = {
    showRegister,
    showLogin,
    handleRegister,
    handleLogin,
    handleLogout
}