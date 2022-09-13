const express = require('express');
const { languageController, getLanguages } = require('./languageController.js');
const partsController = require('./partsController.js');

const router = express.Router();

router.route('/:language/:part/:word/:index').get(languageController);
router.route('/:language/parts').get(partsController);
router.route('/languages').get(getLanguages);

module.exports = router;
