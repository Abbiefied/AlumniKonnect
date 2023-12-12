const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { ensureAuth, ensureGuest } = require("../controllers/authController");
const controller = require("../controllers/authController");
const User = require("../models/User");

// Authentication page
router.get("/", ensureGuest, (req, res) => {
  res.render("auth", {
    layout: "auth",
    errors: [],
  });
});

// Auth with Google
router.get("/google", controller.googleAuth);

// Google auth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Sign up
router.post("/", (req, res, next) => {
  if ("signup" in req.body) {
  console.log(req.body);
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = [];

  //Check required fields
  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //Check passsword match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //Check pass length
  if (password.length < 8) {
    errors.push({ msg: "Password should be at least 8 characters" });
  }

  if (errors.length > 0) {
    //res.redirect("/auth?show=signup");
    res.render("auth", {
      layout: "auth",
      errors,
      firstName,
      lastName,
      email,
      password,
      password2,
    });
  } else {
    //validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "User exists" });
        res.render("auth", {
          layout: "auth",
          errors,
          firstName,
          lastName,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password,
        });
        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            //set hashed password
            newUser.password = hash;
            newUser.save()
            .then(user => {
              req.flash('success_msg', 'Sign up successful! Log in with your email and password.')
              res.redirect('/auth')
            })
            .catch(err => console.log(err));
          }));
      }
    });
  }
 } else {
    passport.authenticate('local',  {
      successRedirect: '/dashboard',
      failureRedirect: '/auth',
      failureFlash: true
    })(req, res, next);
  }
});

//Logout user
router.get("/logout", controller.logout);
module.exports = router;
