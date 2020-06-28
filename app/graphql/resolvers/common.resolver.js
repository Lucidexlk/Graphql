const User = require('../../../app/model/user.model')
const Event = require('../../../app/model/event.model')

const { dateToString } = require('../../helpers/date.helper')


const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return tarnsformEvent(event)
        });
    } catch (err) {
        throw err;
    }
};



const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvent)
        }

    } catch (err) {
        throw err
    }
}


const singleEvent = async eventId => {
    try {

        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }
    } catch (error) {
        throw error
    }
}

const tarnsformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,

        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
    };
}



const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}


exports.transformBooking = transformBooking
exports.tarnsformEvent = tarnsformEvent