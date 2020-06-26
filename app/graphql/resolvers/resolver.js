const Event = require('../../../app/model/event.model')
const User = require('../../../app/model/user.model')

const bcrypt = require('bcryptjs')




const events = eventIds => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)
                }
            })
        }).catch(err => {
            throw err

        })
}


const user = userId => {
    return User.findById(userId).then(user => {
        return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvent) }
    }).catch(err => {
        throw err
    })
}





module.exports = {
    events: () => {
        return Event.find().populate('creator').then(events => {
            console.log(events);
            // return events
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),

                    creator: user.bind(this, event._doc.creator)

                }
            })


        }).catch(err => {
            console.log(err);
            throw err

        })
        return events;
    },
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5ef59b444b78b20aa4de9ca0'
        })

        let createEventByUser;

        return event.save().then(result => {
            createEventByUser = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }
            return User.findById('5ef59b444b78b20aa4de9ca0')

        }).then(user => {
            if (!user) {
                throw new Error('User exists alreay')
            }
            user.createdEvent.push(event)
            return user.save()
        }).then(result => {
            console.log(result);
            return createEventByUser;
        })
            .catch(err => {
                console.log(err);
                throw err;

            });
    },

    createUser: (args) => {
        return User.findOne({ email: args.userInput.email }).then(user => {
            if (user) {
                throw new Error('User exists alreay')
            }
            return bcrypt.hash(args.userInput.password, 12)
        }).then(
            hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            }).then(result => {
                return { ...result._doc, password: null, _id: result.id }
            })

            .catch(err => {
                throw err
            })

    }
}