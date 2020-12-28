// global variables
var boxWidth = 50;
var boxNo = 0;
var labelNo = 0;
var arrow = () => 1;
var initialX = 0;
var initialY = 0;

// elements
var colourPicker = document.getElementById("selectColour");
var widthInput = document.getElementById("width");
var heightInput = document.getElementById("height");
var close = document.getElementById("close");
var open = document.getElementById("open");
var settings = document.getElementById("settings");
var head = document.getElementById("head");
var tail = document.getElementById("tail");
var text = document.getElementById("add-text");
var label = document.getElementById("add-label");
var headSelect = document.getElementById("headSelect");
var tailSelect = document.getElementById("tailSelect");
var mycanvas = document.getElementById("myCanvas");
var $canvas = $('#myCanvas');
var ctx = mycanvas.getContext("2d");

// initialise stuff
ctx.fillStyle = "#000000";
ctx.strokeStyle = "#000000";

updateCanvas();

// update height and width of canvas to match window
function updateCanvas() {
  var w = window.innerWidth - 25;
  var h = window.innerHeight - 25;
  widthInput.value = w;
  heightInput.value = h;
  changeSize();
}

close.addEventListener("click", closeSettings);

// close settings
function closeSettings() {
  close.style.visibility = "hidden";
  open.style.visibility = "visible";
  settings.style.display = "none";
  open.addEventListener("click", openSettings);
  close.removeEventListener("click", closeSettings);
}

// open settings
function openSettings() {
  open.style.visibility = "hidden";
  close.style.visibility = "visible";
  settings.style.display = "block";
  close.addEventListener("click", closeSettings);
  open.removeEventListener("click", openSettings);
}

// // change colour of canvas
// function changeColour() {
//   var colour = colourPicker.value;
//   mycanvas.style.backgroundColor = colour;
// }

// change size of canvas
function changeSize() {
  mycanvas.width = widthInput.value;
  mycanvas.height = heightInput.value;
  $canvas.drawLayers();
}

// Moving Arrows
function updateArrow(box) {
  var $arrow1 = $canvas.getLayer('arrow' + box + 'one');
  var $arrow2 = $canvas.getLayer('arrow' + box + 'two');
  var $box1 = $canvas.getLayer('box' + box + 'one');
  var $box2 = $canvas.getLayer('box' + box + 'two');

  if ($arrow1 != null) {
    $canvas.setLayer($arrow1.name, {
      x1: $box1.x, y1: $box1.y
    });
  }

  if ($arrow2 != null) {
    $canvas.setLayer($arrow2.name, {
      x1: $box2.x, y1: $box2.y
    });
  }

  $canvas.drawLayers();
}

// draw a simple pair
function drawBox(x1, y1, text1, text2) {
  const box = boxNo;

  $canvas.drawText({
    layer: true,
    name: 'text' + boxNo + 'one',
    groups: [boxNo],
    dragGroups: [boxNo],
    fillStyle: '#000',
    strokeWidth: 2,
    x: x1, y: y1,
    fontSize: '14pt',
    fontFamily: 'Verdana, sans-serif',
    text: text1 === null || text1 === arrow ? '' : text1,
  })
  .drawText({
    layer: true,
    name: 'text' + boxNo + 'two',
    groups: [boxNo],
    dragGroups: [boxNo],
    fillStyle: '#000',
    strokeWidth: 2,
    x: x1, y: y1,
    fontSize: '14pt',
    fontFamily: 'Verdana, sans-serif',
    text: text2 === null || text2 === arrow ? '' : text2,
  })

  let width1 = Math.max(boxWidth, $('canvas').measureText('text' + boxNo + 'one').width);
  let width2 = Math.max(boxWidth, $('canvas').measureText('text' + boxNo + 'two').width);
  
  $canvas.drawRect({
    layer: true,
    name: 'box' + boxNo + 'one',
    groups: [boxNo],
    dragGroups: [boxNo],
    strokeStyle: '#000',
    strokeWidth: 2,
    x: x1, y: y1,
    width: width1,
    height: boxWidth,
    updateDragX: function (layer, x) {
      return nearest(x, 20);
    },
    updateDragY: function (layer, y) {
      return nearest(y, 20);
    },
    dragstop: function(layer) {
      updateArrow(box);
    }
  })
  .drawRect({
    layer: true,
    name: 'box' + boxNo + 'two',
    groups: [boxNo],
    dragGroups: [boxNo],
    strokeStyle: '#000',
    strokeWidth: 2,
    x: x1, y: y1,
    width: width2,
    height: boxWidth,
    updateDragX: function (layer, x) {
      return nearest(x, 20);
    },
    updateDragY: function (layer, y) {
      return nearest(y, 20);
    },
    dragstop: function(layer) {
      updateArrow(box);
    }
  });

  $canvas.setLayer('text' + boxNo + 'two', {
    x: '+=' + (width1 + width2) / 2,
  })
  .setLayer('box' + boxNo + 'two', {
    x: '+=' + (width1 + width2) / 2,
  })
  .drawLayers();

  if (text1 === null) {
    'box' + boxNo + 'one'
    var $layer = $canvas.getLayer('box' + boxNo + 'one');
    var x = $layer.x;
    var y = $layer.y;
    var offset = width1 / 2;

    $canvas.drawLine({
      strokeStyle: '#000',
      strokeWidth: 2,
      groups: [boxNo],
      dragGroups: [boxNo],
      x1: x + offset, y1: y - offset,
      x2: x - offset, y2: y + offset,
    });
  }

  if (text2 === null) {
    'box' + boxNo + 'one'
    var $layer = $canvas.getLayer('box' + boxNo + 'two');
    var x = $layer.x;
    var y = $layer.y;
    var offset = width2 / 2;

    $canvas.drawLine({
      strokeStyle: '#000',
      strokeWidth: 2,
      groups: [boxNo],
      dragGroups: [boxNo],
      x1: x + offset, y1: y - offset,
      x2: x - offset, y2: y + offset,
    });
  }

  if (text1 === arrow) {
    var $layer = $canvas.getLayer('box' + boxNo + 'one');
    var x = $layer.x;
    var y = $layer.y;

    $canvas.drawLine({
      strokeStyle: '#000',
      name: 'arrow' + boxNo + 'one',
      draggable: true,
      strokeWidth: 2,
      endArrow: true,
      arrowRadius: 15,
      arrowAngle: 90,
      x1: x, y1: y,
      x2: x, y2: y + 50,
      dragstart: function(layer) {
        initialX = layer.x2;
        initialY = layer.y2;
      },
      updateDragX: function (layer, x) {
        $canvas.setLayer(layer.name, {
          x2: nearest(initialX + x, 10),
        });
        return 0;
      },
      updateDragY: function (layer, y) {
        $canvas.setLayer(layer.name, {
          y2: nearest(initialY + y, 10),
        });
        return 0;
      },
      dragstop: function(layer) {
        $canvas.drawLayers();
      }
    });
  }


  if (text2 === arrow) {
    var $layer = $canvas.getLayer('box' + boxNo + 'two');
    var x = $layer.x;
    var y = $layer.y;

    $canvas.drawLine({
      strokeStyle: '#000',
      name: 'arrow' + boxNo + 'two',
      draggable: true,
      strokeWidth: 2,
      endArrow: true,
      arrowRadius: 15,
      arrowAngle: 90,
      x1: x, y1: y,
      x2: x, y2: y + 50,
      dragstart: function(layer) {
        initialX = layer.x2;
        initialY = layer.y2;
      },
      updateDragX: function (layer, x) {
        $canvas.setLayer(layer.name, {
          x2: nearest(initialX + x, 10),
        });
        return 0;
      },
      updateDragY: function (layer, y) {
        $canvas.setLayer(layer.name, {
          y2: nearest(initialY + y, 10),
        });
        return 0;
      },
      dragstop: function(layer) {
        $canvas.drawLayers();
      }
    });
  }

  boxNo++;
}

// function to create pair
function createPair() {
  var headVal = headSelect.value;
  var tailVal = tailSelect.value;

  if (headVal === "empty"){
    headVal = "";
  } else if (headVal === "null") {
    headVal = null;
  } else if (headVal === "arrow") {
    headVal = arrow;
  } else {
    headVal = head.value;
  }

  if (tailVal === "empty"){
    tailVal = "";
  } else if (tailVal === "null") {
    tailVal = null;
  } else if (tailVal === "arrow") {
    tailVal = arrow;
  } else {
    tailVal = tail.value;
  }

  drawBox(100, 100, headVal, tailVal);
}

// find nearest point to snap to
function nearest(value, n) {
  return Math.round(value / n) * n;
}

// download canvas as image file
function downloadImage() {
  // var destinationCanvas = document.createElement("canvas");
  // destinationCanvas.width = mycanvas.width;
  // destinationCanvas.height = mycanvas.height;
  // destCtx = destinationCanvas.getContext('2d');
  // // destCtx.fillStyle = "#FFFFFF";
  // // destCtx.fillRect(0,0,mycanvas.width,mycanvas.height);
  // destCtx.drawImage(mycanvas, 0, 0);

  var dataURL = mycanvas.toDataURL();
  var a = document.createElement('a');
  a.href = dataURL;
  a.download = 'box-and-pointer.png';
  document.body.appendChild(a);
  a.click();
}

// Add text
function addText() {
  $canvas.drawText({
    draggable: true,
    fillStyle: '#000',
    strokeWidth: 2,
    x: 100, y: 100,
    fontSize: 18,
    fontFamily: 'Verdana, sans-serif',
    text: text.value,
    updateDragX: function (layer, x) {
      return nearest(x, 5);
    },
    updateDragY: function (layer, y) {
      return nearest(y, 5);
    },
  });
}

// Add label
function addLabel() {
  const x = 100;
  const y = 100;

  $canvas.drawText({
    draggable: true,
    groups: ['label' + labelNo],
    dragGroups: ['label' + labelNo],
    name: 'label' + labelNo,
    fillStyle: '#000',
    strokeWidth: 2,
    x: x, y: y,
    fontSize: 18,
    fontFamily: 'Verdana, sans-serif',
    text: label.value,
    updateDragX: function (layer, x) {
      return nearest(x, 5);
    },
    updateDragY: function (layer, y) {
      return nearest(y, 5);
    },
  });

  const width = $canvas.measureText('label' + labelNo).width /  2;

  $canvas.drawLine({
    strokeStyle: '#000',
    draggable: true,
    groups: ['label' + labelNo],
    dragGroups: ['label' + labelNo],
    strokeWidth: 2,
    endArrow: true,
    arrowRadius: 5,
    arrowAngle: 90,
    x1: x + width + 5, y1: y,
    x2: x + width + 25, y2: y,
  });

  labelNo++;
}

//let width1 = Math.max(boxWidth, $('canvas').measureText('text' + boxNo + 'one').width);