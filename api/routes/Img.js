const express = require('express');
const router = express.Router();
const base64Img = require('base64-img');

router.post('/', (req,res) => {

        base64Img.img(`${req.body.base64}`, './SignImg', '1', function(err, filepath) {});
   
       res.send('OK')
});
module.exports = router 