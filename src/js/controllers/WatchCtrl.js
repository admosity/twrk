

var module = require('./module');

module.controller('WatchCtrl', function($scope, $http, $modal) {

  console.log("WATCH DAT TWERK");
  $('.scroll-link2').hide();

  $('.scroll-link').click(function(){
    $('html, body').animate({scrollTop:$(document).height()}, 'slow');

    $(this).hide();
    $('.scroll-link2').show();
    return false;
  });

  $('.scroll-link2').click(function(){

    $('body,html').animate({
      scrollTop: 0
    }, 800);


    $(this).hide();
    $('.scroll-link').show();

    return false;

  });



  $( ".open-leaders" ).click(function() {
    $( ".twerkTeam" ).toggleClass( "closed" );
  });

  setInterval(function(){
    // toggle the class every five second
    $('.watch-twerk').toggleClass('change1');
    setTimeout(function(){
      // toggle back after 1 second
      $('.watch-twerk').toggleClass('change2');
    },3000);
    setTimeout(function(){
      // toggle back after 1 second
      $('.watch-twerk').toggleClass('change3');
    },3000);

  },3000);


  $scope.joinTwerk = function (size, msg) {
    var modalInstance = $modal.open({
      templateUrl: '/views/partials/join-twerk-modal.html',
      size: size,
      windowClass: 'join-twerk-modal'
    });
  }

  var lp = 0.2;
  var lpX = 0;
  var lpY = 0;
  var lpZ = 0;
  var lpM = 0;
  var playerList = {};

  console.log(window.SERVER_URL);

  function addPlayer(data){
    if(playerList[data.user_id]) removeBody(playerList[data.user_id]);
    playerList[data.user_id] = makeBody();
    playerList[data.user_id].avatar = data.avatar;
    playerList[data.user_id].username = data.username;

  }

  var socket = io.connect(window.SERVER_URL);
  socket.on('joined', function (data) {
    if(data){
      addPlayer(data);
    }
  });

  socket.on('disconnect', function(){
    alert("You have been disconnected");
  });

  socket.on('scores', function (data){
    var users = data.users;
    users.sort(function(a, b){
      return b.score - a.score;
    });
    var currScores = [];
    for(var i = 0; i < users.length; i++){
      var player = users[i];

      var id = player.user_id;
      if(playerList[id]){
        currScores.push({
          score: parseInt(player.score * 100),
          user_id: player.user_id,
          avatar: playerList[id].avatar,
          username: playerList[id].username
        });
      }
    }
    $scope.$apply(function() {
      $scope.scores = currScores;
    });

  });

  socket.on('users', function (data){
    var users = data.users;
    for(var i = 0; i < users.length; i++){
      var player = users[i];
      addPlayer(player);
    }
  });

  socket.on('user disconnect', function (data) {
    console.log(playerList);
    if(data && playerList[data.user_id]){
      removeBody(playerList[data.user_id]);
      delete playerList[data.user_id];
    }

  });
//socket.emit('join', { username: "USERNAME", avatar: 5 });

  socket.on('reply', function (data) {
    if(playerList[data.user_id]){
      //console.log(data);
      var vector = data.data.split(',');
      lpX = (vector[0] * (1-lp)) + (lpX * lp);
      lpY = (vector[1] * (1-lp)) + (lpY * lp);
      lpZ = (vector[2] * (1-lp)) + (lpZ * lp);
      lpM = vector[6];
      impulse(playerList[data.user_id], [lpX * 70, lpZ * 110]);
    }
    // ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
    // ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
    // drawLine(vector[0],vector[1],vector[2],vector[6]);
    // ctx.strokeStyle = '#0000ff';
    // drawLine(vector[3],vector[4],vector[5],vector[6]);
    // ctx.strokeStyle = '#00ff00';
    // drawLine(lpX, lpY, lpZ, vector[6]);

  });

  function drawLine(x, y, z, m){
    //console.log(x, y, z, m);
    var cX = -(x/Math.abs(x) * (Math.abs(x / 2) + Math.abs(y / 2)));
    var cY = z;
    var mag = m * 25;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(400,400);
    ctx.lineTo(400 + cX * mag, 400 + cY * mag);
    ctx.stroke();
    ctx.lineWidth = 0.1;
  }

  var playerMap = {};

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
        s.collisionMask =  GROUND;
    }


    // Lower legs
    var lowerLeftLeg = bodyPartBody.lowerLeftLeg = new p2.Body({
        mass: 6,
        position: [-shouldersDistance/2,lowerLegLength / 2],
    });
    var lowerRightLeg = bodyPartBody.lowerRightLeg = new p2.Body({
        mass: 6,
        position: [shouldersDistance/2,lowerLegLength / 2],
    });
    lowerLeftLeg.addShape(lowerLegShape);
    lowerRightLeg.addShape(lowerLegShape);
    world.addBody(lowerLeftLeg);
    world.addBody(lowerRightLeg);

    // Upper legs
    var upperLeftLeg = bodyPartBody.upperLeftLeg = new p2.Body({
        mass: 3,
        position: [-shouldersDistance/2,lowerLeftLeg.position[1]+lowerLegLength/2+upperLegLength / 2],
    });
    var upperRightLeg = bodyPartBody.upperRightLeg = new p2.Body({
        mass: 3,
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
//DAHVBOOTY
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
    spineJoint.setLimits(-Math.PI / 3, Math.PI / 3);
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


    var constraintBody = new p2.Body();
    constraintBody.position[0] = 0;
    constraintBody.position[1] = 0;
    // Create a body for the cursor
    world.addBody(constraintBody);
    var springConstraint = new p2.RotationalSpring(constraintBody, pelvis, {
      worldPivot: [0.5,0.5],
      collideConnected:false
    });
    world.addSpring(springConstraint);

    //world.addConstraint(springConstraint);


    return {
      body: bodyPartBody,
      shape: bodyPartShape
    };
  }

  function removeBody(obj) {
    var body = obj.body;
    var shapes = obj.shape;
    for(var k in body) {
      if(body.hasOwnProperty(k)) {
        world.removeBody(body[k]);
      }
    }
  }

  function impulse(player, force){
    player.body.pelvis.velocity[0] = force[0];
    player.body.pelvis.velocity[1] = force[1];
//     var constraintBody = new p2.Body();
//     constraintBody.position[0] = 0;
//     constraintBody.position[1] = 0;
// player.body.pelvis.velocity[0] =  5;
//     // Create a body for the cursor
//     world.addBody(constraintBody);
//     var springConstraint = new p2.Spring(constraintBody, player.body.pelvis, {});
//     world.addSpring(springConstraint);

//     console.log("FUCK");

//     var revConstraint = new p2.RevoluteConstraint(constraintBody, player.body.pelvis, {
//               worldPivot: [1,1],
//               collideConnected:false
//             });
//     world.addConstraint(revConstraint);


    // var springConstraint = new p2.RotationalSpring(player.body.pelvis, constraintBody, {});
    // springConstraint.applyForce();

  //   // Convert the canvas coordinate to physics coordinates
  //   var position = getPhysicsCoord(event);

  //   // Check if the cursor is inside the box
  //   var hitBodies = world.hitTest(position, [boxBody]);

  //   if(hitBodies.length){

  //     // Move the mouse body to the cursor position
  //     mouseBody.position[0] = position[0];
  //     mouseBody.position[1] = position[1];

  //     // Create a RevoluteConstraint.
  //     // This constraint lets the bodies rotate around a common point
  //     mouseConstraint = new p2.RevoluteConstraint(mouseBody, boxBody, {
  //       worldPivot: position,
  //       collideConnected:false
  //     });
  //     world.addConstraint(mouseConstraint);
  //   }
  //   world.removeConstraint(mouseConstraint);
  //   mouseConstraint = null;
  // });
  }
  var addremovec = 0;
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

    // Add a plane
    // Create ground
    var planeShape = new p2.Plane();
    var plane = new p2.Body({
        position:[0,-3.7],
    });
    plane.addShape(planeShape);
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask =  BODYPARTS|OTHER;
    world.addBody(plane);

    // Add a plane
    // Create wall
    var planeShape = new p2.Plane();
    var plane = new p2.Body({
        angle: Math.PI/2,
        position:[6,0],
    });
    plane.addShape(planeShape);
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask =  BODYPARTS|OTHER;
    world.addBody(plane);

    // Add a plane
    // Create wall
    var planeShape = new p2.Plane();
    var plane = new p2.Body({
        angle: -Math.PI/2,
        position:[-6,0],
    });
    plane.addShape(planeShape);
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask =  BODYPARTS|OTHER;
    world.addBody(plane);

    // Add a plane
    // Create ceiling
    var planeShape = new p2.Plane();
    var plane = new p2.Body({
        position:[0,4.5],
        angle: Math.PI,
    });
    plane.addShape(planeShape);
    planeShape.collisionGroup = GROUND;
    planeShape.collisionMask =  BODYPARTS|OTHER;
    world.addBody(plane);

    console.log("INIT");
    $(window).resize();
    canvas.addEventListener('mousedown', function(event){
      //impulse(players[0]);
      // makeBody();
      // if(addremovec%2 == 0){
      //   console.log("REMOVE BODY");
      //   removeBody(players[0]);
      //   players[0] = null;
      // }else{
      //   players[0] = makeBody();
      // }
      // addremovec++;
    });
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

  function drawAvatar(shape, body, avatar){
    ctx.beginPath();
    var x = body.position[0],
        y = body.position[1];
    ctx.save();
    ctx.translate(x, y);        // Translate to the center of the box
    ctx.rotate(body.angle + Math.PI);  // Rotate to the box body frame
    //ctx.rect(-shape.width/2, -shape.height/2, shape.width, shape.height);
    var img=$("#avatar-"+avatar)[0];

    var ratio = img.width/img.height;
    // console.log(img);
    ctx.drawImage(img,-(ratio/2),-0.6,ratio,1);

    ctx.fillStyle = "#000000";
    ctx.fill();
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
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.lineWidth = 0.05;
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
    //drawCircle(shapes.head, bodies.head);

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

    drawAvatar(shapes.head, bodies.head, player.avatar);

    // ctx.translate(1,1);
    ctx.restore();
    ctx.scale(1, 1);
    ctx.font = "30px Roboto";
    ctx.fillStyle = "#FFFFFF";

    ctx.fillText(player.username, bodies.pelvis.position[0] * 90 + w/2 - ctx.measureText(player.username).width/2, -bodies.pelvis.position[1] * 90 + h/2 + 130);
    ctx.restore();
    ctx.save();
    ctx.translate(w/2, h/2);  // Translate to the center
    ctx.scale(90, -90);       // Zoom in and flip y axis
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
    ctx.scale(90, -90);       // Zoom in and flip y axis
    for(var player in playerList){
      if(playerList[player]){
        drawBody(playerList[player]);
      }
    }
    // Draw all bodies
    // drawbox();
    // drawPlane();

    // drawLine(lpX, lpY, lpZ, lpM);

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

  $(window).resize(function(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  });

  init();
  animate();
});
