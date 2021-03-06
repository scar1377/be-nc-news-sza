const request = require("supertest");
const db = require("../db/connection.js");

const app = require("../app.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {
  test("status:200 responds with the descriptions of all the endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.descriptions["GET /api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
      });
  });
  test("status:404 responds with an error message", () => {
    return request(app)
      .get("/api/not-a-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });

  describe("GET /api/topics", () => {
    test("status:200 responds with an array of topic objects, each of which should have 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test("status:404 responds with an error message", () => {
      return request(app)
        .get("/api/topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
        });
    });
  });

  describe("GET /api/topics/:slug", () => {
    test("status:200 responds with an array of topic objects, each of which should have 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics/cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.topic).toEqual({
            slug: "cats",
            description: "Not dogs",
          });
        });
    });
    test("status:404 responds with an error message", () => {
      return request(app)
        .get("/api/topics/cat")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("topic does not exist");
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("GET, status:200 responds with a single matching article", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T14:14:00.000Z",
            votes: 0,
            comment_counts: 2,
          });
        });
    });
    test("GET status:404 responds with an error message", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article does not exist");
        });
    });
    test("GET status:400 responds with an error message", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("PATCH, status:200 responds with the updated article", () => {
      const voteUpdates = { inc_votes: -27 };
      return request(app)
        .patch("/api/articles/5")
        .send(voteUpdates)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T14:14:00.000Z",
            votes: -27,
          });
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { rating: 9 };
      return request(app)
        .patch("/api/articles/5")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("incorrect type");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { inc_votes: "Woohoo" };
      return request(app)
        .patch("/api/articles/5")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("incorrect type");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = {};
      return request(app)
        .patch("/api/articles/5")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("missing required fields");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { inc_votes: 1, name: "Mitch" };
      return request(app)
        .patch("/api/articles/5")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("multiply updates");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { inc_votes: -27 };
      return request(app)
        .patch("/api/articles/9999")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("article does not exist");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { inc_votes: -27 };
      return request(app)
        .patch("/api/articles/not-an-id")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });

  describe("GET /api/articles", () => {
    test("status:200 responds with an array of article objects, each of which should have 'author', 'title', 'article_id', 'topic', 'created_at','votes' and 'comment_count' properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(12);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_counts: expect.any(Number),
              })
            );
          });
        });
    });
    test("status:404 responds with an error message", () => {
      return request(app)
        .get("/api/article")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
        });
    });
    test("sort_by status:200 accepts sort_by author query", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("sort_by status:200 accepts sort_by comment_counts query", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_counts")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("comment_counts", {
            descending: true,
          });
        });
    });
    test("sort_by status:200 accepts sort_by created_at query", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("sort_by status:200 accepts sort_by default value query", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("sort_by status:400 responds with error message for invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort_by query");
        });
    });
    test("order status:200 accepts order query", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
    });
    test("order status:200 accepts default order query", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("order status:400 responds with error message for invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?order=invalid_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query");
        });
    });
    test("topic status:200 accepts topic query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(1);
        });
    });
    test("topic status:200 responds with error message for non-article-related", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).toBe("No articles related to this topic");
        });
    });
    test("topic status:404 responds with error message for invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=no-such-a-topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic does not exist");
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("GET status:200 responds with an array of comments for the given article_id ", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(2);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("GET status:200 responds with an error message", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("GET status:404 responds with an error message", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
    test("GET status:400 responds with an error message", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("POST status:201 responds with the posted comments", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Yesterday was the other day!",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 19,
            body: "Yesterday was the other day!",
            votes: 0,
            author: "butter_bridge",
            article_id: 5,
            created_at: expect.any(String),
          });
        });
    });
    test("POST status:201 responds with the posted comments", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Yesterday was the other day!",
        votes: 5,
        rating: 6,
        remark: "from 7731racs",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 19,
            body: "Yesterday was the other day!",
            votes: 5,
            author: "butter_bridge",
            article_id: 5,
            created_at: expect.any(String),
          });
        });
    });
    test("POST status:404 responds with error message", () => {
      const newComment = {
        username: "7731racs",
        body: "Yesterday was the other day!",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("user does not exist");
        });
    });
    test("POST status:400 responds with an error message", () => {
      const newComment = {
        author: "butter_bridge",
        review: "Yesterday was the other day!",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("incorrect type");
        });
    });
    test("POST status:400 responds with an error message", () => {
      const newComment = {
        author: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/5/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("missing required fields");
        });
    });
    test("POST status:400 responds with an error message", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Yesterday was the other day!",
      };
      return request(app)
        .post("/api/articles/not-an-id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("POST status:404 responds with an error message", () => {
      const newComment = {
        username: "butter_bridge",
        body: "Yesterday was the other day!",
      };
      return request(app)
        .post("/api/articles/9999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("DELETE status:204 responds with no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("DELETE status:404 responds with an error message", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment does not exist");
        });
    });
    test("DELETE status:400 responds with an error message", () => {
      return request(app)
        .delete("/api/comments/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });

  describe("GET /api/users", () => {
    test("status:200 responds with an array of user objects, each of which should have 'username', 'name' and 'avatar_url' properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(4);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String),
              })
            );
          });
        });
    });
    test("status:404 responds with an error message", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
        });
    });
  });
  describe("GET /api/users/:username", () => {
    test("GET, status:200 responds with a single matching user", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toEqual({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    test("GET status:404 responds with an error message", () => {
      return request(app)
        .get("/api/users/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("user does not exist");
        });
    });
  });

  describe("PATCH /api/comments/:comment_id", () => {
    test("PATCH, status:200 responds with the updated comment", () => {
      const voteUpdates = { inc_votes: 19 };
      return request(app)
        .patch("/api/comments/5")
        .send(voteUpdates)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 5,
            author: "icellusedkars",
            article_id: 1,
            votes: 19,
            body: "I hate streaming noses",
            created_at: expect.any(String),
          });
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { rating: 9 };
      return request(app)
        .patch("/api/comments/19")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("incorrect type");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { inc_votes: "Woohoo" };
      return request(app)
        .patch("/api/comments/19")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("incorrect type");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = {};
      return request(app)
        .patch("/api/comments/19")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("missing required fields");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { inc_votes: 1, name: "Mitch" };
      return request(app)
        .patch("/api/comments/19")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("multiply updates");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { inc_votes: 17 };
      return request(app)
        .patch("/api/comments/9999")
        .send(voteUpdates)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment does not exist");
        });
    });
    test("PATCH status:400 responds with an error message", () => {
      const voteUpdates = { inc_votes: 17 };
      return request(app)
        .patch("/api/comments/not-an-id")
        .send(voteUpdates)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});
