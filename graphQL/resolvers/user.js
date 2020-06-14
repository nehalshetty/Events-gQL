const User = require("../../schemas/user");
const bcrypt = require("bcryptjs");
const { normalizeUser } = require("./merge");

module.exports = {
  users: async () => {
    let userResult = await User.find();

    return userResult.map(async (userVal) => {
      return normalizeUser(userVal);
    });
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
};
