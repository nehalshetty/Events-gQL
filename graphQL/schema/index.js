const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Event { 
        _id :ID!
        name: String!
        description: String!
        date: String! 
        creator:User!
    }

    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type User{
      _id :ID!
      email: String!
      password: String
      createdEvents:[Event!]
    }

    input UserInput{
        email:String!,
        password:String!
    }

    input EventInput {
        name: String!
        description: String!
        date: String!     
    }

    input EventId{
        id: ID!
    }
    
    input BookingId{
        id: ID!
    }

    type RootQuery{
        events: [Event!]! 
        users: [User!]!
        bookings: [Booking!]!
    }

    type RootMutation{
        createEvent(inputVal: EventInput): Event
        createUser(inputVal: UserInput): User
        bookEvent(inputVal: EventId): Booking
        cancelBooking(inputVal: BookingId): Event
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
    `);
