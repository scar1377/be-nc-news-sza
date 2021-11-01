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

  describe.skip("GET /api/articles", () => {
    test("status:200 responds with an array of article objects, each of which should have 'author', 'title', 'article_id', 'topic', 'created_at','votes' and 'comment_count' properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(3);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(Date),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
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
  });

  describe("/api/articles/:article_id", () => {
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
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
          });
        });
    });
    test.skip("PATCH, status:200 responds with the updated article", () => {
      const voteUpdates = { inc_votes: 7 };
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
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 7,
          });
        });
    });
  });
});
