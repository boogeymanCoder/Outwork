if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const compression = require('compression');

const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');
const publicRouter = require('./routes/public');
const jobRouter = require('./routes/job');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const verifyRouter = require('./routes/verify');
const recoverRouter = require('./routes/recover');
const applicationRouter = require('./routes/application');
const initializePassport = require('./routes/passport-config');
const Account = require('./models/account');

initializePassport(
    passport,
    async (emailUsername) => {
        return Account.findOne({
            $or: [
                {email: emailUsername},
                {username: emailUsername}
            ]
        });
    }, async (id) => {
        return Account.findById(id);
    }
);

//must be first of all app.use()
if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.headers.host}${req.url}`)
      else
        next()
    })
}

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(compression());
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
});
db.once('open', () => {
    console.log('Connected!');
});

app.use('/application', applicationRouter);
app.use('/recover', recoverRouter);
app.use('/verify', verifyRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/job', jobRouter);
app.use('/public', publicRouter);
app.use('/profile', profileRouter);
app.use('/', indexRouter);

// Page dependencies
app.use('/css', express.static(__dirname + '/node_modules/animate.css')); // redirect animate.css CSS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect bootstrap CSS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-icons/font'));// redirect bootstrap icons

// Handle 404
app.use(function(req, res) {
    res.status(400);
    res.render('404');
});
   
// Handle 500
// app.use(function(error, req, res, next) {
//     res.status(500);
//     res.render('500');
// });

app.listen(process.env.PORT || 3000);