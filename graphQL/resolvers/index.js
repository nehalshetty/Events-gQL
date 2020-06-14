const Event = require("../../schemas/event");
const User = require("../../schemas/user");
const Booking = require("../../schemas/booking");
const bcrypt = require("bcryptjs");

const normalizeEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    // Bind gets called by gQL
    creator: getUser.bind(this, event.creator),
  };
};

const normalizeUser = (user) => {
  return {
    ...user._doc,
    password: null,
    createdEvents: getEvents.call(this, user._doc.createdEvents),
  };
};

const getUser = async (userId) => {
  try {
    let userResult = await User.findById(userId);

    return normalizeUser(userResult);
  } catch (err) {
    console.log("Failed getting user -", err);
  }
};

const getEvents = async (eventIds) => {
  let eventResult = await Event.find({ _id: { $in: eventIds } });

  return eventResult.map(async (val) => {
    return normalizeEvent(val);
  });
};

const getEvent = async (eventID) => {
  let eventResult = await Event.findById(eventID);

  console.log("ER", eventResult);

  return normalizeEvent(eventResult);
};

module.exports = {
  // GET
  events: async () => {
    try {
      let allEvents = await Event.find();

      return allEvents.map(async (event) => {
        let creatorResult = await getUser(event.creator);

        return {
          ...event._doc,
          creator: creatorResult,
        };
      });
    } catch (err) {
      console.log("Getting events failed- ", err);
    }
  },
  users: async () => {
    let userResult = await User.find();

    return userResult.map(async (userVal) => {
      return normalizeUser(userVal);
    });
  },
  bookings: async () => {
    try {
      let bookingsResult = await Booking.find();
      return bookingsResult;
    } catch (err) {
      console.log(err);
    }
  },
  // POST
  createEvent: async ({ inputVal }) => {
    let currentUser = "5ee3aace6ec24623c888c8ed";
    try {
      let newEvent = new Event({
        name: inputVal.name,
        description: inputVal.description,
        date: new Date(),
        creator: currentUser,
      });
      let createdEventResult = await newEvent.save();

      console.log("%c Saving here " + createdEventResult, "color:pink");

      let eventCreator = await User.findById(currentUser);
      eventCreator.createdEvents.push(newEvent);

      await eventCreator.save();
      return normalizeEvent(createdEventResult);
    } catch (err) {
      console.log(err);
    }
  },
  createUser: async ({ inputVal }) => {
    let checkUser = await User.findOne({ email: inputVal.email });

    if (checkUser) {
      throw new Error("User already exists.");
    }

    let encryptedPassword = await bcrypt.hash(inputVal.password, 12);

    let newUser = new User({
      email: inputVal.email,
      password: encryptedPassword,
    });
    let result = await newUser.save();

    return normalizeUser(result);
  },
  bookEvent: async ({ inputVal }) => {
    let staticUserId = "5ee3aace6ec24623c888c8ed";

    try {
      let newBooking = new Booking({ event: inputVal.id, user: staticUserId });
      let bookingResult = await newBooking.save();
      let userResult = await getUser.call(this, staticUserId);

      return {
        ...bookingResult._doc,
        createdAt: new Date(bookingResult.createdAt).toISOString(),
        updatedAt: new Date(bookingResult.updatedAt).toISOString(),
        user: userResult,
        event: getEvent(inputVal.id),
        // event call pending write a get single event function
        // event: await getEvents.call(this, inputVal.id),
      };
    } catch (err) {
      console.log(err);
    }
  },
  cancelBooking: async ({ inputVal }) => {
    try {
      let bookingResult = await Booking.findById(inputVal.id).populate("event");
      let event = {
        ...bookingResult.event._doc,
        _id: bookingResult.event.id,
      };
      console.log(event);

      await Booking.deleteOne({ _id: inputVal.id });
      return event;
    } catch (err) {
      console.log(err);
    }
  },
};
