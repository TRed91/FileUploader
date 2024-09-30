const passport = require('passport');


exports.indexGet = (req, res) => {
    const user = req.user || null;
    const errs = req.session.messages || [];
    const err = errs[errs.length - 1];
    res.render('index', { user: user, err: err });
}
