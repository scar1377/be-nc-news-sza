const db = require("../db/connection");

exports.selectArticleById = async (article_id) => {
  const query = "SELECT * FROM articles WHERE article_id = $1;";
  const { rows } = await db.query(query, [article_id]);
  return rows[0];
};

exports.updateArticleById = async (article_id, updatedArticle) => {
  const { votes } = updatedArticle;
  console.log(updatedArticle, "<<<<<<<<<<<<<<<<<<<in model");
  const query1 = "SELECT * FROM articles WHERE article_id = $1;";
  const query2 =
    "UPDATE articles SET votes = $2 WHERE article_id = $1 RETURNING *;";
  const promise1 = db.query(query1, [article_id]).then(({ rows }) => rows[0]);

  const promise2 = db
    .query(query2, [article_id, votes])
    .then(({ rows }) => rows[0]);

  const promises = [promise1, promise2];
  const [article1, article2] = await Promise.all(promises);
  article1.votes += article2.votes;
  return article1;
};
// exports.selectArticles = async () => {
//   const query = `
//   SELECT title, article_id, topic, created_at, votes
//   FROM articles
//   LEFT JOIN users
//   ON articles.author = users.username
//   LEFT JOIN comments
//   ON
//   `;

//   const { rows } = await db.query(query);
//   return rows;
// };
