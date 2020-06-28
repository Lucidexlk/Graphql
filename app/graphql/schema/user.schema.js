const userType = `
type User {
    _id : ID!
    email : String!
    password: String 
    createdEvents: [Event!]
    
}

input UserInput {
    email:String!
    password: String!
}

`;
const userQueries = `
getUsers : [User!]!`;
const userMutation = `
createUser(userInput : UserInput) :User`;

exports.userType = userType;
exports.userQueries = userQueries;
exports.userMutation = userMutation;
