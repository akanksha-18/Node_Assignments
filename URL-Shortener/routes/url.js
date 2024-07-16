const express=require('express');
const {HandleGenerateNewShortURL,handleGetAnalytics}=require("../controllers/url");
const router=express.Router();

router.post('/',HandleGenerateNewShortURL)
router.get("/analytics/:shortId",handleGetAnalytics)
module.exports=router;

