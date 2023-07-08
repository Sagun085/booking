const User = require("./user.model.js");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  bcrypt.hash(pass, 10, function (err, hash) {
    if (hash) {
      userData.hash = hash;
    }
    if (err) {
      res.status(400).send({
        message: "Some error occurred while creating the User.",
      });
    }
  });

  // Create a Note
  const newUser = new User(userData);

  newUser
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.login = (req, res) => {
  Login.find({ email: req.body.email })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: "Wrong UserId or Password!",
        });
      }
      const userData = {...data[0]}
      bcrypt.compare(req.body.password, userData.hash, function (err, resp) {
        if (resp) {
          let key = process.env.JWT_KEY;
          let token = jwt.sign({ data: JSON.stringify(userData) }, key, { expiresIn: '7d' });
          delete userData.hash
          
          req.session.authenticated = true;
          req.session.data = token;
          req.session.save();

          res.send({ data: userData });
          
        } else {
          return res.status(404).send({
            message: "Wrong UserId or Password!",
          });
        }
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with email " + req.body.email,
        });
      }
      return res.status(401).send({
        message: "Error retrieving data with email " + req.body.email,
      });
    });
};

exports.logout = (req, res) => {
  req.session.destroy(function (err) {
    res.send({ success: "Logged Out!" });
  });
};

// Retrieve and return all data from the database.
exports.varifyToken = (req, res) => {
  const key = process.env.JWT_KEY;
  jwt.verify(req.session.data, key, function (err, decoded) {
    if (err) {
      res.status(401).send({
        message: "Sesson expired.",
        error: err,
      });
    } else {
      res.send(JSON.parse(decoded.data));
    }
  });
};
