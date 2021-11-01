const db = require("../connection.js");

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
            avator_url VARCHAR,
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
                  votes INT,
                  topic VARCHAR REFERENCES topics(slug),
                  author VARCHAR REFERENCES users(username) NOT NULL,
                  created_at DATE
                );`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE comments(
                  comment_id SERIAL PRIMARY KEY,
                  author VARCHAR REFERENCES users(username),
                  article_id INT REFERENCES articles(article_id) NOT NULL,
                  votes INT,
                  created_at DATE,
                  body VARCHAR
                )`
            );
          });
      });
    });
  });

  // 2. insert data
};

module.exports = seed;
