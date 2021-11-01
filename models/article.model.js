const db = require("../db/connection");

exports.selectSingleArticle = async (article_id) => {
  const query = "SELECT * FROM articles WHERE article_id = $1;";
  const { rows } = await db.query(query, [article_id]);
  return rows[0];
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
