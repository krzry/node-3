const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const secret = require("../../secret");

function create(req, res) {
  const db = req.app.get("db");

  const { email, password } = req.body;

  argon2.hash(password).then(hash => {
    db.users
      .insert(
        {
          email,
          password: hash,
          user_profiles: [
            // this is what is specifying the object
            // to insert into the related 'user_profiles' table
            {
              userId: undefined,
              about: null,
              thumbnail: null
            }
          ]
        },
        {
          deepInsert: true, // this option here tells massive to create the related object
          fields: ["id", "email"]
        }
      )
      .then(user => {
        const token = jwt.sign({ userId: user.id }, secret);
        res.status(201).json({ ...user, token });
      }) // returns a promise so we need to use .then
      .catch(err => {
        console.error(err);
      });
  });
}

function list(req, res) {
  const db = req.app.get("db");

  db.users
    .find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function getById(req, res) {
  const db = req.app.get("db");

  db.users
    .findOne(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function getProfile(req, res) {
  const db = req.app.get("db");

  db.user_profiles
    .findOne({
      userId: req.params.id
    })
    .then(profile => res.status(200).json(profile))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}

function login(req, res) {
  const db = req.app.get("db");
  const { email, password } = req.body;

  db.users
    .findOne(
      {
        email
      },
      {
        fields: ["id", "email", "password"]
      }
    )
    .then(user => {
      if (!user) {
        throw new Error("Invalid email");
      }

      // Here is where we check the hashed password from the database
      // with the password that was submitted by the user.
      return argon2.verify(user.password, password).then(valid => {
        if (!valid) {
          throw new Error("Incorrect password");
        }

        const token = jwt.sign({ userId: user.id }, secret);
        delete user.password; // remove password hash from returned user object
        res.status(200).json({ ...user, token });
      });
    })
    .catch(err => {
      if (["Invalid email", "Incorrect password"].includes(err.message)) {
        res.status(400).json({ error: err.message });
      } else {
        console.error(err);
        res.status(500).end();
      }
    });
}

module.exports = {
  create,
  list,
  getById,
  getProfile,
  login
};
