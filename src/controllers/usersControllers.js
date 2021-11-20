const path = require("path");
const fs = require("fs");
const { json } = require("express");
//const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require("constants");
const db = require("../database/models");
const sequelize = db.sequelize;
const Op = require("sequelize");
const { error } = require("console");

// require the json file and store it in a variable.
//let usersJson = fs.readFileSync(path.join(__dirname, "../../data/users.json"), { encoding: "utf-8" });
// models of database
const Image = db.UserImg;
const User = db.User;

const usersController = {
  login: (req, res) => {
    res.render("./users/login");
  },
  confirmSessionOfUser: (req, res) => {
    let loginErrors = validationResult(req);
    if (loginErrors.isEmpty()) {
      db.User.findOne({
        include: [{association: "Image"}],
        where: {
          email: req.body.email
        }
      }).then(userLogin => {
        let isOkThePassword = bcryptjs.compareSync(req.body.password, userLogin.password);
        if (isOkThePassword) {
          delete userLogin.password;
          req.session.userToLogged = userLogin;
          console.log(userLogin,"hea");
          console.log(req.session.userToLogged);
          return res.redirect("/users/profile/" + userLogin.id );
        } else {
          return res.render("./users/login", { errors: loginErrors.mapped(), values_olds: req.body });
        }
      })
    } else {
      return res.render("./users/login", { errors: loginErrors.mapped(), values_olds: req.body });
    }
    //return res.redirect("/")
  },
  profile: (req, res) => {
    return res.render("./users/profile", { users: req.session.userToLogged });
  },
  deleteSession: ( req, res ) => {
    req.session.destroy();
    return res.redirect("/users/login");
  },
  createRegister: (req, res) => {
    res.render("./users/register");
  }
};

module.exports = usersController;