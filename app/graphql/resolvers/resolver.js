const Event = require('../../../app/model/event.model')
const User = require('../../../app/model/user.model')
const Booking = require('../../../app/model/booking.model')
const { dateToString } = require('../../helpers/date.helper')
const bcrypt = require('bcryptjs')

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





module.exports = {

    getUsers: async () => {
        try {
            const allUsers = await User.find();
            return allUsers.map(users => {
                return {
                    ...users._doc
                }
            })
        } catch (err) {
            throw err;
        }
    },

    events: async () => {
        try {
            const events = await Event.find().populate('creator');
            return events.map(event => {
                return tarnsformEvent(event)
            });
        } catch (err) {
            throw err
        }
    },


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




    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: '5ef5c9d54a576327385d8c38'
        })

        let createEventByUser;

        try {
            const result = await event.save()
            createEventByUser = tarnsformEvent(result)
            const creator = await User.findById('5ef5c9d54a576327385d8c38')
            if (!creator) {
                throw new Error('User exists alreay')
            }
            creator.createdEvent.push(event)
            await creator.save()
            return createEventByUser
        }
        catch (err) {
            throw err
        }
    },





    createUser: async args => {
        try {
            const exsistingUser = await User.findOne({ email: args.userInput.email })
            if (exsistingUser) {
                throw new Error('User exists alreay')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save()
            return { ...result._doc, password: null, _id: result.id }
        }
        catch (err) {
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

