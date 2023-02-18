var flies = new Array();
var refreshInterval = 30; //數字越大 動得越慢//

$(document).ready(function() {

function init() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  // Auto size
  $('#container').width(WIDTH).height(HEIGHT);

  canvas = document.getElementById('glows');

  $(canvas).attr('width', WIDTH).attr('height',HEIGHT);

  con = canvas.getContext('2d');

  for(var i = 0; i < 100; i++) {
    flies[i] = new Circle();
    flies[i].reset();
  }
  setInterval(draw,refreshInterval);
}
  
function draw() {
    con.clearRect(0,0,WIDTH,HEIGHT);
    for(var i = 0; i < flies.length; i++) {
        flies[i].fade();
        flies[i].move();
        flies[i].draw();
    }
}

function Circle() { //ttl越大 縮放速度越慢//
    this.s = {ttl:5000, xmax:5, ymax:5, rmax:130, rt:5, xdef:960, ydef:540, xdrift:4, ydrift: 4, random:true, blink:true};

    this.reset = function() {
        this.x = (this.s.random ? WIDTH*Math.random() : this.s.xdef);
        this.y = (this.s.random ? HEIGHT*Math.random() : this.s.ydef);
        this.r = ((this.s.rmax-1)*Math.random()) + 1;
        this.dx = (Math.random()*this.s.xmax) * (Math.random() < .5 ? -1 : 1);
        this.dy = (Math.random()*this.s.ymax) * (Math.random() < .5 ? -1 : 1);
        this.hl = (this.s.ttl/refreshInterval)*(this.r/this.s.rmax);
        this.rt = Math.random()*this.hl;
        this.s.rt = Math.random()+1;
        this.stop = Math.random()*.2+.4;
        this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
        this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
    }

    this.fade = function() {
        this.rt += this.s.rt;
    }

    this.draw = function() {
        if(this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) this.s.rt = this.s.rt*-1;
        else if(this.rt >= this.hl) this.reset();
        var newo = 1-(this.rt/this.hl);
        newo = newo*0.35;
        con.beginPath();
        con.arc(this.x,this.y,this.r,0,Math.PI*2,true);
        con.closePath();
        var cr = this.r*newo;
        g = con.createRadialGradient(this.x,this.y,0,this.x,this.y,(cr <= 0 ? 1 : cr));
        g.addColorStop(0.0, 'rgba(254,226,162,1)');
        g.addColorStop(this.stop, 'rgba(255,241,209,'+(newo*.9)+')');
        g.addColorStop(1.0, 'rgba(250,199,120,0)');
        con.fillStyle = g;
        con.fill();
    }

    this.move = function() {
        this.x += (this.rt/this.hl)*this.dx;
        this.y += (this.rt/this.hl)*this.dy;
        if(this.x > WIDTH || this.x < 0) this.dx *= -1;
        if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
    }

    this.getX = function() { return this.x; }
    this.getY = function() { return this.y; }
}

init();
  
});