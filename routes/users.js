"use strict";

const { Router }= require("express");
const router = new Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user")


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async function(req, res, next) {
  let users = await User.all()

  return res.json({ users })
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', ensureLoggedIn, async function(req, res, next) {
let user = await User.get(req.params.username)

return res.json({ user })
})

router.post('/:username/update', ensureCorrectUser, async function(req, res, next) {
  console.log("update route");
  let phone = req.body.phone
  let username = req.params.username
  let user = await User.updateUserInfo(username, phone)

  return res.json({user})
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async function(req, res, next) {
let messagesTo = await User.messagesTo(req.params.username)

  return res.json({ messagesTo })
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async function(req, res, next) {
let messagesFrom = await User.messagesFrom(req.params.username)

  return res.json({ messagesFrom })
})


module.exports = router;