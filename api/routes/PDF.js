const express = require('express');
const router = express.Router();
const HummusRecipe = require('hummus-recipe');
const PDF = '../../PDF/normal.pdf'
router.post('/', (req, res) => { 
    console.log(PDF)
    const fs = require('fs'); 
    const PDFParser = require("pdf2json");

    let pdfParser = new PDFParser(this,1);
    pdfParser.loadPDF('./PDF.normal.pdf');
    
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFileSync('./api/utils/content.json', JSON.stringify(pdfData));
    });
    
    let widts = 0;
    let width = req.body.innerW;
    switch(true){
        case (width >= 1 && width < 300):
            widths = 50;
            break;
        case (width >= 300 && width < 500):
                widths = 80;
                break;
        case (width >= 500 && width < 750):
            widths = 120;
            break;
        case (width >= 750 && width < 1000):
            widths = 150;
            break;
        case (width >= 1000 && width < 1250):
            widths = 180;
            break;
        case (width >= 1000 && width < 2144):
                widths = 250;
                break;
        default:
            widths = 100
    }

    // if(req.body.buttonPosition.buttonMain.toggle === true){
        const info = require('../utils/parsePDF');
        const options = req.body.options;
        console.log(options + '-options');
        if(options !== ''){
        let call =  info.infoInsert(req.body.options);
        let pdfObj = {}
        const convert = (call) => { 
            let {x, y, text} = call
            if(call.text.length > 1){ 
                pdfObj = { 
                    x: (x * 12.85).toFixed(0),
                    y: (y * 15.5).toFixed(0),
                    text: text,
                }
            } else {

            pdfObj = { 
                x: (x * 12.85).toFixed(0),
                y: (y * 15.5).toFixed(0),
                text: text[0],
            }
          }  
        }      
        convert(call)
        // console.log(call)
        // console.log(call)
        // console.log(pdfObj)
        let textLength = call.text.length;
        if(call.text.length <= 1){
            const pdfDoc = new HummusRecipe(PDF, './PDF/out.pdf');
            pdfDoc
            .editPage(pdfObj.text.page + 1) 
            .image('../../SignImg/1.png', Number(pdfObj.x), Number(pdfObj.y), {width: widths, keepAspectRatio: true})
            .endPage()  
        } else {
            const pdfDoc = new HummusRecipe(PDF, './PDF/out.pdf');
            const PDFDOC = (i) => {
                pdfDoc
                    .editPage(pdfObj.text[i].page + 1)
                    .image('../../SignImg/1.png', Number(pdfObj.x), Number(pdfObj.y), {width: widths, keepAspectRatio: true})
                    .endPage()
                    
            }
            for(let i = 0; i < textLength; i++){
                PDFDOC(i)
            }
        }
    } else {
        const pdfCreate = new HummusRecipe('new', './PDF/new.pdf')
            pdfCreate
            .createPage('A4')
            .image('../../SignImg/1.png', 20, 100, {width: 300, keepAspectRatio: true})
            .endPage()
        const lastSign = '../../PDF/new.pdf';
        const pdfDoc = new HummusRecipe(PDF, './PDF/out.pdf');
        pdfDoc
        .editPage(1)
        .appendPage(lastSign)
        .endPage()  
        .endPDF()
        console.log('Here come undefined value')
    }
    res.send('OK')
});
module.exports = router