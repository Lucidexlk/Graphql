const User = require('../../../app/model/user.model')
const bcrypt = require('bcryptjs')


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




}

