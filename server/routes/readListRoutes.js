const express = require('express');
const router = express.Router();
const readListController = require('../controllers/readListController');
const protect = require('../middlewares/authMiddleware')

router.use(protect);

router.post('/', readListController.addToReadList);
router.get('/', readListController.getReadList);
router.patch('/:googleBookId', readListController.updateReadListItem);
router.delete('/:googleBookId', readListController.removeFromReadList);

module.exports = router;
