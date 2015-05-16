

var module = require('./module');

module.controller('WatchCtrl', function($scope, $http, $modal) {

  console.log("WATCH DAT TWERK");

  $( ".open-leaders" ).click(function() {
    $( ".twerkTeam" ).toggleClass( "closed" );
  });


  $scope.joinTwerk = function (size, msg) {
    var modalInstance = $modal.open({
      templateUrl: '/views/partials/join-twerk-modal.html',
      size: size,
      windowClass: 'join-twerk-modal'
    });
  }


  // var canvas = document.getElementById('myCanvas');
  // var context = canvas.getContext('2d');

  // function drawLine(x, y, z, m){
  //   var cX = x;// / 2 + y / 2;
  //   var cY = z;
  //   var mag = m * 10;

  //   context.beginPath();
  //   context.moveTo(400, 300);
  //   context.lineTo(400 + cX * mag, 300 + cY * mag);
  //   context.stroke();
  // }

  // var lp = 0.2;
  // var lpX = 0;
  // var lpY = 0;
  // var lpZ = 0;



  // var socket = io.connect(window.SERVER_URL);
  // socket.on('connect', function (data) {
  //   console.log("CONNECT RESPONSE");
  // });

  // socket.on('reply', function (data) {
  //   console.log("UPDATE RESPONSE", data);

  //   console.log(data);
  //   var vector = data.data.split(',');
  //   lpX = (vector[0] * (1-lp)) + (lpX * lp);
  //   lpY = (vector[1] * (1-lp)) + (lpY * lp);
  //   lpZ = (vector[2] * (1-lp)) + (lpZ * lp);
  //   context.clearRect ( 0 , 0 , canvas.width, canvas.height );
  //   context.strokeStyle = 'rgba(255, 0, 0, 0.6)';
  //   drawLine(vector[0],vector[1],vector[2],vector[6]);
  //   context.strokeStyle = '#0000ff';
  //   drawLine(vector[3],vector[4],vector[5],vector[6]);
  //   context.strokeStyle = '#00ff00';
  //   drawLine(lpX, lpY, lpZ, vector[6]);

  // });

  // var canvas = document.getElementById('myCanvas');
  // var context = canvas.getContext('2d');

  // function drawLine(x, y, z, m){
  //   var cX = -(x/Math.abs(x) * (Math.abs(x / 2) + Math.abs(y / 2)));
  //   var cY = z;
  //   var mag = m * 25;

  //   context.beginPath();
  //   context.lineWidth = 15;
  //   context.moveTo(400, 300);
  //   context.lineTo(400 + cX * mag, 300 + cY * mag);
  //   context.stroke();
  // }
  // var lp = 0.2;
  // var lpX = 0;
  // var lpY = 0;
  // var lpZ = 0;



  var players = [];

  var shouldersDistance = 0.5,
      upperArmLength = 0.4,
      lowerArmLength = 0.4,
      upperArmSize = 0.2,
      lowerArmSize = 0.2,
      neckLength = 0.1,
      headRadius = 0.25,
      upperBodyLength = 0.6,
      pelvisLength = 0.4,
      upperLegLength = 0.5,
      upperLegSize = 0.2,
      lowerLegSize = 0.2,
      lowerLegLength = 0.5;


    var OTHER =     Math.pow(2,1),
        BODYPARTS = Math.pow(2,2),
        GROUND =    Math.pow(2,3),
        OTHER =     Math.pow(2,4);

  var canvas, ctx, w, h, world, boxBody, planeBody;

  function makeBody(){
    var bodyPartShapes = [],
        bodyPartBody = {};
        bodyPartShape = {};

    var headShape =      new p2.Circle(headRadius),
        upperArmShape =  new p2.Rectangle(upperArmLength,upperArmSize),
        lowerArmShape =  new p2.Rectangle(lowerArmLength,lowerArmSize),
        upperBodyShape = new p2.Rectangle(shouldersDistance,upperBodyLength),
        pelvisShape =    new p2.Rectangle(shouldersDistance,pelvisLength),
        upperLegShape =  new p2.Rectangle(upperLegSize,upperLegLength),
        lowerLegShape =  new p2.Rectangle(lowerLegSize,lowerLegLength);

    bodyPartShape.head = headShape;
    bodyPartShape.upperArm = upperArmShape;
    bodyPartShape.lowerArm = lowerArmShape;
    bodyPartShape.upperBody = upperBodyShape;
    bodyPartShape.pelvis = pelvisShape;
    bodyPartShape.upperLeg = upperLegShape;
    bodyPartShape.lowerLeg = lowerLegShape;

    bodyPartShapes.push(headShape,
                        upperArmShape,
                        lowerArmShape,
                        upperBodyShape,
                        pelvisShape,
                        upperLegShape,
                        lowerLegShape);

    for(var i=0; i<bodyPartShapes.length; i++){
        var s = bodyPartShapes[i];
        s.collisionGroup = BODYPARTS;
        s.collisionMask =  GROUND|OTHER;
    }


    // Lower legs
    var lowerLeftLeg = bodyPartBody.lowerLeftLeg = new p2.Body({
        mass: 1,
        position: [-shouldersDistance/2,lowerLegLength / 2],
    });
    var lowerRightLeg = bodyPartBody.lowerRightLeg = new p2.Body({
        mass: 1,
        position: [shouldersDistance/2,lowerLegLength / 2],
    });
    lowerLeftLeg.addShape(lowerLegShape);
    lowerRightLeg.addShape(lowerLegShape);
    world.addBody(lowerLeftLeg);
    world.addBody(lowerRightLeg);

    // Upper legs
    var upperLeftLeg = bodyPartBody.upperLeftLeg = new p2.Body({
        mass: 1,
        position: [-shouldersDistance/2,lowerLeftLeg.position[1]+lowerLegLength/2+upperLegLength / 2],
    });
    var upperRightLeg = bodyPartBody.upperRightLeg = new p2.Body({
        mass: 1,
        position: [shouldersDistance/2,lowerRightLeg.position[1]+lowerLegLength/2+upperLegLength / 2],
    });
    upperLeftLeg.addShape(upperLegShape);
    upperRightLeg.addShape(upperLegShape);
    world.addBody(upperLeftLeg);
    world.addBody(upperRightLeg);

    // Pelvis
    var pelvis = bodyPartBody.pelvis = new p2.Body({
        mass: 1,
        position: [0, upperLeftLeg.position[1]+upperLegLength/2+pelvisLength/2],
    });
    pelvis.addShape(pelvisShape);
    world.addBody(pelvis);

    // Upper body
    var upperBody = bodyPartBody.upperBody = new p2.Body({
        mass: 1,
        position: [0,pelvis.position[1]+pelvisLength/2+upperBodyLength/2],
    });
    upperBody.addShape(upperBodyShape);
    world.addBody(upperBody);

    // Head
    var head = bodyPartBody.head = new p2.Body({
        mass: 1,
        position: [0,upperBody.position[1]+upperBodyLength/2+headRadius+neckLength],
    });
    head.addShape(headShape);
    world.addBody(head);

    // Upper arms
    var upperLeftArm = bodyPartBody.upperLeftArm = new p2.Body({
        mass: 1,
        position: [-shouldersDistance/2-upperArmLength/2, upperBody.position[1]+upperBodyLength/2],
    });
    var upperRightArm = bodyPartBody.upperRightArm = new p2.Body({
        mass: 1,
        position: [shouldersDistance/2+upperArmLength/2, upperBody.position[1]+upperBodyLength/2],
    });
    upperLeftArm.addShape(upperArmShape);
    upperRightArm.addShape(upperArmShape);
    world.addBody(upperLeftArm);
    world.addBody(upperRightArm);

    // lower arms
    var lowerLeftArm = bodyPartBody.lowerLeftArm = new p2.Body({
        mass: 1,
        position: [ upperLeftArm.position[0] - lowerArmLength/2 - upperArmLength/2,
                    upperLeftArm.position[1]],
    });
    var lowerRightArm = bodyPartBody.lowerRightArm = new p2.Body({
        mass: 1,
        position: [ upperRightArm.position[0] + lowerArmLength/2 + upperArmLength/2,
                    upperRightArm.position[1]],
    });
    lowerLeftArm.addShape(lowerArmShape);
    lowerRightArm.addShape(lowerArmShape);
    world.addBody(lowerLeftArm);
    world.addBody(lowerRightArm);


    // Neck joint
    var neckJoint = bodyPartBody.neckJoint = new p2.RevoluteConstraint(head, upperBody, {
        localPivotA: [0,-headRadius-neckLength/2],
        localPivotB: [0,upperBodyLength/2],
    });
    neckJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(neckJoint);

    // Knee joints
    var leftKneeJoint = bodyPartBody.leftKneeJoint = new p2.RevoluteConstraint(lowerLeftLeg, upperLeftLeg, {
        localPivotA: [0, lowerLegLength/2],
        localPivotB: [0,-upperLegLength/2],
    });
    var rightKneeJoint= bodyPartBody.rightKneeJoint = new p2.RevoluteConstraint(lowerRightLeg, upperRightLeg, {
        localPivotA: [0, lowerLegLength/2],
        localPivotB:[0,-upperLegLength/2],
    });
    leftKneeJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    rightKneeJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(leftKneeJoint);
    world.addConstraint(rightKneeJoint);

    // Hip joints
    var leftHipJoint = bodyPartBody.leftHipJoint = new p2.RevoluteConstraint(upperLeftLeg, pelvis, {
        localPivotA: [0, upperLegLength/2],
        localPivotB: [-shouldersDistance/2,-pelvisLength/2],
    });
    var rightHipJoint = bodyPartBody.rightHipJoint = new p2.RevoluteConstraint(upperRightLeg, pelvis, {
        localPivotA: [0, upperLegLength/2],
        localPivotB: [shouldersDistance/2,-pelvisLength/2],
    });
    leftHipJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    rightHipJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(leftHipJoint);
    world.addConstraint(rightHipJoint);

    // Spine
    var spineJoint = bodyPartBody.spineJoint = new p2.RevoluteConstraint(pelvis, upperBody, {
        localPivotA: [0,pelvisLength/2],
        localPivotB: [0,-upperBodyLength/2],
    });
    spineJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(spineJoint);

    // Shoulders
    var leftShoulder = bodyPartBody.leftShoulder = new p2.RevoluteConstraint(upperBody, upperLeftArm, {
        localPivotA:[-shouldersDistance/2, upperBodyLength/2],
        localPivotB:[upperArmLength/2,0],
    });
    var rightShoulder= bodyPartBody.rightShoulder = new p2.RevoluteConstraint(upperBody, upperRightArm, {
        localPivotA:[shouldersDistance/2,  upperBodyLength/2],
        localPivotB:[-upperArmLength/2,0],
    });
    leftShoulder.setLimits(-Math.PI / 3, Math.PI / 3);
    rightShoulder.setLimits(-Math.PI / 3, Math.PI / 3);
    world.addConstraint(leftShoulder);
    world.addConstraint(rightShoulder);

    // Elbow joint
    var leftElbowJoint = bodyPartBody.leftElbowJoint = new p2.RevoluteConstraint(lowerLeftArm, upperLeftArm, {
        localPivotA: [lowerArmLength/2, 0],
        localPivotB: [-upperArmLength/2,0],
    });
    var rightElbowJoint= bodyPartBody.rightElbowJoint = new p2.RevoluteConstraint(lowerRightArm, upperRightArm, {
        localPivotA:[-lowerArmLength/2,0],
        localPivotB:[upperArmLength/2,0],
    });
    leftElbowJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    rightElbowJoint.setLimits(-Math.PI / 8, Math.PI / 8);
    world.addConstraint(leftElbowJoint);
    world.addConstraint(rightElbowJoint);
    
    return {
      body: bodyPartBody, 
      shape: bodyPartShape
    };
  }

  function removeBody(ob) {
    var body = obj.body;
    for(var k in body) {
      if(body.hasOwnProperty(k)) {
        world.removeBody(body[k]);
      }
    }

    var shapes = obj.shape;
    for(var k in shapes) {
      if(shapes.hasOwnProperty(k)) {
        world.removeShape(shapes[k]);
      }
    }
  }
  

  function init(){
    // Init canvas
    canvas = document.getElementById("twrk");
    w = canvas.width;
    h = canvas.height;

    ctx = canvas.getContext("2d");
    ctx.lineWidth = 0.05;

    // Init p2.js
    world = new p2.World();

    // // Add a box
    // boxShape = new p2.Rectangle(2,1);
    // boxBody = new p2.Body({ mass:1, position:[0,3],angularVelocity:1 });
    // boxBody.addShape(boxShape);
    // world.addBody(boxBody);
    console.log(players);
    for(var i = 0; i < 1; i++)
      players.push(makeBody());
    // Add a plane
    // Create ground
    var planeShape = new p2.Plane();
    var plane = new p2.Body({
        position:[0,-1],
    });
    plane.addShape(planeShape);
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask =  BODYPARTS|OTHER;
    world.addBody(plane);

    console.log("INIT");
  }

  function drawCircle(shape, body){
    ctx.beginPath();
    var x = body.position[0],
        y = body.position[1];
    ctx.save();
    ctx.translate(x, y);        // Translate to the center of the box
    ctx.rotate(body.angle);  // Rotate to the box body frame
    ctx.arc(0, 0, shape.radius, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.restore();
  }

  function drawRect(shape, body){
    ctx.beginPath();
    var x = body.position[0],
        y = body.position[1];
    ctx.save();
    ctx.translate(x, y);        // Translate to the center of the box
    ctx.rotate(body.angle);  // Rotate to the box body frame
    ctx.rect(-shape.width/2, -shape.height/2, shape.width, shape.height);
    ctx.stroke();
    ctx.restore();
  }

// upperArm
// lowerArm
// upperBody
// pelvis
// upperLeg
// lowerLeg

  function drawBody(player){
    var bodies = player.body;
    var shapes = player.shape;
    // drawRect(shape, body);
    drawCircle(shapes.head, bodies.head);
    drawRect(shapes.upperArm, bodies.upperLeftArm);
    drawRect(shapes.lowerArm, bodies.lowerLeftArm);
    drawRect(shapes.upperLeg, bodies.upperLeftLeg);
    drawRect(shapes.lowerLeg, bodies.lowerLeftLeg);

    drawRect(shapes.upperBody, bodies.upperBody);
    drawRect(shapes.pelvis, bodies.pelvis);

    drawRect(shapes.upperArm, bodies.upperRightArm);
    drawRect(shapes.lowerArm, bodies.lowerRightArm);
    drawRect(shapes.upperLeg, bodies.upperRightLeg);
    drawRect(shapes.lowerLeg, bodies.lowerRightLeg);
    // var headShape =      new p2.Circle(headRadius),
    //     upperArmShape =  new p2.Rectangle(upperArmLength,upperArmSize),
    //     lowerArmShape =  new p2.Rectangle(lowerArmLength,lowerArmSize),
    //     upperBodyShape = new p2.Rectangle(shouldersDistance,upperBodyLength),
    //     pelvisShape =    new p2.Rectangle(shouldersDistance,pelvisLength),
    //     upperLegShape =  new p2.Rectangle(upperLegSize,upperLegLength),
    //     lowerLegShape =  new p2.Rectangle(lowerLegSize,lowerLegLength);
  }


  function drawPlane(){
    var y = planeBody.position[1];
    ctx.moveTo(-w, y);
    ctx.lineTo( w, y);
    ctx.stroke();
  }

  function render(){
    // Clear the canvas
    ctx.clearRect(0,0,w,h);

    // Transform the canvas
    // Note that we need to flip the y axis since Canvas pixel coordinates
    // goes from top to bottom, while physics does the opposite.
    ctx.save();
    ctx.translate(w/2, h/2);  // Translate to the center
    ctx.scale(50, -50);       // Zoom in and flip y axis
    for(var i = 0; i < 1; i++)
      drawBody(players[i]);
    // Draw all bodies
    // drawbox();
    // drawPlane();

    // Restore transform
    ctx.restore();
  }

  // Animation loop
  function animate(){
    requestAnimationFrame(animate);
    // Move physics bodies forward in time
    world.step(1/60);
    // Render scene
    render();
  }

  init();
  animate();
});
