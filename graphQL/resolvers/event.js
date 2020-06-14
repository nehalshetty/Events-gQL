const User = require("../../schemas/user");
const Event = require("../../schemas/event");

const { getUser, normalizeEvent } = require("./merge");

module.exports = {
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
};
