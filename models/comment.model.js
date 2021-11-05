const db = require("../db/connection");

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
  const articleResult = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (articleResult.rows.length === 0 && rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "article not found",
    });
  }
  return rows;
};

exports.addCommentByArticleId = async (article_id, newComment) => {
  const { username, body, votes } = newComment;
  const keyArr = Object.keys(newComment);
  if (keyArr.length < 2) {
    return Promise.reject({
      status: 400,
      msg: "missing required fields",
    });
  } else if (
    !keyArr.includes("username") ||
    typeof newComment.username !== "string" ||
    typeof newComment.body !== "string" ||
    !keyArr.includes("body")
  ) {
    return Promise.reject({
      status: 400,
      msg: "incorrect type",
    });
  }
  const usernameResult = await db.query("SELECT * FROM users");
  const usernameArr = usernameResult.rows.map((user) => user.username);
  if (!usernameArr.includes(username)) {
    return Promise.reject({
      status: 404,
      msg: "user does not exist",
    });
  }

  const articleResult = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (articleResult.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "article not found",
    });
  }
  const withVotesQueryStr = `
  INSERT INTO comments (
      article_id,
      author, 
      body,
      votes
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `;
  const withoutVotesQueryStr = `
    INSERT INTO comments (
        article_id,
        author, 
        body
        )
        VALUES ($1,$2,$3)
        RETURNING *
      `;
  let response;
  if (votes !== undefined) {
    response = await db.query(withVotesQueryStr, [
      article_id,
      username,
      body,
      votes,
    ]);
  } else {
    response = await db.query(withoutVotesQueryStr, [
      article_id,
      username,
      body,
    ]);
  }
  return response.rows[0];
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
