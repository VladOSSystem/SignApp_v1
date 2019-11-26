 const fs = require('fs');
const path = require('path')
const obj = fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8');
let mydata = JSON.parse(obj);
let page = mydata.formImage.Pages[0].Texts,
    pages = mydata.formImage.Pages;

let arr = [],
    innerArr = [];

let i = 0;

pages.forEach((v) =>{

  let eternalObj = {
    pages: {
      page: i++,
      props: v.Texts
    }

  }
  innerArr.push(eternalObj)
    });

    let arrLength = innerArr.length;

    let countArr = [];

    for(let i = 0; i < arrLength; i++){

      countArr.push(innerArr[i].pages.props.length)

    }

    let innerArr2 = [];

    for(let j = 0; j < arrLength; j++){

    innerArr[j].pages.props.forEach((e) => {

      const obj = {
        x: e.x,
        y: e.y,
        text: decodeURIComponent(e.R[0].T),
        page: j
    }  

    innerArr2.push(obj)

    })
  };
  let arrFilter = [];


  innerArr2.forEach((v) => {

    arrFilter.push({text:v.text, page:v.page})

  });

    let upperFilterArr = [];

    innerArr2.forEach((v) => {

      upperFilterArr.push(v.text)

    })

    let spliters = upperFilterArr.join(' ').split('SIGN-');

    let arrSplit = [],
        tagArrs = [];

    for(let i = 1; i < spliters.length; i++){

      arrSplit.push(spliters[i].split(' '))

    }
    for (let i = 0; i < arrSplit.length; i++) {

      tagArrs.push(arrSplit[i][0])

    }

  exports.infoInsert = function (word) {
      // let word = `SIGN-${tagArrs[2]}`;

      const result = arrFilter.filter(text => {

        return text.text === `${word}`

      });

      let wykres = {},
          multipleSign = {};

      if(result.length === 1){

        arrTypeFound = innerArr2.find( lor => lor.text === `${result[0].text}` );

        wykres = {
          x: arrTypeFound.x,
          y: arrTypeFound.y,
          text: result,
          page: arrTypeFound.page,
          tags: tagArrs
        }

       return wykres
      } else if(result.length > 1) {

        arrTypeFound = innerArr2.find( lor => {

          return (lor.text === result[1].text && lor.page === result[1].page)

        });
            wykres = {
              x: arrTypeFound.x,
              y: arrTypeFound.y,
              text: result,
              page: arrTypeFound.page,
              tags: tagArrs
            }
            return wykres
          } else {
            let hi = 'hi';
            wykres = {
              hi: hi,
              tags: tagArrs
            }
          }
      return wykres
    }