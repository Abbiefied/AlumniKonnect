const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { ensureAuth, ensureGuest } = require("../controllers/authController");
const controller = require("../controllers/authController");
const User = require("../models/User");

// Authentication page
router.get("/", (req, res) => {
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
    req.flash('success_msg', 'Login successful. Welcome!');
    res.redirect("/");
  }
);

// Sign up or Login
router.post("/", (req, res, next) => {
  if ("signup" in req.body) {
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = [];

  //Check required fields
  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push({ msg: "Invalid email format" });
  }

  //Check passsword match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check password complexity
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    errors.push({
      msg:
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
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
          email: email.toLowerCase(),
          password,
        });
        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err)  {
              console.error(err);
              // Handle error response to the client
              return res.render("error/500");
            }

            //set hashed password
            newUser.password = hash;
            newUser.save()
            .then(user => {
              req.flash('success_msg', 'Sign up successful! Log in with your email and password.')
              res.redirect('/auth')
            })
            .catch((err) => {
                  console.error(err);
                  // Handle error response to the client
                  res.render("error/500");
                });
          }));
      }
    });
  }
 } else {
  passport.authenticate('local', {
    failureRedirect: '/auth',
    failureFlash: true
})(req, res, () => {
    // Check if the logged-in user is an admin
    if (req.user && req.user.role === 'admin') {
        // Redirect to the admin dashboard if the user is an admin
        res.redirect('/');
    } else {
        // Redirect to the regular dashboard if the user is not an admin
        res.redirect('/');
    }
  });
}
});

//Logout user
router.get("/logout", ensureAuth, controller.logout);
module.exports = router;
