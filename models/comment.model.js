const { response } = require("../app");
const db = require("../db/connection");
const { renameKey } = require("../utils/utils.js");
const { updateArticleById } = require("./article.model");

exports.selectCommentsByArticleId = async (article_id) => {
  const query = `
  SELECT 
  comment_id,
  votes,
  created_at,
  author,
  body
  FROM comments WHERE article_id = $1
  `;
  const { rows } = await db.query(query, [article_id]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "article or comments not found",
    });
  }
  return rows;
};

exports.addCommentByArticleId = async (article_id, newComment) => {
  const { username, body } = newComment;
  const arr = Object.keys(newComment);
  if (arr.length <= 1) {
    return Promise.reject({
      status: 400,
      msg: "missing required fields",
    });
  } else if (arr.length !== 2) {
    return Promise.reject({
      status: 400,
      msg: "incorrect format",
    });
  } else if (
    !arr.includes("username") ||
    typeof newComment.username !== "string" ||
    typeof newComment.body !== "string" ||
    !arr.includes("body")
  ) {
    return Promise.reject({
      status: 400,
      msg: "incorrect type",
    });
  }
  const queryStr = `
  INSERT INTO comments (
      article_id,
      author, 
      body)
      VALUES ($1,$2,$3)
      RETURNING *
    `;
  await db.query("INSERT INTO users (username) VALUES ($1)", [username]);
  const { rows } = await db.query(queryStr, [article_id, username, body]);

  return rows[0];
};

exports.dropCommentById = async (comment_id) => {
  const { rows, rowCount } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1;",
    [comment_id]
  );
  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: "comment does not exist",
    });
  }

  return rows[0];
};
