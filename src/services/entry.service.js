const prisma = require('../config/databse.js')

const getAllEntries = async (userId) => {
    const entries = await prisma.entry.findMany({
        where: { userId },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    return entries
}

const getEntryById = async (id, userId) => {
    const entry = await prisma.entry.findFirst({
        where: {
            id,
            userId  // CRITICAL - ensures user can only see their own entries
        },
        include: {
            tags: {
                include: { tag: true }
            }
        }
    })
    return entry
}

const createEntry = async (userId, title, body, tagNames = []) => {
    const entry = await prisma.entry.create({
        data: {
            title,
            body,
            userId,
            tags: {
                create: tagNames.map(name => ({
                    tag: {
                        connectOrCreate: {
                            where: { name },
                            create: { name }
                        }
                    }
                }))
            }
        },
        include: {
            tags: {
                include: { tag: true }
            }
        }
    })
    return entry
}

const deleteEntry = async (id, userId) => {
    // First verify this entry belongs to this user
    const entry = await prisma.entry.findFirst({
        where: { id, userId }
    })

    if (!entry) {
        throw new Error('Entry not found or unauthorized')
    }

    // Delete junction records first, then the entry
    await prisma.entryTag.deleteMany({
        where: { entryId: id }
    })

    await prisma.entry.delete({
        where: { id }
    })
}

module.exports = {
    getAllEntries,
    getEntryById,
    createEntry,
    deleteEntry
}