const { gql } = require('apollo-server-express');

// create typeDefs for User model
const typeDefs = gql`
    type User {
        _id: ID
        email: String
        password: String
        volunteers: [Volunteer]
    }

    type Volunteer {
        _id: ID
        firstName: String
        lastName: String
        preferredName: String
        email: String
        phoneNumber: String
        CRM_ID: String
        dateStarted: String
        volunteerType: [String]
        lastCOI: String
        lastBackgroundCheck: String
        lastMissionConversation: String
        staffPartner: String
        user: User
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        users: [User]
        user(email: String!): User
        volunteers(email: String!): [Volunteer]
        volunteer(_id: ID!): Volunteer
    }

    type Mutation {
        addUser(email: String!, password: String!): Auth
        # updateUser(email: String!, password: String!): User
        # removeUser(email: String!): User

        login(email: String!, password: String!): Auth

        addVolunteer(firstName: String!, lastName: String!, preferredName: String, email: String, phoneNumber: String, CRM_ID: String, dateStarted: String, volunteerType: [String], lastCOI: String, lastBackgroundCheck: String, lastMissionConversation: String, staffPartner: String, user: ID!): Volunteer

        updateVolunteer(_id: ID!, firstName: String!, lastName: String!, preferredName: String, email: String, phoneNumber: String, CRM_ID: String, dateStarted: String, volunteerType: [String], lastCOI: String, lastBackgroundCheck: String, lastMissionConversation: String, staffPartner: String, user: ID!): Volunteer
        removeVolunteer(_id: ID!): Volunteer
    }
`;

module.exports = typeDefs;