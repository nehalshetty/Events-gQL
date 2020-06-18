const userResolver = require("./user");
const eventResolver = require("./event");
const bookingResolver = require("./booking");

module.exports = {
  ...eventResolver,
  ...userResolver,
  ...bookingResolver,
};
