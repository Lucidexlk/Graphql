const Event = require('../../../app/model/event.model')
const User = require('../../../app/model/user.model')
const Booking = require('../../../app/model/booking.model')

const bcrypt = require('bcryptjs')




const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
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





module.exports = {
    events: async () => {
        try {
            const events = await Event.find().populate('creator');
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            throw err
        }
    },


    booking: async () => {
        try {

            const bookings = await Booking.find()
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString()

                }
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
            date: new Date(args.eventInput.date),
            creator: '5ef5c9d54a576327385d8c38'
        })

        let createEventByUser;

        try {
            const result = await event.save()
            createEventByUser = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }
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
        return {
            ...result._doc,
            _id: result.id,
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: new Date(result.updatedAt).toISOString()
        }
    }
}

