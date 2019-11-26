const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const urlHash = require('url-hash');
const http = require('http');
const url = require('url') ;
const base64Img = require('base64-img');
const expressip = require('express-ip'); 
const morgan = require('morgan'); 
const createImg = require('./api/routes/Img'); 
const createPDF = require('./api/routes/PDF');
const MainApi = require('./api/routes/Main');
const pdfButtons = require('./api/routes/PdfButtons');
const HummusRecipe = require('hummus-recipe');
const parsePdf = require('./api/routes/ParsePDF');
const User = require('./models').User;
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const port = process.env.PORT || 5000;
app.use(expressip().getIpInfoMiddleware);
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/', MainApi); 
app.use('/create-img',createImg)
app.use('/parse-pdf', parsePdf)
const PDF = `./PDF/normal.pdf`;

app.post('/create-pdf', async (req, res) => {
    console.log(req.body)   
    const fs = require('fs');
    const PDFParser = require("pdf2json"); 

    let pdfParser = new PDFParser(this,1);
    pdfParser.loadPDF(PDF);
    
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFileSync("./api/utils/content.json", JSON.stringify(pdfData));
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
        const info = require('./api/utils/parsePDF');
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
            .image('./SignImg/1.png', Number(pdfObj.x), Number(pdfObj.y), {width: widths, keepAspectRatio: true})
            .endPage()  
        } else {
            const pdfDoc = new HummusRecipe(PDF, './PDF/out.pdf');
            const PDFDOC = (i) => {
                pdfDoc
                    .editPage(pdfObj.text[i].page + 1)
                    .image('./SignImg/1.png', Number(pdfObj.x), Number(pdfObj.y), {width: widths, keepAspectRatio: true})
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
            .image('./SignImg/1.png', 20, 100, {width: 300, keepAspectRatio: true})
            .endPage()
            .endPDF(()=>{ /* done! */ });
        const lastSign = './PDF/new.pdf';
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
app.get('/hashPDF', (req, res) => {
    fs.copyFile('./PDF/out.pdf', `./hashPDF/${uuidv1()}.pdf`, (err) => {
        if (err) throw err;
        console.log('source.txt was copied to destination.txt');
      });
    res.send('OK')
})
 
app.get('/fetch-pdf',(req, res) => {    
    res.sendFile(`${__dirname}/PDF/out.pdf`)
})
app.get('/fetch-buttons', (req,res) => {
	fs.copyFile('./PDF/normal.pdf', './client/src/PDF/main.pdf', (err) => {

		if (err) throw err;
	   
	  console.log('source.txt was copied to destination.txt');
	  
	  });
        const buttons = require('./api/utils/parsePDF');
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

app.get('/:hash', async (req, res) => {

	const filter = await User.findAll({
		where:{
			hash:`${req.params.hash}`
		}
	}) 
	res.json(filter)
}) 


app.listen(port, () => console.log(`Listening on port ${port}`)); 