import React,{useState,useEffect} from 'react'
import ColorButton from '../color-button/ColorButton'
import axios from 'axios'
import './simonGame.css'
import { timeOut } from '../timeOutPromise'
const SimonGame = () => {

const [start, setStart] = useState(false)

const colors = ["red","green","blue","yellow"];

const [finalScore, setFinalScore] = useState(0)
const [highScore, setHighScore] = useState(0)
const [error, setError] = useState(false)






const gameStats = {
  startGame:false,
  colorsList:[],
  score:0,
  player:false,
  playerColors:[]

}
const [gameOn, setGameOn] = useState(gameStats)
const [clicked, setClicked] = useState('')
const begin = ()=>{
  setStart(true)
 
}


useEffect(()=>{
  axios.get('http://localhost:3001/score')
  .then(res=>{
    const data = res.data.score
    console.log(data)
    if(data){
      setHighScore(data)
    }else{
      setHighScore(gameOn.score)
    }
    
  }).catch(err=>
   { console.log(err)
    setError(true)}
  )
},[highScore])

useEffect(() => {
  if(start){
   setGameOn({...gameStats,startGame:true})
  }else{
    setGameOn(gameStats)
  }

 
}, [start])




useEffect(() => {  
if(start && gameOn.startGame){
 const newColor = colors[Math.floor(Math.random()*4)]


  const addColor = [...gameOn.colorsList];
  addColor.push(newColor)
  setGameOn({...gameOn,colorsList:addColor})
}


}, [start,gameOn.startGame])

useEffect(() => {
  if(start && gameOn.startGame && gameOn.colorsList.length){
       flashColors()
  }
}, [start,gameOn.startGame,gameOn.colorsList.length])





const flashColors = async ()=>{
 
  await timeOut(1000)
    for (let i = 0; i < gameOn.colorsList.length; i++) {
    await timeOut(1000)
      setClicked(gameOn.colorsList[i]) 
    await timeOut(1000)
      setClicked('')
    if(i === gameOn.colorsList.length - 1){
      const copyColors = [...gameOn.colorsList]
      setGameOn({
        ...gameOn,
        startGame:false,
        player:true,
        playerColors:copyColors.reverse()
      })

    }
  }  
 
 
}

const playerClicks =  async (color)=>{
    console.log(gameOn.playerColors)   
  if(!gameOn.startGame && gameOn.player){ 
    const copyUserColors = [...gameOn.playerColors];
    const lastColor = copyUserColors.pop();
   setClicked(color)
    console.log(lastColor)
    if(color === lastColor){
      if(copyUserColors.length){
        setGameOn({...gameOn,playerColors:copyUserColors})
      }else{
        await timeOut(1000)
          setGameOn({...gameOn,
            startGame:true,
          player:false,
          score:gameOn.colorsList.length,
          playerColors:[]
        })
      }
      }else{
        
         await timeOut(1000)
          setGameOn({...gameStats,score:gameOn.colorsList.length})
          setFinalScore(gameOn.colorsList.length) 
    }
    await timeOut(1000)
      setClicked('')
  }
}
 
const playAgain = ()=>{
  axios.post(`http://localhost:3001/score`,{
    score:finalScore
  }).then(setStart(false))
  .catch( err=>
   { console.log(err)
    setError(true)}
   
  )
  
}


  return (
    <div className='game'> 
      <h1>Simon Says Game</h1>
              <div className='gameBoard'>
               
        <div className="wrapper">
      {colors.map((color,i)=>{
       
        return( 
          
        <div key={i}>
        <ColorButton
           color={color}
           onClick={()=>playerClicks(color)}
           flash={clicked === color}
             />
            </div>)
      })}

        </div>
      {start && !gameOn.startGame && !gameOn.player && gameOn.score && (<div className='score'>you lost
        <button onClick={playAgain} className='score'>final score:{finalScore} play again?</button>
        
         </div>
      )}
       {!start && <button onClick={begin} className='score'>start</button>} 
       {start && (gameOn.startGame || gameOn.player) && <button  className='score'>{gameOn.score}</button>} 
        </div>
        <div className='score-bar'>
          <h2>Score: {gameOn.score}</h2>
          {error?<h2>connection error</h2>:<h2>HighScore: {highScore}</h2>}
        
        </div>
    </div>
  )
}

export default SimonGame