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
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "article or comments not found",
    });
  }
  return rows;
};
