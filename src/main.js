define(function(require, exports, module) {
  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var Modifier = require('famous/core/Modifier');
  var Transitionable = require('famous/transitions/Transitionable');
  var WallTransition = require('famous/transitions/WallTransition');

  var mainContext = Engine.createContext();
  
  //*******************************
  function getRandomColor() {
//       var letters = '0123456789ABCDEF'.split('');
//       var color = '#';
//       for (var i = 0; i < 6; i++ ) {
// 	  color += letters[Math.floor(Math.random() * 16)];
//       }
//       return color;
	var colors = [0,0,0];
	for (var i = 0; i < 3; i++ ) { 
	  colors[i] = Math.floor((Math.random() * 256));
	}
	var retval = 'rgba('+colors.join(',')+',0.2)';
	return retval;
  }  
  
  var transitionableModifier = new Modifier({
      transform: Transform.translate(0,-240,0)
  });

  Transitionable.registerMethod('wall', WallTransition);

  var transition = {
      method: 'wall',
      period: 1000,
      dampingRatio : 0,
      velocity: 0,
      restitution : 0.7 //how bouncy the wall is
  };
  
  var pageContext = mainContext.add(transitionableModifier);
  
  //************************************

  var surfaceCount = 16;
  var surfaceParams = function (j) {
      var addedAngles = (3.14 / surfaceCount) * j;
      return {
      size: [200, 200],
      properties: {
	  color: 'white',
	  textAlign: 'center',
	  content: 'Super Baloon',
	  borderRadius: '50%',
	  transform: 'rotateX('+addedAngles+') scale(1)',
	  backgroundColor: getRandomColor()
      }
    };
  };
  var initialTime = Date.now();
  var ModifierParams = function (j) {
      var addedAngles = (3.14 / surfaceCount) * j;
      return {
	  origin: [0.5, 0.5],
	  transform: function () {
	      return Transform.rotateY((0.0001 * (Date.now() - initialTime)) + addedAngles);
	  }
      };
  };
  var surfaceArray = [];
  for (var i = 0; i < surfaceCount; i++) {
      var surface = new Surface(surfaceParams(i));
      surface.on("click", function(){
	  transitionableModifier.setTransform(Transform.translate(0,0,0),transition);
      });
      surfaceArray.push(surface);
  }
  var stateModifierArray = [];
  for (var i = 0; i < surfaceCount; i++) {
      stateModifierArray.push(new Modifier(ModifierParams(i)));
  }

  for (var i = 0; i < surfaceCount; i++) {
      pageContext.add(stateModifierArray[i]).add(surfaceArray[i]);
  }

});
