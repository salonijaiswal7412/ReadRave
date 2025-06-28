const express=require('express');
const {getRecommendations,startConversation}=require('../controllers/chatbotController');
const router=express.Router();

router.get('/start',startConversation);
router.post('/recommend', getRecommendations);
module.exports=router;