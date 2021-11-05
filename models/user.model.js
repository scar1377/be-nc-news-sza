const db = require("../db/connection");

exports.selectAllUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users");
  return rows;
};

exports.selectUserByUsername = async (username) => {
  const queryStr = `
    SELECT *
    FROM users WHERE username = $1
    `;
  const { rows } = await db.query(queryStr, [username]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "user does not exist",
    });
  }
  return rows[0];
};
