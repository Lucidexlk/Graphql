const authResolver = require('./auth.resolver')
const eventResolver = require('./event.resolver')
const bookingResolver = require('./booking.resolver')


const rootResolver = {
    ...authResolver,
    ...eventResolver,
    ...bookingResolver
}

module.exports = rootResolver