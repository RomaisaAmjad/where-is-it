const Router = require("express");
const todoRoutes = require('./todo.route');
const router = Router();

router.use("/todo", todoRoutes);

module.exports = router;