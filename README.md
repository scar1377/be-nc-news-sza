# Northcoders News - SZA API

<img src="https://victorine.ch/wordpress/wp-content/uploads/2014/03/news.jpg"></a>

<p align="right"><font size=1>*The picture is from internet</font></p>
## Introduction

This API provides data for Reddit-style news website. It is the back-end built using `Node-postgres` for interacting with the `PSQL` database. It includes multiple endpoints tested with full TDD.

**To visit the hosted site please visit https://szanews.herokuapp.com/api**

---

### **Prerequisites**

- Node.js version 16.13.0
- PostgreSQL version 14.0

---

### **Installation**

#### To run this project, listed dependencies are needed

- dotenv
- express
- jest
- jest-sorted
- pg
- pg-format
- supertest

<u>please follow the steps</u>

Clone the repository

```
git clone https://github.com/scar1377/be-nc-news-sza.git
```

Install the required dependencies by using

```
npm i
```

### **Connecting to different PostgreSQL databases**

In order to use `node-postgres` to connect to different databases, we need two .env files. Duplicate the `.env-example` and rename both of them to `.env.test` and `.env.development`.

in `.env.development`

```
PGDATABASE=development_database_name
```

in `.env.test`

```
PGDATABASE=test_database_name
```

**Now we can seed the local databases**

please run the following CLI

```
npm run setup-dbs
npm run seed
```

To check the tables please run (optional)

```
npm run check
```

To test all the endpoints please run

```
npm test
```
