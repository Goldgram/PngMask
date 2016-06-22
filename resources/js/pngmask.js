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

  function getCornerString(node, cornerString) {
    switch (cornerString) {
      case "topLeft":
        return " "+node.x+","+node.y;
      case "bottomLeft":
        return " "+node.x+","+(node.y+self.mappingTolerance);
      case "topRight":
        return " "+(node.x+self.mappingTolerance)+","+node.y;
      case "bottomRight":
        return " "+(node.x+self.mappingTolerance)+","+(node.y+self.mappingTolerance);
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
    var newPath = getCornerString(results[0], results[1]);
    if (newPath === self.imageVars[element.src].startingPath) {
      self.imageVars[element.src].startingPath = "";
      self.imageVars[element.src].pathIndex++;
      return {status:"complete"};
    }
    addToImagePath(element, newPath);
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
    // add paths
    for (var i = 0; i < self.imageVars[element.src].paths.length; i++) {
      var path = self.imageVars[element.src].paths[i];
      var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("class", "png-mask");
      polygon.setAttribute("points", path);
      polygon.setAttribute("fill", "transparent");
      polygon.setAttribute("style", "cursor:pointer;");
      svg.appendChild(polygon);
    }
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

  function createPolygon(element) {
    self.imageVars[element.src] = {
      startingPath: "",
      pathIndex: 0,
      paths: []
    };
    createCanvas(element);






    var halfHeight = Math.floor(element.height/2);
    var startingNode = {x:0, y:halfHeight};
    while (startingNode.x < element.width) {
      if (isSolidNode(element, startingNode)) {
        var start = getCornerString(startingNode, "bottomLeft");
        self.imageVars[element.src].startingPath = start;
        self.imageVars[element.src].paths[self.imageVars[element.src].pathIndex] = start;
        addToImagePath(element, getCornerString(startingNode, "topLeft"));
        break;
      }
      startingNode.x++;
    }
    var results = {node:startingNode, dir:"up"};
    while (results.status !== "complete") {
      results = findNextNode(element, results.node, results.dir);
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