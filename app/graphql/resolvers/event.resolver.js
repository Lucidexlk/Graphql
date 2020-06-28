const Event = require('../../../app/model/event.model')
const User = require('../../../app/model/user.model')
const { tarnsformEvent } = require('./common.resolver')
const { dateToString } = require('../../helpers/date.helper')

module.exports = {
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

    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthanticated !')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: req.userId
        })

        let createEventByUser;

        try {
            const result = await event.save()
            createEventByUser = tarnsformEvent(result)
            const creator = await User.findById(req.userId)
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

}

