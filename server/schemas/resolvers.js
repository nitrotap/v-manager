const { AuthenticationError } = require('apollo-server-express');
const { User, Volunteer } = require('../models');
const { signToken } = require('../utils/auth');

// resolvers for Query and Mutation
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('volunteers');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('volunteers');
        },
        user: async (parent, { email }) => {
            return User.findOne({ email })
                .select('-__v -password')
                .populate('volunteers');
        },
        volunteers: async (parent, { email }) => {
            const params = email ? { email } : {};
            return Volunteer.find(params).sort({ createdAt: -1 });
        },
        volunteer: async (parent, { _id }) => {
            return Volunteer.findOne({ _id });
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        // add mutation for updating a user
        updateUser: async (parent, { email, password }) => {
            const user = await User.findOneAndUpdate(
                { email },
                { $set: { password } },
                { new: true }
            );
        },
        // add mutation for removing a user
        removeUser: async (parent, { email }) => {
            return User.findOneAndDelete({ email });
        },

        // add mutation for adding a volunteer
        addVolunteer: async (parent, args, context) => {
            if (context.user) {
                const volunteer = await Volunteer.create({ ...args, user: context.user._id });
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { volunteers: volunteer._id } },
                    { new: true }
                );
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // add mutation for updating a volunteer
        updateVolunteer: async (parent, { _id, firstName, lastName, preferredName, email, phoneNumber, CRM_ID, dateStarted, volunteerType, lastCOI, lastBackgroundCheck, lastMissionConversation, staffPartner, user }) => {
            return Volunteer.findOneAndUpdate(
                { _id },
                { $set: { firstName, lastName, preferredName, email, phoneNumber, CRM_ID, dateStarted, volunteerType, lastCOI, lastBackgroundCheck, lastMissionConversation, staffPartner, user } },
                { new: true }
            );
        },
        // add mutation for removing a volunteer
        removeVolunteer: async (parent, { _id }) => {
            return Volunteer.findOneAndDelete({ _id });
        }

    }
}

module.exports = resolvers;


