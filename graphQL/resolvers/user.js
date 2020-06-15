const User = require("../../schemas/user");
const bcrypt = require("bcryptjs");
const { normalizeUser } = require("./merge");
const jwt = require("jsonwebtoken");
const user = require("../../schemas/user");

module.exports = {
  users: async (val, req) => {
    console.log("Users is auth", req.isAuth);

    if (req.isAuth) {
      let userResult = await User.find();

      return userResult.map(async (userVal) => {
        return normalizeUser(userVal);
      });
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

  login: async ({ email, password }) => {
    try {
      let userResult = await User.findOne({ email: email }),
        isPasswordValid;

      if (!userResult) {
        throw Error("Invalid Email");
      }
      isPasswordValid = await bcrypt.compare(password, userResult.password);
      if (!isPasswordValid) {
        throw Error("Password Incorrect");
      }
      let newToken = jwt.sign(
        {
          id: userResult.id,
          email: userResult.email,
        },
        "mysecretekey",
        {
          expiresIn: "1h",
        }
      );
      return {
        userId: userResult.id,
        token: newToken,
        expires: 1,
      };
    } catch (err) {
      console.log("LOGIN ERROR-", err);
    }
  },
};
