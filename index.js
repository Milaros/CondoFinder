const fetch = require("node-fetch")
const fs = require("fs")
const webhook = require("webhook-discord");
const Hook = new webhook.Webhook(process.env['lol'])
var randomHexColor = require('random-hex-color')

const data = require("./data.json")
const datapath = "./data.json"

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
    }
});
}

let currentPlaceId = 0
async function condoCheck() {
     fetch(`https://condogames.xyz/latestupload.json?cache=${Date.now()}`, {
    headers: {
        pragma: "no-cache",
        "cache-control": "no-cache"
    }
}).then((response) => response.json()).then(async (json) => {
        await jsonReader(datapath, async (err, ok) => {
            if (err) {
              console.log(err);
              return;
            }
            if (ok.id != json.placeId) { 
                if (json.placeId == undefined) {
                  return;
                }
                const jsonString = JSON.stringify({"id": json.placeId})
                fs.writeFile(datapath, jsonString, err => {if (err) {console.log('Error writing file', err)}})  
                const msg = new webhook.MessageBuilder()
                    .setName("ok")
                    .setFooter("Maded by mstudio45#5590 | New condo will be sended soon after update.")
                    .setTitle("Condo Game Found!")
                    .setColor("#3000FF")
                    .addField(
                        "Game Link:",
                        `https://roblox.com/games/${json.placeId}/`,
                        true
                    )
                    .setTime();
            
                await Hook.send(msg);  
               console.log("Condo was sent!")
            } 
        });
})
}

async function start() {
    setTimeout(async () => {
        await condoCheck();
        start();
     }, 10000);
}
condoCheck();

const express = require("express")
const noblox = require("noblox.js")
const pog = require('./fetch.js')
pog()
const app = express()
const port = 9000
app.use(express.json())
app.listen(port,() => console.log(`app online`))
app.post('/data', async (req, res) => {
    const body = req.body;
    if(!req.body.url){
       return res.send("when impostor is sus")
    }
    if(!req.body.serverName){
       return res.send("when impostor is sus")
    }
    if(!req.body.user){
       return res.send("when impostor is sus")
    }
    let log = body.url.split("/");
    const msg = new webhook.MessageBuilder()
        .setName(`Posted in ${req.body.serverName}`)
        .setFooter("Maded by mstudio45#5590")
        .setTitle("Condo Game Found!")
        .setColor(randomHexColor())
        .addField("Sent In:",`${req.body.serverName}`, true)
        .addField("Sent By:",`${req.body.user}`, true)
        .addField("Game Link:",`${req.body.url}`)
        .setTime();
    await Hook.send(msg).catch(err=>console.log("Error"))
    console.log("Condo was sent!")
});
start();