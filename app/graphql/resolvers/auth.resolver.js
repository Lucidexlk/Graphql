const User = require('../../../app/model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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


    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist')
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect')
        }

        const token = jwt.sign({ userId: user.id, email: user.email, role: { cus: true, adm: false, mrc: false } }, 'thisistest', { expiresIn: '1h' });
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }

    }


}

