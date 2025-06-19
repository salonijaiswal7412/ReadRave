const express = require('express');
const router = express.Router();
const readListController = require('../controllers/readListController');
const requireAuth = require('../middlewares/authMiddleware')

router.use(requireAuth);

router.post('/', readListController.addToReadList);
router.get('/', readListController.getReadList);
router.patch('/:googleBookId', readListController.updateReadListItem);
router.delete('/:googleBookId', readListController.removeFromReadList);

module.exports = router;
