const Booking = require("../../schemas/booking");
const { getUser, normalizeEvent, getEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      let bookingsResult = await Booking.find();
      //   let userResult = await getUser(bookingsResult.user);
      return bookingsResult.map((result) => {
        return {
          ...result._doc,
          user: getUser.call(this, result.user),
          event: getEvent(result.event),
        };
      });
    } catch (err) {
      console.log(err);
    }
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
