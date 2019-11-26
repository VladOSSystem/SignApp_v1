const express = require('express');
const router = express.Router();
router.get('/',(req, res) => {
    const buttons = require('../utils/parsePDF');
        let call =  buttons.infoInsert();
        let pdfObj = {}
        const convert = (call) => {
            let {tags} = call
            pdfObj = { 
                text: tags
            }
        }
        convert(call)
        console.log(pdfObj)    
        res.json(pdfObj);
   
})

module.exports = router