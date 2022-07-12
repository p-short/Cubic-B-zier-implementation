//declare empty array to store ControlPoint class instances
let points = [],
    centerW,
    centerH,
    w = window.innerWidth,
    h = window.innerHeight;

//constant variable for the radius of control points
const r = 10.5,
      offSet = 200 - r;

function setup() {
  //set up drawing context
  canvas = createCanvas(w, h);
  //store the center of the drawing context in variables
  centerW = width / 2;
  centerH = height / 2;

  //push 4 instances of ControlPoint into points array
  for (let i = 0; i < 4; i++) {
    points.push(new ControlPoint());
  }
}

function draw() {
  background(153, 169, 232);
  stroke(245, 240, 218);
  strokeWeight(1.2);

  //lines between control points
  for (let i = 0; i < points.length - 1; i++) {
    line(
      points[i].point.x,
      points[i].point.y,
      points[i + 1].point.x,
      points[i + 1].point.y
    );
  }

  fill(221, 165, 232);
  stroke(143, 115, 191);

  //control point handles
  for (let i = 0; i < points.length; i++) {
    points[i].drawPoint();
    points[i].checkMouseProx();
    points[i].movePoint();
  }

  //call function that draws the curve between all control points
  cubicBCurve(
    points[0].point,
    points[1].point,
    points[2].point,
    points[3].point
  );
}

//pass in each ControlPoints point object which holds each points x & y position
function cubicBCurve(p0, p1, p2, p3) {
  //save state
  push();
  stroke(0);
  noFill();
  strokeWeight(4);
  //begin curve
  beginShape();
  //begin shape and iterate from 0 - 1 with a step of 0.01
  for (let i = 0; i < 1; i += 0.01) {
    //store result of the cubic bezier curve formular in pFinal object
    let pFinal = {
      x:
        Math.pow(1 - i, 3) * p0.x +
        3 * Math.pow(1 - i, 2) * i * p1.x +
        3 * (1 - i) * Math.pow(i, 2) * p2.x +
        Math.pow(i, 3) * p3.x,

      y:
        Math.pow(1 - i, 3) * p0.y +
        3 * Math.pow(1 - i, 2) * i * p1.y +
        3 * (1 - i) * Math.pow(i, 2) * p2.y +
        Math.pow(i, 3) * p3.y,
    };
    //draw new vertex at every step of the for loop
    vertex(pFinal.x, pFinal.y);
  }
  //end curve
  endShape();
  //exit saved state
  pop();
}

class ControlPoint {
  constructor() {
    //boolean to alternate states if mouse is over control point or not
    this.mouseOver = false;
    //boolean state for if mouse is pressed and mouse over control point
    this.lock = false;
    //offsets for moving control points
    this.xOff = 0;
    this.yOff = 0;

    //when constuctor is called random points from the center of the drawing context are selected for each control point
    this.point = {
      x: random(centerW - offSet, centerW + offSet),
      y: random(centerH - offSet, centerH + offSet),
    };
  }

  //draw control points
  drawPoint() {
    ellipse(this.point.x, this.point.y, r * 2);
  }

  //check if mouse position is with control point radius
  checkMouseProx() {
    this.d = dist(mouseX, mouseY, this.point.x, this.point.y);
    this.mouseOver = this.d < r ? true : false;
  }

  //move position of control points when mouse is with its radius and mouse is pressed down
  movePoint() {
    if (mouseIsPressed && this.mouseOver) {
      this.point.x = mouseX - this.xOff;
      this.point.y = mouseY - this.yOff;
    }
  }
}

window.onresize = function () {
  // assigns new values for width and height variables
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.size(w, h);
};
