var express = require('express');
var router = express.Router();
const app = express();

/* app.get('/', (req, res) => {
    res.send("Hello world")
}) */


/* GET home page. */
router.get('/', (req, res) => res.render('welcome'));

module.exports = router;

