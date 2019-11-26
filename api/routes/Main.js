const express = require('express');
const path = require('path');
const Pdf = require('../../models').Pdf;
const User = require('../../models').User;
const base64 = require('base64toPdf') 
const fs = require('fs')
const md5 = require('md5');
const urlHash = require('url-hash');
const http = require('http');
const router = express.Router();
const url = require('url') ;
router.post('/', async (req, res) => { 
    let id;
    let signList =  await req.body.signList;
    console.log(signList)
    await Pdf.create({
		title: req.body.title,
		file: req.body.pdf 
	}).then(pdf => {
			signList.map(v => {
				pdf.createUser({
					firstName: v.name,
					lastName: v.surname,
					email: v.email,
					signPlace: v.signPlace   
				}) 
				id = pdf.id
			}); 
    })
    const lors = async () => {
    await Pdf.findAll({include: [User]})
        .then(e =>{
            const infoId = e.reverse();
            let mapUsers = infoId[0].Users
            mapUsers.map(v => { 
                console.log(v.dataValues.id)
                const hashId = md5(v.dataValues.id)
                User.update(
                    { hash: `${hashId}` },
                    { where: { id: v.dataValues.id } }
                    )
            })
        })           
    } 
    setTimeout(() => { 
        lors()
    },100)
        
		const lorsOut = async () => {
		const connect = await Pdf.findAll({include: [User]});
		const info = await connect.reverse();
		// console.log(info)
		// info.map(v => console.log(v.Users))
		// console.log(info[0].Users[0])
		const Obj = {
			test:'success',
			id: info[0].id, 
			hash: info[0].hash,
			users: info[0].Users,
			hashUrl1: `http://localhost:5000/signDocument/${info[0].Users[0].hash}`,
			hashUrl2: `http://localhost:5000/signDocument/${info[1].Users[1].hash}`,
		}
		res.json(Obj)
	}
	setTimeout(() => {
		lorsOut()
    },500)
});     

router.get('/signDocument/:hash', async (req, res) => {
	
	Pdf.findAll({         
		include: [User]
	}).then(pdf => {
        const info = pdf.reverse() 
		let decodedBase64 = base64.base64Decode(info[0].file, `./PDF/normal.pdf`);
		let arr = []  
		const all = pdf.forEach(element => {
			element.Users.forEach(c => {arr.push(c)})
		});
		let pathname = url.parse(req.url).pathname.slice(14); // pathname = '/MyApp'
		console.log(pathname + ' its slice')
		arr.forEach(hash => console.log(hash.hash + ' its hash'))
		filtering = arr.find( lor => lor.hash === `${pathname}`); 
		if(filtering !== undefined){
			res.redirect(`http://localhost:3000/signDocument/${req.params.hash}`)
		}else {                         
			res.send(500).json({msg:"error"})
		}
	});
});


module.exports = router