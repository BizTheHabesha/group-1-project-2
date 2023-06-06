const router = require("express").Router();

const searchRoutes = require("./searchRoutes");
const userRoutes = require("./userRoutes");

router.use("/search", searchRoutes);
router.use("/users", userRoutes);

module.exports = router;
