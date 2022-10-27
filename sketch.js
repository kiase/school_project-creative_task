let video;
let model;
let gate;
let utterance;
let voice = new p5.Speech();
let block = true;

function preload(){
  say('동작 준비중입니다. 잠시만 기다려주세요');
  model = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/CqgLmuIYo/');
  gate = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/Ct8OAvzFc/');
  sleep(7000).then(function(){
    say('준비가 끝났습니다. 카메라에 음료를 놓고 화면을 눌러주세요');
    sleep(2000).then(function(){
      block = false;
    });
  });
}

function dummy(){}

async function say(text) {
  voice.stop();
  utterance = text;
  await voice.speak(text);
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}

function setup() {
  createCanvas(displayWidth,displayHeight);
  video = createCapture(VIDEO);
  video.hide();
  video.size(displayWidth,displayHeight);
  model.classify(video, dummy);
  gate.classify(video, dummy);
}

function draw() {
  background(255);
  image(video, 0, 0);
  fill(0);
  textSize(30);
  textAlign(CENTER);
  text(utterance, width/2, height-40);
}

function mousePressed() {
  if(block!=true){
    gate.classify(video, gotResult);
  }
}

function gotResult(err, result){
  if(result[0].label=="False.False"){
    say('카메라에 음료가 보이지 않습니다. 다시 시도해주세요.');
  }
  else if(result[0].label=="True.False"){
    say('음료 식별이 불가능합니다. 방향을 맞추어 다시 시도해주세요');
  }
  else{
    model.classify(video, model_gotResult);
  }
}

function model_gotResult(err, result){
  console.log(result[0].label);
  say('이 음료는 '+result[0].label+'입니다.');
}