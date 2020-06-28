 const bookingType = `
    type Booking {
    _id : ID!
    event : Event!
    user : User!
    createdAt : String!
    updatedAt : String!
}`;
 const bookingQueries = `
 bookings : [Booking!]!`;
 const bookingMutation = `
 bookEvent(eventId : ID!) : Booking!
cancleBooking(bookingId :ID!) : Event!`;

exports.bookingType = bookingType;
exports.bookingQueries = bookingQueries;
exports.bookingMutation = bookingMutation;
