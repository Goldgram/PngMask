/**
 * PngMask Class
 */
var PngMask = function(elements, userOptions, overrideOptions) {
  var self = this;
  var directions = [
    {x: -1,y: -1},
    {x: 0,y: -1},
    {x: 1,y: -1},
    {x: 1,y: 0},
    {x: 1,y: 1},
    {x: 0,y: 1},
    {x: -1,y: 1},
    {x: -1,y: 0}
  ];
  var pathDirection = {
    "up": {left:0, leftCorner:"bottomLeft", leftString:"left", straight:1, straightCorner:"topLeft", rightCorner:"topRight", rightString:"right"},
    "right": {left:2, leftCorner:"topLeft", leftString:"up", straight:3, straightCorner:"topRight", rightCorner:"bottomRight", rightString:"down"},
    "down": {left:4, leftCorner:"topRight", leftString:"right", straight:5, straightCorner:"bottomRight", rightCorner:"bottomLeft", rightString:"left"},
    "left": {left:6, leftCorner:"bottomRight", leftString:"down", straight:7, straightCorner:"bottomLeft", rightCorner:"topLeft", rightString:"up"},
  };

  this.multiplePaths = userOptions && userOptions.multiplePaths || false;
  this.mappingTolerance = userOptions && userOptions.mappingTolerance || 2;
  this.alphaTolerance = userOptions && userOptions.alphaTolerance || 80;
  this.searchTolerance = userOptions && userOptions.searchTolerance || 1;
  this.elementAttributes = userOptions && userOptions.elementAttributes || {};
  if (userOptions && userOptions.replaceImage) {
    this.replaceImage = true;
  } else {
    this.replaceImage = overrideOptions && overrideOptions.replaceImage || false;
  }
  this.debug = {
    on: (userOptions && userOptions.debug || false),
    completeCount: 0
  };

  this.imageVars = {};
  this.masksBySrc = {};

  
  function imgLoaded(element) {
    return element.complete && element.naturalHeight !== 0;
  }

  function createCanvas(element) {
    var canvas = document.createElement("canvas");
    canvas.width = element.width;
    canvas.height = element.height;
    canvas.getContext("2d").drawImage(element, 0, 0, element.width, element.height);
    self.imageVars[element.relativeSrc].canvasContext = canvas.getContext("2d");
  }

  function isSolidNode(element, node) {
    var alpha = self.imageVars[element.relativeSrc].canvasContext.getImageData(node.x, node.y, 1, 1).data[3];
    return alpha > self.alphaTolerance;
  }

  function getCornerString(node, cornerString) {
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
    self.imageVars[element.relativeSrc].paths[self.imageVars[element.relativeSrc].pathIndex] += pathString;
  }

  function findNextNode(element, node, pathString) {
    var results;
    var dir = pathDirection[pathString];
    
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
    var newPath = getCornerString(results[0], results[1]);
    if (newPath === self.imageVars[element.relativeSrc].startingPath) {
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
    if (self.elementAttributes.class) {
      newSvgClass += " "+self.elementAttributes.class;
    }
    svg.setAttribute("class", oldSvgClass ? oldSvgClass+" "+newSvgClass : newSvgClass);

    svg.setAttribute("width", element.width+"px");
    svg.setAttribute("height", element.height+"px");
    css += ".png-mask-svg {pointer-events:none;}";
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
    for (var j = 0; j < self.imageVars[element.relativeSrc].paths.length; j++) {
      pathD += self.imageVars[element.relativeSrc].paths[j] + "Z ";
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
    for (var i = 0; i < self.imageVars[element.relativeSrc].paths.length; i++) {
      var path = self.imageVars[element.relativeSrc].paths[i];
      if (path.indexOf(startPoint) > -1) {
        return true;
      }
    }
    return false;
  }

  function createPath(element) {
    self.imageVars[element.relativeSrc] = {
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
          var startPoint = getCornerString(startNode, (inverse ? "topRight" : "bottomLeft"));
          if (!pathExists(element, startPoint)) {
            self.imageVars[element.relativeSrc].startingPath = startPoint;
            self.imageVars[element.relativeSrc].paths[self.imageVars[element.relativeSrc].pathIndex] = "M"+startPoint;
            addToImagePath(element, "L"+getCornerString(startNode, (inverse ? "bottomRight" : "topLeft")));
            
            var results = {node:startNode, dir:(inverse ? "down" : "up")};
            while (results.status !== "complete") {
              results = findNextNode(element, results.node, results.dir);
            }
            self.imageVars[element.relativeSrc].startingPath = "";
            self.imageVars[element.relativeSrc].pathIndex++;
          }
          
          inverse = !inverse;
          if (!self.multiplePaths) {
            break;
          }
        }
        horizontalNode.x++;
      }
    }
    return self.imageVars[element.relativeSrc].paths.length > 0;
  }

  function isImage(element) {
    return element instanceof HTMLImageElement;
  }

  function waitForImageToLoad(element, timeout) {
    return new Promise(function(resolve, reject) {
      setTimeout(function(){
        if (imgLoaded(element)) {
          if (!createPath(element)) {
            return reject("image has no alpha above the tolerance: "+element);
          }
          self.masksBySrc[element.relativeSrc] = renderPaths(element);
          if (self.debug.on) {
            self.debug.completeCount++;
            console.log(element.relativeSrc+" mask calculated ("+self.debug.completeCount+" of "+Object.keys(self.masksBySrc).length+")");
          }
          return resolve(element.relativeSrc);
        }
        return waitForImageToLoad(element, 100);
      }, timeout);
    });
  }

  // create promise for the resulted svg
  var pngMask = new Promise(function(resolve, reject) {
    var promiseArray = [];
    for (var i = 0; i < elements.length; i++) {
      var imagePromise;
      var element = elements[i];
      if (!isImage(element)) {
        return reject("element is not an image: "+element);
      }
      element.relativeSrc = element.getAttribute("src");
      if (!self.masksBySrc[element.relativeSrc]) {
        self.masksBySrc[element.relativeSrc] = {};
        imagePromise = waitForImageToLoad(element, 0);
      } else {
        imagePromise = new Promise(function(resolve) {
          return resolve(element.relativeSrc);
        });
      }
      promiseArray.push(imagePromise);
    }
    return Promise.all(promiseArray).then(function(values) {
      if (self.replaceImage) {
        for (var i = elements.length-1; i >= 0; i--) {
          var mask = self.masksBySrc[values[i]].cloneNode(true);
          var element = elements[i];
          elements[i].parentNode.replaceChild(mask, element);
        }
      }
      return resolve(self.masksBySrc);
    },function(error){
      return reject(error);
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

var pngMaskByImage = function(url, userOptions) {
  var img = document.createElement('img');
  img.src= url;
  var elements = [img];
  return new PngMask(elements, userOptions);
};

var pngMaskByClass = function(className, userOptions) {
  return new Promise(function(resolve, reject) {
    var elements = document.getElementsByClassName(className);
    if (!elements.length) {
      return reject("cannot find class: "+className);
    }
    return new PngMask(elements, userOptions, {replaceImage:true});
  });
};
