const express = require("express");// importerar express från node_modules
const cors = require("cors"); 
const fs = require("fs");
const _ = require("underscore");

const app = express();
app.use(express.json());
app.use(cors());



app.use(function(req, res, next) {//tillåt requests från alla origins
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get("/highscore", (req, res)=>{
    console.log("Get request received");
    const rawData = fs.readFileSync("./data/highscore.json")
    const highscore = JSON.parse(rawData); 
    const sortedHighscore = _.sortBy(highscore, player => -parseInt(player.score)); 
    console.log(highscore);
    console.log(sortedHighscore);
    res.send(sortedHighscore);
    
})


app.post("/highscore", (req, res)=>{
    const newPlayer = req.body;
    console.log(newPlayer);
    const rawData = fs.readFileSync("./data/highscore.json")
    const players =JSON.parse(rawData);
   
    if(players.length < 5){
        players.push(newPlayer)
        
    }else{
        let lowestHighScore = players[0].score;
        let lowestHighScoreIndex = 0;
        for(let i = 1; i < players.length; i++){
            if(players[i].score < lowestHighScore){
                lowestHighScore = players[i].score;
                lowestHighScoreIndex = i;
            }
        }
        if(newPlayer.score > lowestHighScore){
            players.splice(lowestHighScoreIndex, 1, newPlayer)
        }
       
    }
    const sortedHighscore = _.sortBy(players, player => -parseInt(player.score)); 
    fs.writeFileSync("./data/highscore.json", JSON.stringify(sortedHighscore));
   res.send(sortedHighscore);
})

let highscoreList = []
try{
    const rawData = fs.readFileSync("./data/highscore.json", "utf8");
    highscoreList =JSON.parse(rawData);

}catch(error){
    console.error('Error reading or parsing highscore.json:', error);
}
 
app.listen(3000, ()=>{
    console.log("listening on port 3000");
})