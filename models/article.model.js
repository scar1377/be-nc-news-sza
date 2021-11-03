const db = require("../db/connection");
const { convertValuesToNumber } = require("../utils/utils.js");

exports.selectArticleById = async (article_id) => {
  // const query = "SELECT * FROM articles WHERE article_id = $1;";
  const query = `
  SELECT 
  articles.author,
  articles.title, 
  articles.article_id, 
  articles.body,
  articles.topic, 
  articles.created_at, 
  articles.votes,
  COUNT(comments.comment_id)::INT AS comment_counts
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  `;
  const { rows } = await db.query(query, [article_id]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "article does not exist",
    });
  }
  //   const newRows = convertValuesToNumber(rows, "comment_counts");
  // console.log(newRows[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<rows[0]");
  return rows[0];
};

exports.updateArticleById = async (article_id, updatedArticle) => {
  const { inc_votes } = updatedArticle;
  const query =
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;";
  const { rows } = await db.query(query, [article_id, inc_votes]);
  const arr = Object.keys(updatedArticle);
  if (arr.length === 0) {
    return Promise.reject({
      status: 400,
      msg: "missing required fields",
    });
  } else if (arr.length !== 1) {
    return Promise.reject({
      status: 400,
      msg: "multiply updates",
    });
  } else if (arr.includes("inc_votes") === false) {
    return Promise.reject({
      status: 400,
      msg: "incorrect type",
    });
  }

  return rows[0];
};
exports.selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_counts",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  if (!["cats", "mitch", "paper"].includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 400, msg: "Topic does not exist" });
  }
  const queryParams = [];
  let queryStr = `
  SELECT 
  articles.author,
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.votes,
  COUNT(comments.comment_id)::INT AS comment_counts
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  `;
  if (topic) {
    queryStr += `WHERE articles.topic = $1 `;
    queryParams.push(topic);
  }
  if (sort_by) {
    queryStr += `GROUP BY articles.article_id
      ORDER BY ${sort_by}`;
  }
  if (order) {
    queryStr += ` ${order}`;
  }
  const { rows } = await db.query(queryStr, queryParams);
  return rows;
};
