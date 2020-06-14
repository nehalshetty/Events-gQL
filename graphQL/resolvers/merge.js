const User = require("../../schemas/user");
const Event = require("../../schemas/event");

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

exports.getUser = getUser;
exports.getEvent = getEvent;
exports.getEvents = getEvents;
exports.normalizeEvent = normalizeEvent;
exports.normalizeUser = normalizeUser;
