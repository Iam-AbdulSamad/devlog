const {
    getAllEntries,
    getEntryById,
    createEntry,
    deleteEntry
} = require('../services/entry.service')

const showEntries = async (req, res) => {
    try {
        const entries = await getAllEntries(req.session.userId)
        res.render('entries/index', {
            entries,
            user: { email: req.session.userEmail }
        })
    } catch (error) {
        res.render('entries/index', {
            entries: [],
            user: { email: req.session.userEmail },
            error: error.message
        })
    }
}

const showNewEntryForm = (req, res) => {
    res.render('entries/new', {
        error: null,
        user: { email: req.session.userEmail }
    })
}

const handleCreateEntry = async (req, res) => {
    const { title, body, tags } = req.body

    try {
        // tags comes in as "javascript, nodejs, express"
        // split into array and clean up whitespace
        const tagNames = tags
            ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
            : []

        await createEntry(req.session.userId, title, body, tagNames)
        res.redirect('/entries')
    } catch (error) {
        res.render('entries/new', {
            error: error.message,
            user: { email: req.session.userEmail }
        })
    }
}

const handleDeleteEntry = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        await deleteEntry(id, req.session.userId)
        res.redirect('/entries')
    } catch (error) {
        res.redirect('/entries')
    }
}

module.exports = {
    showEntries,
    showNewEntryForm,
    handleCreateEntry,
    handleDeleteEntry
}