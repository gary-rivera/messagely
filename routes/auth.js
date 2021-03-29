"use strict";

const Router = require("express").Router;
const router = new Router();
const { UnauthorizedError } = require("../expressError");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config")
const User = require("../models/user")


/** POST /login: {username, password} => {token} */
router.post('/login', async function(req, res, next) {
  let {username, password} = req.body;

  if (await User.authenticate(username, password)) {
    //create token
    let token = jwt.sign(username, SECRET_KEY)
    User.updateLoginTimestamp(username)
    
    //return token obj
    return res.json({ token })

  } else {
    throw new UnauthorizedError()
  }

})

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post('/register', async function(req, res, next) {
  let user = await User.register(req.body);
  let token = jwt.sign(user.username, SECRET_KEY);

  return res.json({ token })
})

module.exports = router;