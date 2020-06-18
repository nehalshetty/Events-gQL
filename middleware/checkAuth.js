const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  let checkAuth = req.get("Authorization");
  req.isAuth = false;

  if (!checkAuth) {
    console.log("User not authenticated");
  } else {
    try {
      let authData = await jwt.verify(checkAuth.split(" ")[1], "mysecretekey");

      console.log(authData);
      req.isAuth = true;
      req.userId = authData.id;
    } catch (err) {
      console.log(err);
    }
  }

  next();
};
