const usersRouter = require("express").Router();
const { getAllUsers, getUserById } = require("../controllers/users.controller");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUserById);

module.exports = usersRouter;
