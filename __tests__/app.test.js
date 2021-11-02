const request = require("supertest");
const db = require("../db/connection.js");

const app = require("../app.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {
  test("status:200 responds with succeeded message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("Welcome to NC-News!");
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
    test.only("sort_by status:200 accepts sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).toBe(1);
        });
    });
    test.only("sort_by status:400 responds with error message for invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});
