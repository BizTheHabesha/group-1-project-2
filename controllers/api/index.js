const router = require("express").Router();

const searchRoutes = require("./search");

router.use("/search", searchRoutes);

module.exports = router;
