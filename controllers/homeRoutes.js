const router = require("express").Router();
const { User } = require("../models");

router.get("/", async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    // const teamData = await Project.findAll({
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["name"],
    //     },
    //   ],
    // });

    // Pass serialized data and session flag into template
    res.render("homepage");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
