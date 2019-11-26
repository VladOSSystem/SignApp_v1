const express = require('express');
const router = express.Router();

router.post('/', (req,res) => {
 const fs = require('fs');
    const PDFParser = require("pdf2json");

    let pdfParser = new PDFParser(this,1);
    pdfParser.loadPDF('./PDF/normal.pdf');
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFileSync("./api/utils/content.json", JSON.stringify(pdfData));
    });
    res.send('ok')
})
module.exports = router;