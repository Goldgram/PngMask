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

  this.mappingTolerance = options && options.mappingTolerance || 1;
  this.alphaTolerance = options && options.alphaTolerance || 80;
  this.replaceImage = options && options.replaceImage || true;
  this.imageVars = {};
  
  
  function imgLoaded(element) {
    return element.complete && element.naturalHeight !== 0;
  }

  function createCanvas(element) {
    var canvas = document.createElement('canvas');
    canvas.width = element.width;
    canvas.height = element.height;
    canvas.getContext("2d").drawImage(element, 0, 0, element.width, element.height);
    self.imageVars[element.src].canvas = canvas;
  }

  function isSolidNode(element, node) {
    var alpha = self.imageVars[element.src].canvas.getContext("2d").getImageData(node.x, node.y, 1, 1).data[3];
    return alpha > self.alphaTolerance;
  }

  function getCornerString(node, cornerString, startOfPath) {
    // switch (cornerString) {
    //   case "topLeft":
    //     return " "+node.x+","+node.y;
    //   case "bottomLeft":
    //     return " "+node.x+","+(node.y+self.mappingTolerance);
    //   case "topRight":
    //     return " "+(node.x+self.mappingTolerance)+","+node.y;
    //   case "bottomRight":
    //     return " "+(node.x+self.mappingTolerance)+","+(node.y+self.mappingTolerance);
    // }
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

  function renderPolygon(element) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", element.width+"px");
    svg.setAttribute("height", element.height+"px");
    svg.setAttribute("viewBox", "0 0 "+element.width+" "+element.height+"");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgimg = document.createElementNS("http://www.w3.org/2000/svg", "image");
    svgimg.setAttribute("class", "png-mask-image");
    svgimg.setAttribute("height", element.height);
    svgimg.setAttribute("width", element.width);
    svgimg.setAttribute("href", element.getAttribute("src"));
    svgimg.setAttribute("x", "0");
    svgimg.setAttribute("y", "0");
    svg.appendChild(svgimg);
    var pathD = "";
    for (var i = 0; i < self.imageVars[element.src].paths.length; i++) {
      pathD += self.imageVars[element.src].paths[i] + "Z ";
    }
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "png-mask");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "transparent");
    path.setAttribute("style", "cursor:pointer;");
    svg.appendChild(path);
    // add image attributes
    for (var i = 0; i < element.attributes.length; i++) {
      var key = element.attributes[i].nodeName;
      var value = element.attributes[i].nodeValue;
      if (key!=="src") {
        svg.setAttribute(key, value);
      }
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

  function createPolygon(element) {
    self.imageVars[element.src] = {
      startingPath: "",
      pathIndex: 0,
      paths: []
    };
    createCanvas(element);

    var inverse = false;
    var yAxis = Math.floor(element.height/2);
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
        // break;
      }
      horizontalNode.x++;
    }

    return renderPolygon(element);
  }

  // create promise for the resulted svg
  return new Promise(function(resolve, reject) {
    var elements = document.getElementsByClassName(className);
    if (!elements.length) {
      return reject("cannot find class: "+className);
    }
    var masksBySrc = {};
    var promiseArray = [];
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.src = element.getAttribute("src");
      if (!masksBySrc[element.src]) {
        promiseArray.push(new Promise(function(resolve, reject) {
          function waitForImageToLoad(element, timeout) {
            setTimeout(function(){
              if (imgLoaded(element)) {
                masksBySrc[element.src] = createPolygon(element);
                // console.log(element.src+" done!");
                return resolve(masksBySrc[element.src]);
              }
              waitForImageToLoad(element, 100);
            }, timeout);
          }
          waitForImageToLoad(element, 0);
        }));
      }
    }
    return Promise.all(promiseArray).then(function(values) {
      for (var i = elements.length-1; i >= 0; i--) {
        elements[i].parentNode.replaceChild(values[i], elements[i]);
      }
      return resolve(masksBySrc);
    });
  });
};