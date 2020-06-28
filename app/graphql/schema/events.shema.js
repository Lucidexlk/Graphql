const eventsType = `
type Event {
    _id : ID!
    title : String!
    description : String!
    price: Float!
    date: String! 
    creator: User!
}
input  EventInput {
    title : String!
    description : String!
    price: Float!
    date: String! 
}

`;
const eventsQueries = `
events: [Event!]!`;
const eventsMutation = `
createEvent(eventInput:EventInput ) : Event`;

exports.eventsType = eventsType;
exports.eventsQueries = eventsQueries;
exports.eventsMutation = eventsMutation;
