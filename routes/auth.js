function checkIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('error', 'Please login your account');
    res.redirect('/login');
}

function checkIfNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        req.flash('info', 'Please logout first to access page');
        return res.redirect('/');
    }

    next();
}

module.exports = {
    checkIfAuthenticated: checkIfAuthenticated,
    checkIfNotAuthenticated: checkIfNotAuthenticated
}