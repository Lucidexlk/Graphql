const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main.controller')

//Insert order
router.get('/', mainController.test);



module.exports = router;