//Global Variables
var pattern = [];
var mode = "EASY";
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter;
var rpl = 0;
//Global Constants
const freqMap = {
    1: 261.6,
    2: 329.6,
    3: 392,
    4: 466.2
}
const btnMap = {
  1: "rd_button",
  2: "bl_button",
  3: "gn_button",
  4: "yw_button"
}
//variables for clue sequence
var clueHoldTime = 1000;
var cluePauseTime = 333;
var nextClueWaitTime = 1000;
//mode pattern function
function getRandomInt(max){
  return Math.floor(Math.random() * max);
}
//mode pattern function
function makePattern(mode){
    switch(mode){
        case "EASY":
            for (let i = 0; i < 4; i++){
                pattern[i] = (getRandomInt(4) + 1);
            }
            break;
        case "MEDIUM":
            for (let i = 0; i < 8; i++){
                pattern[i] = (getRandomInt(4) + 1);
            }
            clueHoldTime = 600;
            cluePauseTime = 333;
            break;
        case "HARD":
            for (let i = 0; i < 16; i++){
                pattern[i] = (getRandomInt(4) + 1);
            }
          clueHoldTime = 300;
          cluePauseTime = 111;
          break;
    }
}
//light and clear button
function lightButton(btn){
  document.getElementById(""+btnMap[btn]).classList.add("lit");
}
function clearButton(btn){
  document.getElementById(""+btnMap[btn]).classList.remove("lit");
}
// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
// Sound Synthesis Functions
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}
//play single clue function
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn)
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
//Vlue Sequence player
function playClueSequence(){
    let delay = nextClueWaitTime; //set delay to initial wait time
    for(let i=0;i<=(pattern.length-1);i++){ // for each clue that is revealed so far
      console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
      setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
      delay += clueHoldTime 
      delay += cluePauseTime;
    }
  }

//Guess Function
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  else{
    if(progress !== pattern.length){
      console.log("woroking")
      if (btn == pattern[progress]){
        if(progress == rpl){
          console.log("win");
          winGame();
        }else{progress++;}
      }
      else{
      loseGame();
      }
    }
  }
}
//Game Start Function
function startGame(){
  console.log("Working")
  document.getElementById("status").style.opacity = "0%";
  progress = 0;
  var mode = document.getElementById('mode');
  makePattern(mode.options[mode.selectedIndex].text);
  gamePlaying = true;
  rpl = pattern.length-1;
  document.getElementById("start_button").disabled = true;
  document.getElementById("stop_button").disabled = false;
  playClueSequence();
}
function stopGame(){
  gamePlaying = false;
  pattern = [];
  progress = 0;
  document.getElementById("start_button").disabled = false;
  document.getElementById("stop_button").disabled = true;
}
function winGame(){
  document.getElementById("status").textContent = "YOU WON!";
  document.getElementById("status").style.opacity = "100%";
  stopGame();
}
function loseGame(){
  document.getElementById("status").textContent = "YOU LOST!";
  document.getElementById("status").style.opacity = "100%";
  stopGame();
}