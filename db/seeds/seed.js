const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  return db.query(`DROP TABLE IF EXISTS comments`).then(() => {
    return db.query(`DROP TABLE IF EXISTS articles`).then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`).then(() => {
        return db
          .query(`DROP TABLE IF EXISTS users`)
          .then(() => {
            return db.query(
              `CREATE TABLE users(
            username VARCHAR PRIMARY KEY NOT NULL,
            avatar_url VARCHAR,
            name VARCHAR
          );`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE topics(
                slug VARCHAR PRIMARY KEY NOT NULL,
                description VARCHAR
              );`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE articles(
                  article_id SERIAL PRIMARY KEY,
                  title VARCHAR,
                  body VARCHAR,
                  votes INT DEFAULT 0,
                  topic VARCHAR REFERENCES topics(slug),
                  author VARCHAR REFERENCES users(username) NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE comments(
                  comment_id SERIAL PRIMARY KEY,
                  author VARCHAR REFERENCES users(username),
                  article_id INT REFERENCES articles(article_id) NOT NULL,
                  votes INT DEFAULT 0,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  body VARCHAR
                )`
            );
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO users(username, avatar_url, name)
            VALUES %L;`,
              userData.map((user) => {
                return [user.username, user.avatar_url, user.name];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO topics(slug, description)
            VALUES %L;`,
              topicData.map((topic) => {
                return [topic.slug, topic.description];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO articles(
                title,
                body,
                topic,
                author)
            VALUES %L;`,
              articleData.map((article) => {
                return [
                  article.title,
                  article.body,
                  article.topic,
                  article.author,
                  // article.created_at,
                ];
              })
            );
            return db.query(queryStr);
          })
          .then(() => {
            const queryStr = format(
              `INSERT INTO comments(
                author,
                article_id,
                body)
            VALUES %L;`,
              commentData.map((comment) => {
                return [comment.author, comment.article_id, comment.body];
              })
            );
            return db.query(queryStr);
          });
      });
    });
  });

  // 2. insert data
};

module.exports = seed;
