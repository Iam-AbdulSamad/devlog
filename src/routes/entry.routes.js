const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth.middleware')
const {
    showEntries,
    showNewEntryForm,
    handleCreateEntry,
    handleDeleteEntry
} = require('../controllers/entry.controller')

// requireAuth is applied to every route in this file
router.use(requireAuth)

router.get('/', showEntries)
router.get('/new', showNewEntryForm)
router.post('/', handleCreateEntry)
router.delete('/:id', handleDeleteEntry)

module.exports = router