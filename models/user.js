"use strict";

/** User of the site. */
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config")
const db = require("../db");
const NotFoundError = require("../expressError")
class User {

  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    // generate hash password
    let hashed = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // insert user to db
    const result = await db.query(`
        INSERT INTO users (username,
                          password,
                          first_name,
                          last_name,
                          phone,
                          join_at, 
                          last_login_at)
        VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
        RETURNING username, password, first_name, last_name, phone
    `, [username, hashed, first_name, last_name, phone])
      
    const user = result.rows[0];
    return user
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(`
      SELECT password
      FROM users
      WHERE username = $1
    `, [username])
    const user = result.rows[0];
    if(user) {
      if (await bcrypt.compare(password, user.password) === true) {
        return true;
      }
    }
    return false;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(`
        UPDATE users
        SET last_login_at = current_timestamp
          WHERE username = $1
    `, [username])
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    const result = await db.query(`
      SELECT username, first_name, last_name
      FROM users
    `)
    return result.rows
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(`
      SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1
    `, [username])
    const user = result.rows[0];
    return user
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
  
    const result = await db.query(`
      SELECT m.id, m.to_username, m.body, m.sent_at, m.read_at, 
      u.username, u.first_name, u.last_name, u.phone
      FROM messages AS m
      JOIN users AS u ON u.username = m.to_username
      WHERE from_username = $1
    `, [username])

    let messages = result.rows.map(m => {
      return {
        id:m.id, 
        to_user:{username:m.username, first_name:m.first_name, last_name:m.last_name, phone:m.phone},
        body:m.body, 
        sent_at:m.sent_at, 
        read_at:m.read_at
      }
    })
    return messages
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(`
    SELECT m.id, m.from_username, m.body, m.sent_at, m.read_at, 
    u.username, u.first_name, u.last_name, u.phone
    FROM messages AS m
    JOIN users AS u ON u.username = m.from_username
    WHERE to_username = $1
  `, [username])

  let messages = result.rows.map(m => {
    return {
      id:m.id, 
      from_user:{username:m.username, first_name:m.first_name, last_name:m.last_name, phone:m.phone},
      body:m.body, 
      sent_at:m.sent_at, 
      read_at:m.read_at
    }
  })
  return messages
  }
}


module.exports = User;
