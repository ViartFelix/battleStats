import puppeteer from "puppeteer-extra"
import fs from "fs"
import {evaluate, index} from "mathjs"

import adblocker from "puppeteer-extra-plugin-adblocker"
import {DEFAULT_INTERCEPT_RESOLUTION_PRIORITY} from "puppeteer"

import util from "util"

//Utilisation du adblocker
puppeteer.use(adblocker({interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY}))

;(async () => {
  const browser=await puppeteer.launch({
    headless:true
  });

  const page=await browser.newPage();

  await page.setViewport({
    width:1920,
    height:1024
  });

  await page.goto('https://battle-cats.fandom.com/wiki/Cat_Dictionary');

  //Attente pour la fenêtre des cookies
  await page.waitForSelector('._1MLS_xjiUjam_u2qmURY4i')
  //Click sur "refuser" *chad*
  await page.click('.ctUA_BYxme4s8b2T66wjD.XHcr6qf5Sub2F2zBJ53S_')

  const cat_tab_selector='main.page__main div#content.page-content.ve-init-mw-desktopArticleTarget-targetContainer div#mw-content-text.mw-body-content.mw-content-ltr div.cat-dictionary'

  //Attente du tableau des chats
  await page.waitForSelector(cat_tab_selector)

  //Nouvelle page: page des single chats
  const singleCatPage=await browser.newPage();
  await singleCatPage.setViewport({
    width:1920,
    height:1024
  })

  //Attente des icônes des chats
  await page.waitForSelector(cat_tab_selector+' p span.cat-dictionary-icons a')
  //Chopage des liens des chats
  let __allCats__=await page.$$eval(cat_tab_selector+' p span.cat-dictionary-icons a',a=>a.map(a=>a.href))

  let allData=[];
  //Vidage du fichier des données
  await fs.writeFileSync("data.json",JSON.stringify(allData))


  let atkType=[];

  //Le tableau qui vas servir pour l'envoi de données au json des types des ennemis concernés
  let traits=[];
  let traitsTab=['red','floating','black','metal','angel','alien','zombie','aku','relic','traitless']

  let effects=[];

  let immune_to=[
    [],
    [],
    [],
  ];

  //Boucle des liens de chats
  //TODO: la remettre
  //for(let singleCatHref of __allCats__) {
    let toPush=[];
    //Arrivée sur la page du chat
    //await singleCatPage.goto(singleCatHref)
    //await singleCatPage.goto('https://battle-cats.fandom.com/wiki/Kasa_Jizo_(Uber_Rare_Cat)')
    //await singleCatPage.goto('https://battle-cats.fandom.com/wiki/Cat_(Normal_Cat)')
    //await singleCatPage.goto('https://battle-cats.fandom.com/wiki/Ancient_Egg:_N101_(Rare_Cat)')
    await singleCatPage.goto('https://battle-cats.fandom.com/wiki/Kasli_the_Bane_(Uber_Rare_Cat)')

    //Attente du tableau
    await singleCatPage.waitForSelector('.wds-is-current .stats-table')

    //Choppage du contenu du tableau
    let __allTab__=await singleCatPage.$$eval('.wds-is-current .stats-table tbody tr',c=>c.map(c=>c.textContent))
    let allInfos=[]

    //Variable level pour plus tard (niveau des stats de l'unitée)
    let level=[];

    let indexRow=0;
    //Index intéressants dans le tableau
    let interestIndex=[0,2,4,5,7,9,10,12,14]
    //Loop de toutes les lignes du tableau
    for(let singleRow of __allTab__) {

      //Si la ligne présente est intéressante (utile) alors on la garde
      if(interestIndex.includes(indexRow)) {
        //Tri des infos utiles
        allInfos.push(singleRow.split('\n').filter(v=>v.length>0))
      }

      //S'il il y a un niveau indiqué dans les rows
      if(indexRow==3 || indexRow==6 || indexRow==11) {
        //On filtre la ligne
        let currRow=singleRow.split('\n').filter(v=>v.length>0)
        //On enlève ce que je ne veux pas
        let splitedLvl=currRow[0].split('.')[1].split(')')[0]
        //finalSplited pour push à la fin
        let finalSplited

        try {
          //fonction de mathjs pour tranformer un string en opération de math
          finalSplited=evaluate(splitedLvl)
        } catch(e) {
          //Si ça ne marche pas, mettre le string
          finalSplited=splitedLvl
          console.log(e);
        }
        
        //Push vers ce qui m'intéresse
        level.push(finalSplited)
      }
      
      let atkTypeArrays=['single_target','area_attack','long_distance','omni_strike','multi-hit']
      let otherExclude=['behemoth','zombies']

      let immuneTab=['weaken','freeze','slow','knockback','waves','curse','toxic','warp','surge']

      let indexRowNum= {
        4:0,
        9:1,
        14:2
      }

      switch (indexRow) {
        case 4:
        case 9:
        case 14:
          let toPushAtk=[];

          let rowsAbilities=await singleCatPage.$$eval('.wds-is-current .stats-table tbody tr:nth-child('+(indexRow+1)+') a',a=>a.map(a=>a.textContent))

          for(let index=0;index<rowsAbilities.length;index++) {
            let singleContent=rowsAbilities[index];
            let next=rowsAbilities[index+1]

            let cleanCont=singleContent.toLowerCase().replaceAll(' ','_')

            //S'il y a un trait d'ennemis présent dans la desc
            if(traitsTab.includes(singleContent.toLowerCase()) && !otherExclude.includes(singleContent.toLowerCase())) {
              if(traits[indexRowNum[indexRow]]==undefined) {
                traits[indexRowNum[indexRow]]=[]
              }

              let nonMetalXpath=await singleCatPage.waitForXPath("//td[contains(.,'non-Metal')]")
              let allEnemiesXpath=await singleCatPage.waitForXPath("//p[contains(.,'all enemies')]")

              console.log(await singleCatPage.waitForXPath("//p[contains(.,'all enemies')]"));

              if(nonMetalXpath) {
                for(let singleElem of traitsTab) {
                  if(singleElem!='metal') {
                    traits[indexRowNum[indexRow]].push(singleElem.toLowerCase())
                  }
                }
              } else if(allEnemiesXpath) {
                for(let singleElem of traitsTab) {
                  traits[indexRowNum[indexRow]].push(singleElem.toLowerCase())
                }
              } else {
                traits[indexRowNum[indexRow]].push(singleContent.toLowerCase())
              }
              
            }
            
            //S'il y a un type d'atk présent dans la desc
            if(atkTypeArrays.includes(singleContent.toLowerCase().replaceAll(' ','_')) && !otherExclude.includes(singleContent.toLowerCase())) {
              toPushAtk.push(singleContent.toLowerCase().replaceAll(' ','_'))
            }

            let splitedImm=cleanCont.split("_")
            let immuneLocal=splitedImm[splitedImm.length-1]

            if(immuneTab.includes(immuneLocal) && !otherExclude.includes(singleContent.toLowerCase())) {              
              if(next!=undefined && !traitsTab.includes(next)) {
              } else {
                immune_to[indexRowNum[indexRow]].push(immuneLocal.toLowerCase())
              }
            }

            if(!otherExclude.includes(singleContent.toLowerCase()) && !atkTypeArrays.includes(singleContent.toLowerCase().replaceAll(' ','_')) && !traitsTab.includes(singleContent.toLowerCase()) && next!=undefined && !traitsTab.includes(next)) {
              if(effects[indexRowNum[indexRow]]==undefined) {
                effects[indexRowNum[indexRow]]=[]
              }

              effects[indexRowNum[indexRow]].push(cleanCont)
            }

            
          }

          atkType.push(toPushAtk)
          break;
      }

      indexRow++
    }

        
    
    //Push des données dans le tableau
    toPush.push(
      //1ère forme
      {
        name: allInfos[0][0],
        atk_types: atkType[0],
        immune: immune_to[0],

        stats: {
          target: await(()=>{return traits[0]==undefined ? [] : traits[0]})(),
          effect: await(()=>{return effects[0]==undefined ? [] : effects[0]})(),
          dmg: await(()=>{
            try {
              return cleanNum(allInfos[2][1].split('damage')[0])*1
            } catch(e) {console.log(e); return 0}
          })(),
          
          hp: await(()=>{
            try {
              return cleanNum(allInfos[2][0].split(" HP")[0])*1
            } catch(e) {console.log(e); return 0}
          })(),
          level_stat: level[0],

          range: await(()=>{
            try {
              return cleanNum(allInfos[1][2])*1
            } catch(e) {console.log(e); return 0}
          })()


        }
      }
    )
    console.log(util.inspect(toPush,true,500))

    //Entre chaque chapitre il y a une diff de 1.5x le cout

/*
    toPush.push(
      //2nde forme
      {
        name: allInfos[0],
        stats: {
          //TODO: séparer les 3 formes des arrays
          target: traits,
          effect: effects,
          dmg: await(()=>{
            try {
              return cleanNum(allInfos[2][1].split('damage')[0])
            } catch(e) {console.log(e)}
          })(),
          
          hp: await(()=>{
            try {
              return cleanNum(allInfos[2][0].split(" HP")[0])
            } catch(e) {console.log(e)}
          })(),
          levels: level[0]
        }
      }
    )

    if(level.length>2) {
      //autre toPush
    }
*/

    allData.push(toPush)

    console.log("-------------------------------------------------------------------------------------------------------------------");
  //}

  //Ecriture dans le fichier de data.json les données des arbres
  await fs.writeFileSync("data.json",JSON.stringify(allData,null,2))



  //await delay(10000);

  browser.close()

  


})()

function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve,time)
  })
}

function cleanNum(str) {
  return str.replaceAll(',','').replaceAll('.',',').replaceAll(' ','');
}