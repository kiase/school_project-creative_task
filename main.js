let video;
let model;
let gate;
let utterance;
let worker;
let inp;
let lng='eng';
let drag=0;
let cc;
let CHAR_WHITELIST="1234567890.";
let rectangle;
let voice = new p5.Speech();
let block = true;
let ocrr=false;

function preload(){ //딥러닝모델, OCR 로드
  say('동작 준비중입니다. 잠시만 기다려주세요.');
  model = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/CqgLmuIYo/');
  gate = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/Ct8OAvzFc/');
  worker = Tesseract.createWorker();
  sleep(7000).then(function(){
    say('준비가 끝났습니다. 카메라에 음료를 놓고 화면을 눌러주세요.');
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
  cc = createCanvas(windowWidth,windowHeight);
  //카메라 불러오기
  var constraints = {
    audio: false,
    video: {
      facingMode: "environment"
    }
  };
  video = createCapture(constraints);
  video.hide();
  //딥러닝 모델을 브라우저에 캐싱
  model.classify(video, dummy);
  gate.classify(video, dummy);
  //OCR worker 로드
  worker.load()
    .then(()=>worker.loadLanguage(lng))
    .then(()=>worker.initialize(lng))
    .then(()=>worker.setParameters(
    {tessedit_char_whitelist: CHAR_WHITELIST,}
  ));
  sleep(1000).then(function(){rectangle = { left: width/2-width/5, top: (width * video.height / video.width)/2-(width * video.height / video.width)/5, 
                                           width: width/5*2, height: width * video.height / video.width/5*2 };});
}

/* OCR을 이용한 유통기한 읽어주기 (인식률 문제로 비활성화)
function mouseDragged() {
  drag +=1;
  ocrr=true;
  if (drag > 15) {
    rectangle = { left: width/2-width/5, top: (width * video.height / video.width)/2-(width * video.height / video.width)/5, 
                 width: width/5*2, height: width * video.height / video.width/5*2 };
    worker.recognize(cc.elt, {rectangle}).then(
      (arg)=>{console.log(arg.data.text);
              utterance = arg.data.text;});
    drag = 0;
    sleep(1000).then(function(){ocrr=false;});
  }
  console.log(drag);
}
function mouseReleased() {
  if(drag!=0){
    ocrr=false;
    drag=0;
  }
}
*/
//딥러닝 모델을 이용하여 사진 속 사물 감지
//오류를 줄이기 위해 음료가 보이는지, 식별이 가능한지 
//gate 모델로 판단 후, main 모델로 전송
function gotResult(err, result){
  if(result[0].label=="False.False"){
    say('카메라에 음료가 보이지 않습니다. 다시 시도해주세요.');
  }
  else if(result[0].label=="True.False"){
    say('음료 식별이 불가능합니다. 방향을 맞추어 다시 시도해주세요.');
  }
  else{
    model.classify(video, model_gotResult);
  }
}

//main 모델에서 감지한 결과를 TTS로 읽어주기
function model_gotResult(err, result){
  console.log(result[0].label);
  say('이 음료는 '+result[0].label+'입니다.');
}

function draw() { //페이지 화면 구성
  background(255);
  stroke('#0fff0f66')
  image(video, 0, 0, width, width * video.height / video.width);
  try{
  noFill();
  rect(rectangle.left,rectangle.top,rectangle.width,rectangle.height);}
  catch(e){}
  stroke('#c8c8ff');
  strokeWeight(30);
  rect(0, 0, width, width * video.height / video.width);
  fill(255);
  strokeWeight(0);
  rect(0, width * video.height / video.width, width, height);
  fill(0);
  strokeWeight(3);
  stroke('#ffffff');
  textSize(30);
  textAlign(CENTER);
  if(width * video.height / video.width+80 >= height){
    text(utterance, width/2, width * video.height / video.width-60);
  }
  else{
    text(utterance, width/2, width * video.height / video.width+60);
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

function mousePressed() {
  sleep(300).then(function(){
    if(block!=true&&ocrr!=true){
      block=true;
      gate.classify(video, gotResult);
      sleep(1000).then(function(){
          block = false;
      });
    }
  });
}
