CanvasRenderingContext2D.prototype.getLight = function(cx, cy, size){
  var IMGdata = this.getImageData(cx - size / 2, cy - size / 2, size, size);
  var data = IMGdata.data;
  var count = 0;
  var light = 0;
  for(var y = 0; y < size; y++){
    for(var x = 0; x < size; x++){
      if(Math.sqrt(Math.sqrt(Math.pow(x - size / 2, 2) + Math.pow(y - size / 2, 2)) <= size / 2)){
        count++;
        light += data[(x + y * size) * 4] / 255 * (data[(x + y * size) * 4 + 1] + data[(x + y * size) * 4 + 2] + data[(x + y * size) * 4 + 3]) / 3;
        data[(x + y * size) * 4 + 0] = 255;
        data[(x + y * size) * 4 + 1] = 0;
        data[(x + y * size) * 4 + 2] = 0;
        data[(x + y * size) * 4 + 3] = 255;
      }
    }
  }
  this.putImageData(IMGdata, cx - size / 2, cy - size / 2);
  return light / count;
}

function fillCourse(){
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if(courseImgLoad){
      ctx.drawImage(courseImg, 0, 0, canvas.width - 1, canvas.height - 1);
  }
  /*ctx.strokeStyle = "#000";
  ctx.lineWidth = "20";
  ctx.arc(1000, 1000, 500, -90 * Math.PI / 180, -270 * Math.PI / 180, true);
  ctx.lineTo(2000, 1500);
  ctx.arc(2000, 1000, 500, 90 * Math.PI / 180, 270 * Math.PI / 180, true);
  ctx.lineTo(1000, 500);
  ctx.stroke();*/
}

var canvas;
var ctx;
var x = 1000;
var y = 500;
var ls = 0;
var rs = 0;
var s = 50;
var w = 50;
var d = 0;
var deg = 0;
courseImgLoad = false;
var courseImg = new Image();
courseImg.src = "./course.svg";

courseImg.addEventListener("load", function () {
    courseImgLoad = true;
}, false);

function drawCar(){
  var m;
  if(ls != rs){
    var k = w / (ls - rs);
    var l = (ls + rs) / 200 * s;
    var r = (ls + rs) / 2 * k;
    if(l == 0 || r == 0){
      l =  Math.max(ls, rs) / 200 * s;
      r = Math.max(ls, rs) / 2 * k;
      m = 0;
    }else{
      var d1 = l / (2 * Math.PI * r) * 360;
      var d2 = 90 - (180 - d1) / 2;
      m = Math.cos((90 - d2) / 180 * Math.PI) * r * 2;
      d += d2;
      d %= 360
    }
    deg += l / (2 * Math.PI * r) * 360;
    x += Math.cos(d / 180 * Math.PI) * m;
    y += Math.sin(d / 180 * Math.PI) * m;
  }else{
    m = ls / 100 * s;
    x += Math.cos(deg / 180 * Math.PI) * m;
    y += Math.sin(deg / 180 * Math.PI) * m;
  }
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2, true);
  ctx.fillStyle = "#00f";
  ctx.fill();
}

function main(){
  for(var i = 0; i < 1; i++){
    fillCourse();
    drawCar();
    var l = 100;
    var sense = ctx.getLight(x + Math.cos(d / 180 * Math.PI) * l, y + Math.sin(d / 180 * Math.PI) * l, 50);
    if(sense < 200){
      ls = 50;
      rs = 100;
    }else{
      ls = 100;
      rs = 50;
    }
  }
  //window.requestAnimationFrame(main);
}

window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    setInterval(main, 1);
}
