const { Router } = require('express');
const indexController = require('../controllers/indexController');
const signupController = require('../controllers/signUpController');
const passport = require('passport');

const router = Router();

router.get('/', indexController.indexGet);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureMessage: true
    })
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/signup', signupController.signupGet);
router.post('/signup', signupController.signupPost);

module.exports = router;