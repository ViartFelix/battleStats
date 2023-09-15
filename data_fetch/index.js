import puppeteer from "puppeteer-extra"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
import { rimraf, rimrafSync, native, nativeSync } from 'rimraf'

import * as fsExtra from "fs-extra";

import adblocker from "puppeteer-extra-plugin-adblocker"
import {DEFAULT_INTERCEPT_RESOLUTION_PRIORITY} from "puppeteer"

//Utilisation du adblocker
puppeteer.use(adblocker({interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY}))

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const destination=__dirname+"\\assets\\img\\"

fsExtra.emptyDirSync(destination);

console.log(destination);

;(async () => {
  await delay(5);
  const browser=await puppeteer.launch({
    headless:true
  });

  const page=await browser.newPage();

  await page.setViewport({
    width:1920,
    height:1024
  });

  await page.goto('https://mygamatoto.com/allcats')

  //const imgPage=await browser.newPage();
  let diff=0;

  page.on('response',(res)=> {
    const url=res.url();

    if(res.request().resourceType() === "image") {
      //Si c'est une url classique (autre que le logo)
      if(!url.startsWith('data:')) {
        res.buffer().then(file=>{
          let urlImgSplit=url.split('/')[4].split("_")[0];
          let urlImg=urlImgSplit.split('-')

          let fileName

          if(urlImg[0]*1>=183) {
            diff=1;
          }

          let idForm=[(urlImg[0]*1-diff),(urlImg[1]*1)]
          fileName=idForm[0]+"_"+idForm[1]+".png"

          
          const filePath=path.resolve(destination,fileName);

          const writeStream=fs.createWriteStream(filePath);
          writeStream.write(file);
        })
      }
    }
  });
  
  let allData=[];
  await fs.writeFileSync("data.json",JSON.stringify(allData))

  let tableSelector='div#root main.ant-layout-content div.ant-table-wrapper div.ant-spin-container div.ant-table.ant-table-small.ant-table-fixed-header.ant-table-layout-fixed.ant-table-scroll-position-left div.ant-table-content div.ant-table-scroll div.ant-table-body table.ant-table-fixed tbody.ant-table-tbody'
  let paginationSelector='ul.ant-pagination.ant-table-pagination.mini'

  //prevID pour voir quel ID le chat précédent était
  let prevID=1;

  //ToPushAllData pour push dans allData (données de l'espèce)
  let toPushAllData=[];

  let currCatID=1;
  let maxID=1711;

  //i=pagniation
  for (let i=1; i<=18; i++) {
    //console.log("--------------------Page "+i+"/"+18+"--------------------");

    await page.waitForSelector(tableSelector)
    await page.waitForSelector(paginationSelector)

    let allRowsID=await page.$$eval(tableSelector+' td:not(.ant-table-fixed-columns-in-body) a',a=>a.map(a=>(a.href).split("/")[4]));
    
    //Index de la ligne pour chopper les infos de la ligne correspondante
    let rowIndex=1;

    let catEvoStateImg=1;
    
    //Loop de la page actuelle
    //currIDStrong pour les images plus tard
    for(let currIDString of allRowsID) {
      let currID=currIDString*1

      //localToPush vas être les données de la ligne, à ne pas confondre avec les données de l'éspèce
      let localToPush

      //Si ce n'est la même espèce que la précédente, alors push la data
      if(currID!=prevID) {
        //console.log(toPushAllData);
        catEvoStateImg=1;
        allData.push(toPushAllData)
        toPushAllData=[]
      }

      //Chopage des données de la ligne actuelle
      let col=await page.$$eval(tableSelector+' tr:nth-child('+rowIndex+') td',c=>c.map(c=>c.textContent))

      let traitsHandler
      try {
        traitsHandler=col[16].split(", ").map(el=>el.toLowerCase()).filter(v=>v.length>0)
      } catch(e) {console.log(e);}


      let abilitiesHandler
      try {
        abilitiesHandler=col[17].split("\n");
        //Les abilitées se séparent d'un \n
      } catch(e) {console.log(e);}

      let immune_to=[]
      let abilitiesTrait=[];
      let generalAbilities=[];

      try {
        for(let singleAbility of abilitiesHandler) {
          //Si ce sont les effets sur les traist ennemis

          if(singleAbility.match(/^Against/)) {

            let trueAbilities=getCleanPart(singleAbility)

            for(let indexAbility=0;indexAbility<trueAbilities.length;indexAbility++) {
              const el=trueAbilities[indexAbility]
              isUppercase(el) ? abilitiesTrait.push(el.toLowerCase()) : false
            }
          }

          //Si ce sont les abilitées générales
          else if(singleAbility.match(/^General/)) {

            let trueGeneralAbilities=getCleanPart(singleAbility)

            for(let indexAbility=0;indexAbility<trueGeneralAbilities.length;indexAbility++) {
              const el=trueGeneralAbilities[indexAbility]
              const next=trueGeneralAbilities[indexAbility+1]

              
              if(!el.match(/^Range/)) {
                if(isUppercase(el) && !el.endsWith(")")) {
                  //Si la prochaine abilitée est l'effective range, alors la prendre
                  if(next!=undefined && next.match(/^Effective/)) {
                    let nextSplited=next.split(")")[0]
                    let splitedRange=nextSplited.split("range ")[1]
                    let splitedEffective=splitedRange.split("~").join("-")
  
                    generalAbilities.push(el.toLowerCase()+"|"+splitedEffective)
                  } else {
                    generalAbilities.push(el.toLowerCase())
                  }
                }
              }
            }
          }
          
          //Si ce sont les immunitées
          else if(singleAbility.match(/^Not/)) {
            let trueImmune=getCleanPart(singleAbility)

            for(let indexAbility=0;indexAbility<trueImmune.length;indexAbility++) {
              const el=trueImmune[indexAbility]
              isUppercase(el) ? immune_to.push(el.toLowerCase()) : false
            }
          }
        }
      } catch(e) {console.log(e);}


      //console.log(generalAbilities);

      localToPush={
        name: col[1],

        evo: getEvoState(col[2]),
        rarity: getRarity(col[3]),
        level_stat :col[4]*1,

        stats: {
          hp: col[5]*1,
          dmg: col[6]*1,
          range: col[7]*1,
          kb: col[8]*1,
          speed: col[9]*1,
        },

        target: col[11],
        
        times: {
          tba: parseFloat(col[12]),
          anim_atk: parseFloat(col[13]),
          recharge: parseFloat(col[14])
        },

        cost: Number(col[15]),

        traits: traitsHandler,

        abilities_trait: abilitiesTrait,
        general_abilities: generalAbilities,
        immune_to: immune_to,
      }

      process.stdout.write("\r"+currCatID+" / "+maxID+" ("+Math.round((currCatID/maxID)*10000)/100+" %)");

      //Push de la ligne en cours dans ce qui doit être push pour l'éspèce
      toPushAllData.push(localToPush)
      prevID=currID
      rowIndex++

      //await delay(Math.floor(Math.random()*2000+100)-100)

      currCatID++
      catEvoStateImg++;
    }

    //await delay(2500)

    await page.click(paginationSelector+' .ant-pagination-next')
  }



  await fs.writeFileSync("data.json",JSON.stringify(allData,null,2))

  await browser.close()

})();

function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve,time)
  })
}

function getEvoState(str) {
  let evoDict={
    "Normal": 1,
    "Evolved": 2,
    "True": 3
  }

  try {
    return evoDict[str]
  } catch(e) {
    return str
  }
}

function getRarity(str) {
  let rarityDict={
    "Basic": 1,
    "Special": 2,
    "Rare": 3,
    "Super Rare": 4,
    "Uber Super Rare": 5,
    "Uber Rare": 5,
    "Legendary Rare": 6,
  }

  try {
    return rarityDict[str]
  } catch(e) {
    return str
  }

}

function isUppercase(str){
  return /^\p{Lu}/u.test(str);
}

function getCleanPart(str) {
  let splitedStr=str.split(": ").splice(1)
  let finalArr=splitedStr[0].split(" (").map((v,i,a)=>{return v.split(") ")}).flat().filter((v)=> (v!="\r" && v.length>2)).flat()
  return finalArr;
}