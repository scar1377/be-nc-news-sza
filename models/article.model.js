const db = require("../db/connection");

exports.selectArticleById = async (article_id) => {
  if (typeof article_id !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID",
    });
  }
  const query = "SELECT * FROM articles WHERE article_id = $1;";
  const { rows } = await db.query(query, [article_id]);
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
  console.log(updatedArticle, "<<<<<<<<<<<<<<<<<updatedArticle");
  //const query1 = "SELECT * FROM articles WHERE article_id = $1;";
  const query =
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;";
  const { rows } = await db.query(query, [article_id, inc_votes]);
  if (
    Object.keys(updatedArticle).length === 0 ||
    updatedArticle.hasOwnProperty("inc_votes") === false ||
    typeof updatedArticle.inc_votes !== "number"
  ) {
    return Promise.reject({
      status: 400,
      msg: "missing required fields",
    });
  }
  return rows[0];
};
// exports.selectArticles = async () => {
//   const query = `
//   SELECT title, article_id, topic, created_at, votes
//   FROM articles
//   LEFT JOIN users
//   ON articles.author = users.username
//   LEFT JOIN comments
//   ON articles.comments_count = comments.
//   COUNT(*) AS comments_count
//   FROM comments WHERE article_id = $1
//   `;

//   const { rows } = await db.query(query);
//   return rows;
// };
