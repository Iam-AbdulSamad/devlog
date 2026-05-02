const bcrypt = require('bcryptjs')
const prisma = require('../config/databse.js')

const register = async (email, password) => {

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        throw new Error('Email already registered')
    }

    // Hash the password - never store plain text
    // 12 = how many times it scrambles - higher is safer but slower
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in database
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    })

    // Return user WITHOUT the password field
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
}

const login = async (email, password) => {

    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        // Intentionally vague - don't tell attacker which field is wrong
        throw new Error('Invalid email or password')
    }

    // Compare plain password against stored hash
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        throw new Error('Invalid email or password')
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
}

module.exports = { register, login }