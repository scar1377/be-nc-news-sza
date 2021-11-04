const db = require("../db/connection");
const {
  selectArticleByIdQueryStr,
  selectArticlesQueryStr,
} = require("../utils/utils.js");
const { selectTopics } = require("./topic.model.js");

exports.selectArticleById = async (article_id) => {
  const { rows } = await db.query(selectArticleByIdQueryStr, [article_id]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "article does not exist",
    });
  }
  return rows[0];
};

exports.updateArticleById = async (article_id, updatedArticle) => {
  const { inc_votes } = updatedArticle;
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
  } else if (
    !arr.includes("inc_votes") ||
    typeof updatedArticle.inc_votes !== "number"
  ) {
    return Promise.reject({
      status: 400,
      msg: "incorrect type",
    });
  }
  const query =
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;";
  const { rows } = await db.query(query, [article_id, inc_votes]);
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

  //getting all the topics from the current db by invoking selectTopics from topic.model
  const topicsObjArray = selectTopics();
  const topicsArray = (await topicsObjArray).map((obj) => obj.slug);

  if (!topicsArray.includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 400, msg: "Topic does not exist" });
  }
  const queryParams = [];
  let queryStr = selectArticlesQueryStr;
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
