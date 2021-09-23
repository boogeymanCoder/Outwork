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

function checkPasswordStrength(password) {
    const regex = new RegExp('^$|((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,})');
    return regex.test(password);
}

module.exports = {
    checkIfAuthenticated: checkIfAuthenticated,
    checkIfNotAuthenticated: checkIfNotAuthenticated,
    checkPasswordStrength: checkPasswordStrength
}