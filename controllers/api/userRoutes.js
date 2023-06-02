const withAuth =  require('../utils/auth')
const router = require('express').Router();
const { User } = require('../models');

// creating new user and POST

router.post("/", async (req, res) => {
    try {
        const newUserData = await User.create({
            email: req.body.name,
            password: req.body.password,
        });

        req.session.save(() => { 
            req.session.user_id = newUserData.id;
            req.ession.logged_in = true;
            res.status(200).json(newUserData);
        });

    } catch (error) {
        res.status(400).json(error);
    }
});

// Login

router.post("/login", async (req, res) => {
    try {
        const userData = await User.findOne ({
            where: {
                email: req.body.email,
            },
        });

        if (!userData) {
            res.status(400)
            res.json({ message: "Invalid Login Credentials"});
            return;
         }

         const pwdValid = await userData.checkPassword(req.body.password); 

         if (!pwdValid) {
            res.status(400)
            res.json({ message: "Invalid Login Credentials"});
            return;
         }

         req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.json({ user: userData, message: "Success"});
         });
        } catch (error) {
            res.status(500).json(error);
        }
    });