const express = require('express');
const router = express.Router();

router.get('/insights', (req, res) => {
    res.render('public/insights.ejs');
});

module.exports = router;