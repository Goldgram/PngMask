/**
 * PngMask Class
 */
var PngMask = function(className, options) {
  var self = this;
  var directions = [
    {x:-1,y:-1},
    {x:0,y:-1},
    {x:1,y:-1},
    {x:1,y:0},
    {x:1,y:1},
    {x:0,y:1},
    {x:-1,y:1},
    {x:-1,y:0}
  ];
  var pathDirection = {
    "up": {left:0, leftCorner:"bottomLeft", leftString:"left", straight:1, straightCorner:"topLeft", rightCorner:"topRight", rightString:"right"},
    "right": {left:2, leftCorner:"topLeft", leftString:"up", straight:3, straightCorner:"topRight", rightCorner:"bottomRight", rightString:"down"},
    "down": {left:4, leftCorner:"topRight", leftString:"right", straight:5, straightCorner:"bottomRight", rightCorner:"bottomLeft", rightString:"left"},
    "left": {left:6, leftCorner:"bottomRight", leftString:"down", straight:7, straightCorner:"bottomLeft", rightCorner:"topLeft", rightString:"up"},
  };

  this.multiplePaths = options && options.multiplePaths || false;
  this.mappingTolerance = options && options.mappingTolerance || 2;
  this.alphaTolerance = options && options.alphaTolerance || 80;
  this.searchTolerance = options && options.searchTolerance || 1;
  this.replaceImage = options && options.replaceImage || true;
  this.debug = {
    on: (options && options.debug || false),
    completeCount: 0
  }
    
  this.imageVars = {};
  
  function imgLoaded(element) {
    return element.complete && element.naturalHeight !== 0;
  }

  function createCanvas(element) {
    var canvas = document.createElement("canvas");
    canvas.width = element.width;
    canvas.height = element.height;
    canvas.getContext("2d").drawImage(element, 0, 0, element.width, element.height);
    self.imageVars[element.src].canvasContext = canvas.getContext("2d");
  }

  function isSolidNode(element, node) {
    var alpha = self.imageVars[element.src].canvasContext.getImageData(node.x, node.y, 1, 1).data[3];
    return alpha > self.alphaTolerance;
  }

  function getCornerString(node, cornerString, startOfPath) {
    switch (cornerString) {
      case "topLeft":
        return node.x+" "+node.y+" ";
      case "bottomLeft":
        return node.x+" "+(node.y+self.mappingTolerance)+" ";
      case "topRight":
        return (node.x+self.mappingTolerance)+" "+node.y+" ";
      case "bottomRight":
        return (node.x+self.mappingTolerance)+" "+(node.y+self.mappingTolerance)+" ";
    }
  }

  function getSiblingNode(node, directionsId) {
    var dirX = directions[directionsId].x*self.mappingTolerance;
    var dirY = directions[directionsId].y*self.mappingTolerance;
    return {x:node.x+dirX, y:node.y+dirY};
  }

  function addToImagePath(element, pathString) {
    self.imageVars[element.src].paths[self.imageVars[element.src].pathIndex] += pathString;
  }

  function findNextNode(element, node, pathString) {
    var results;
    var dir = pathDirection[pathString];
    var leftNode = getSiblingNode(node, dir.left);

    var straightNode = getSiblingNode(node, dir.straight);
    if (!isSolidNode(element, straightNode)) {
      results = [node, dir.rightCorner, dir.rightString];
    } else {
      var leftNode = getSiblingNode(node, dir.left);
      if (!isSolidNode(element, leftNode)) {
        results = [straightNode, dir.straightCorner, pathString];
      } else {
        results = [leftNode, dir.leftCorner, dir.leftString];
      }
    }
    var newPath = getCornerString(results[0], results[1], false);
    if (newPath === self.imageVars[element.src].startingPath) {
      return {status:"complete"};
    }
    addToImagePath(element, "L"+newPath);
    return {node:results[0], dir:results[2]};
  }

  function generateRandomHexColor() {
    var string = "#";
    var colors = "0123456789ABCDEF".split("");
    string += colors[colors.length-1-Math.round(Math.random() * 4)];
    for (var i = 0; i < 5; i++) {
      string += colors[Math.floor((Math.random() * colors.length))];
    }
    return string;
  }

  function renderPaths(element) {
    var style = document.createElement("style");
    style.setAttribute("id", "png-mask-style");
    style.type = "text/css";
    var css = "";
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // add image attributes
    for (var i = 0; i < element.attributes.length; i++) {
      var key = element.attributes[i].nodeName;
      var value = element.attributes[i].nodeValue;
      if (key!=="src") {
        svg.setAttribute(key, value);
      } 
    }
    var oldSvgClass = svg.getAttribute("class");
    var newSvgClass = "png-mask-svg"; 
    svg.setAttribute("class", oldSvgClass ? newSvgClass+" "+oldSvgClass : newSvgClass);
    svg.setAttribute("width", element.width+"px");
    svg.setAttribute("height", element.height+"px");
    css += ".png-mask-svg {pointer-events:none;}"
    svg.setAttribute("viewBox", "0 0 "+element.width+" "+element.height+"");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgimg = document.createElementNS("http://www.w3.org/2000/svg", "image");
    svgimg.setAttribute("class", "png-mask-image");
    svgimg.setAttribute("height", element.height);
    svgimg.setAttribute("width", element.width);
    svgimg.setAttribute("href", element.getAttribute("src"));
    svgimg.setAttribute("x", "0");
    svgimg.setAttribute("y", "0");
    css += ".png-mask-image {pointer-events:none;}";
    svg.appendChild(svgimg);
    var pathD = "";
    for (var i = 0; i < self.imageVars[element.src].paths.length; i++) {
      pathD += self.imageVars[element.src].paths[i] + "Z ";
    }
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "png-mask-path");
    path.setAttribute("d", pathD);
    if (self.debug.on) {
      path.setAttribute("fill", generateRandomHexColor());
      path.setAttribute("fill-opacity", 0.75);
      css += ".png-mask-path:hover {fill-opacity:0.25;}";
    } else {
      path.setAttribute("fill", "transparent");
    }
    css += ".png-mask-path {cursor:pointer;pointer-events:auto;}";
    svg.appendChild(path);
    if (!document.getElementById("png-mask-style")) {
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }
    return svg;
  }

  function pathExists(element, startPoint) {
    var RemoveFirstLetter = startPoint.slice(1);
    for (var i = 0; i < self.imageVars[element.src].paths.length; i++) {
      var path = self.imageVars[element.src].paths[i]
      if (path.indexOf(startPoint) > -1) {
        return true;
      }
    }
    return false;
  }

  function createPath(element) {
    self.imageVars[element.src] = {
      startingPath: "",
      pathIndex: 0,
      paths: []
    };
    createCanvas(element);
    // search image
    var searchPitch = Math.floor(element.height/(self.searchTolerance+1));
    for (var i = 1; i <= self.searchTolerance; i++) {
      var yAxis = i*searchPitch;
      var inverse = false;
      var horizontalNode = {x:0, y:yAxis};
      while (horizontalNode.x < element.width) {
        if (isSolidNode(element, horizontalNode)!==inverse) {
          var startNode = horizontalNode;
          if (inverse) {
            startNode.x--;
          }
          var startPoint = getCornerString(startNode, (inverse ? "topRight" : "bottomLeft"), true);
          if (!pathExists(element, startPoint)) {
            self.imageVars[element.src].startingPath = startPoint;
            self.imageVars[element.src].paths[self.imageVars[element.src].pathIndex] = "M"+startPoint;
            addToImagePath(element, "L"+getCornerString(startNode, (inverse ? "bottomRight" : "topLeft"), false));
            
            var results = {node:startNode, dir:(inverse ? "down" : "up")};
            while (results.status !== "complete") {
              results = findNextNode(element, results.node, results.dir);
            }
            self.imageVars[element.src].startingPath = "";
            self.imageVars[element.src].pathIndex++;
          }
          
          inverse = !inverse;
          if (!self.multiplePaths) {
            break;
          }
        }
        horizontalNode.x++;
      }
    }
    return self.imageVars[element.src].paths.length > 0;
  }

  function isImage(element) {
    return element instanceof HTMLImageElement;
  }

  // create promise for the resulted svg
  var pngMask = new Promise(function(resolve, reject) {
    var elements = document.getElementsByClassName(className);
    if (!elements.length) {
      return reject("cannot find class: "+className);
    }

    var masksBySrc = {};
    var promiseArray = [];
    for (var i = 0; i < elements.length; i++) {
      var imagePromise;
      var element = elements[i];
      if (!isImage(element)) {
        return reject("element is not an image: "+element);
      }
      element.src = element.getAttribute("src");
      if (!masksBySrc[element.src]) {
        masksBySrc[element.src] = {};
        imagePromise = new Promise(function(resolve, reject) {
          function waitForImageToLoad(element, timeout) {
            setTimeout(function(){
              if (imgLoaded(element)) {
                if (!createPath(element)) {
                  return reject("image has no alpha above the tolerance: "+element);
                }
                masksBySrc[element.src] = renderPaths(element);
                if (self.debug.on) {
                  self.debug.completeCount++;
                  console.log(element.src+" mask calculated ("+self.debug.completeCount+" of "+Object.keys(masksBySrc).length+")");
                }
                return resolve(element.src);
              }
              waitForImageToLoad(element, 100);
            }, timeout);
          }
          waitForImageToLoad(element, 0);
        });
      } else {
        imagePromise = new Promise(function(resolve, reject) {
          return resolve(element.src);
        });
      }
      promiseArray.push(imagePromise);
    }
    return Promise.all(promiseArray).then(function(values) {
      for (var i = elements.length-1; i >= 0; i--) {
        var mask = masksBySrc[values[i]].cloneNode(true);
        var element = elements[i];
        elements[i].parentNode.replaceChild(mask, element);
      }
      return resolve(masksBySrc);
    });
  });
  // debug promise
  if (self.debug.on) {
    pngMask.then(function(data){
      console.log("Complete:");
      console.log(data);
    },function(error){
      console.log("Error: "+error);
    });
  }
  return pngMask;
};

var pngMaskByImage;