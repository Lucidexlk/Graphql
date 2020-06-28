const Event = require('../../../app/model/event.model')
const Booking = require('../../../app/model/booking.model')
const { transformBooking, tarnsformEvent } = require('./common.resolver')

module.exports = {
    bookings: async () => {
        try {

            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {
            throw err
        }
    },
    bookEvent: async args => {
        const fethedEvent = await Event.findOne({ _id: args.eventId })
        const booking = new Booking({
            user: '5ef5c9d54a576327385d8c38',
            event: fethedEvent
        });
        const result = await booking.save()
        return transformBooking(result)
    },
    cancleBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = tarnsformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })

            return event
        } catch (error) {
            throw error
        }
    }
}

