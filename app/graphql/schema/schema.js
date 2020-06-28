const { buildSchema } = require('graphql')

const { bookingType, bookingQueries, bookingMutation } = require('./booking.schema')
const { eventsType, eventsQueries, eventsMutation } = require('./events.shema')
const { userType, userQueries, userMutation } = require('./user.schema')


module.exports = buildSchema(`
    ${bookingType}
    ${eventsType}
    ${userType}
    type AuthDate{
        userId: ID!
        token:String!
        tokenExpiration: Int!
    }
type RootQuery{
    ${bookingQueries}
    ${eventsQueries}
    ${userQueries}
    login(email: String!, password: String!) : AuthDate!
    }
type RootMutation {
    ${bookingMutation}
    ${eventsMutation}
    ${userMutation}
    }
schema {
    query:RootQuery
    mutation: RootMutation
} `);