require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json());
app.use(cors());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origins","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-with,Content-Type,Accept,Authorization");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods","POST,PATCH,PUT,DELETE,GET");
        return res.status(200).json({})
    }
    next()
})

const mysql = require("mysql2");
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: process.env.SQL_PASSWORD,
  database: process.env.DATABASE,
});
app.get('/score',(req,res)=>{
    db.query(`SELECT highScores FROM scores WHERE id=1`,(err,score)=>{
        if(err) return res.sendStatus(404);
        if(score.length <= 0) return
        else{
            console.log(score[0].highScores)
            res.json({
                score:score[0].highScores
            })
        }

    })
})
app.post('/score',(req,res)=>{
    const score = req.body.score;
   
        db.query(`SELECT * FROM scores`,(err,result)=>{
            if(err) return res.sendStatus(404);
             else{
                console.log(result)
             if(result.length <= 0){
            
                    db.query(`INSERT INTO scores(highScores) VALUE(${score})`,(scoreErr,score)=>{
                    if(scoreErr) return res.sendStatus(404)
                
                    })
                } else{
        db.query(`SELECT highScores FROM scores WHERE id=1`,(error,response)=>{
            if(error) return res.sendStatus(404);
            else{
                console.log(response)
            if(score > response[0].highScores){
                
                db.query(`UPDATE scores SET highScores=${score} WHERE id=1`,
                (newScoreErr,newScore)=>{
                    if(newScoreErr) return res.sendStatus(404);
                    else{
                        res.json({win:'Congratulation you beat your old score'})
                    }
                })
            }
        }})
    }
   }
})})
        
            
       


app.listen(3001,()=>{
    console.log('server listening on port 3001')
})