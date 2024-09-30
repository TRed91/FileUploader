const db = require('../db/queries');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const validateUser = [
    body('username').trim(),
    body('pw').trim()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('cpw').trim()
        .custom((cpw, {req}) => cpw === req.body.pw).withMessage("Passwords don't match"),
]

exports.signupGet = (req, res) => {
    const user = req.user || null;
    res.render('signup', { user: user });
}

exports.signupPost = [
    validateUser,
    (req, res) => {
        const { username, pw, cpw } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('signup', { errors: errors.array() });
        }

        bcrypt.hash(pw, 10, async(err, hashedPw) => {
            if (err) {
                console.error('Hashing Error: ', err.message);
            }
            try {
                const user = await db.createUser({name: username, pw: hashedPw});
                console.log('Created user: ', { id: user.id, name: user.name });
                res.redirect('/');
            } catch (err) {
                console.error('User Create Error: ', err.message);
                res.redirect('/');
            }
        })
    }
]