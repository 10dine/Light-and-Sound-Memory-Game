//Global Variables
var pattern = [];
var mode = "EASY";
var progress = 0;
var gamePlaying = false;
//Global Constants
const freqMap = {
    1: 261.6,
    2: 329.6,
    3: 392,
    4: 466.2
}
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
//functions
function makePattern(mode){
    switch(mode){
        case "EASY":
            for (let i = 0; i < 4; i++){
                pattern[i] = Math.random(4);
            }
            break;
        case "MEDIUM":
            for (let i = 0; i < 8; i++){
                pattern[i] = Math.random(4);
            }
            break;
        case "HARD":
            for (let i = 0; i < 16; i++){
                pattern[i] = Math.random(4);
            }
            break;
    }
}
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

//Vlue Sequence player
function playClueSequence(){
    context.resume()
    let delay = nextClueWaitTime; //set delay to initial wait time
    for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
      console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
      setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
      delay += clueHoldTime 
      delay += cluePauseTime;
    }
  }
//Game Start Function
function startgame(){
    progress = 0;
    var mode = document.getElementById('mode')
    makePattern(select.options[select.selectedIndex].text);
    gamePlaying = true;
    playClueSequence();
}