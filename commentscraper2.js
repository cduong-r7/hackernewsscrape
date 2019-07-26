const puppeteer = require ("puppeteer"); 
const chalk = require ("chalk"); 
var fs = require("fs");
const error = chalk.bold.red; 
const success = chalk.keyword("green");  

( async () => {
    try{
        var browser = await puppeteer.launch({headless: false}); 
        var page = await browser.newPage();
        await page.goto('https://news.ycombinator.com/', {waitUntil: "networkidle2"}); 
        await page.waitForSelector('td.subtext');
        await page.waitForSelector('#hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td.subtext > a:nth-child(6)')

        var comments = await page.evaluate(() => {
            var nodeList = new Array();
            var n = 2
            for (i = 0; i<=30; i++){
                nodeList[i] = document.querySelector('#hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(' +n+ ') > td.subtext > a:nth-child(6)'); 
                n += 3; 
            }
            
            var dataArray = new Array(); 
            for (k =0; k<nodeList.length-1; k++){
                if (nodeList[k]== null || nodeList[k].innerText.trim()=="discuss"){
                    dataArray[k] = {
                        commentNumber: "null",
                        link: "null",
                    };
                }
                else {
                    dataArray[k] = {
                    counter: k, 
                    commentNumber: nodeList[k].innerText.trim(),
                    link: nodeList[k].getAttribute("href"),
                    };
                }
            }
            return dataArray;
        });

        fs.writeFile("commentList.json", JSON.stringify(comments), function(err) {
            if (err) throw err; 
            console.log("Saved!"); 
        });
        await browser.close();
        
    } catch (error){
        console.log('error', error); 
    }
}) (); 