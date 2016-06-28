/**
 * PngMask Class
 */var PngMask=function(e,t){function s(e){return e.complete&&e.naturalHeight!==0}function o(e){var t=document.createElement("canvas");t.width=e.width;t.height=e.height;t.getContext("2d").drawImage(e,0,0,e.width,e.height);n.imageVars[e.src].canvasContext=t.getContext("2d")}function u(e,t){var r=n.imageVars[e.src].canvasContext.getImageData(t.x,t.y,1,1).data[3];return r>n.alphaTolerance}function a(e,t){switch(t){case"topLeft":return e.x+" "+e.y+" ";case"bottomLeft":return e.x+" "+(e.y+n.mappingTolerance)+" ";case"topRight":return e.x+n.mappingTolerance+" "+e.y+" ";case"bottomRight":return e.x+n.mappingTolerance+" "+(e.y+n.mappingTolerance)+" "}}function f(e,t){var i=r[t].x*n.mappingTolerance,s=r[t].y*n.mappingTolerance;return{x:e.x+i,y:e.y+s}}function l(e,t){n.imageVars[e.src].paths[n.imageVars[e.src].pathIndex]+=t}function c(e,t,r){var s,o=i[r],c=f(t,o.straight);if(!u(e,c))s=[t,o.rightCorner,o.rightString];else{var h=f(t,o.left);u(e,h)?s=[h,o.leftCorner,o.leftString]:s=[c,o.straightCorner,r]}var p=a(s[0],s[1]);if(p===n.imageVars[e.src].startingPath)return{status:"complete"};l(e,"L"+p);return{node:s[0],dir:s[2]}}function h(){var e="#",t="0123456789ABCDEF".split("");e+=t[t.length-1-Math.round(Math.random()*4)];for(var n=0;n<5;n++)e+=t[Math.floor(Math.random()*t.length)];return e}function p(e){var t=document.createElement("style");t.setAttribute("id","png-mask-style");t.type="text/css";var r="",i=document.createElementNS("http://www.w3.org/2000/svg","svg");for(var s=0;s<e.attributes.length;s++){var o=e.attributes[s].nodeName,u=e.attributes[s].nodeValue;o!=="src"&&i.setAttribute(o,u)}var a=i.getAttribute("class"),f="png-mask-svg";i.setAttribute("class",a?f+" "+a:f);i.setAttribute("width",e.width+"px");i.setAttribute("height",e.height+"px");r+=".png-mask-svg {pointer-events:none;}";i.setAttribute("viewBox","0 0 "+e.width+" "+e.height+"");i.setAttribute("xmlns","http://www.w3.org/2000/svg");var l=document.createElementNS("http://www.w3.org/2000/svg","image");l.setAttribute("class","png-mask-image");l.setAttribute("height",e.height);l.setAttribute("width",e.width);l.setAttribute("href",e.getAttribute("src"));l.setAttribute("x","0");l.setAttribute("y","0");r+=".png-mask-image {pointer-events:none;}";i.appendChild(l);var c="";for(var p=0;p<n.imageVars[e.src].paths.length;p++)c+=n.imageVars[e.src].paths[p]+"Z ";var d=document.createElementNS("http://www.w3.org/2000/svg","path");d.setAttribute("class","png-mask-path");d.setAttribute("d",c);if(n.debug.on){d.setAttribute("fill",h());d.setAttribute("fill-opacity",.75);r+=".png-mask-path:hover {fill-opacity:0.25;}"}else d.setAttribute("fill","transparent");r+=".png-mask-path {cursor:pointer;pointer-events:auto;}";i.appendChild(d);if(!document.getElementById("png-mask-style")){t.appendChild(document.createTextNode(r));document.head.appendChild(t)}return i}function d(e,t){for(var r=0;r<n.imageVars[e.src].paths.length;r++){var i=n.imageVars[e.src].paths[r];if(i.indexOf(t)>-1)return!0}return!1}function v(e){n.imageVars[e.src]={startingPath:"",pathIndex:0,paths:[]};o(e);var t=Math.floor(e.height/(n.searchTolerance+1));for(var r=1;r<=n.searchTolerance;r++){var i=r*t,s=!1,f={x:0,y:i};while(f.x<e.width){if(u(e,f)!==s){var h=f;s&&h.x--;var p=a(h,s?"topRight":"bottomLeft");if(!d(e,p)){n.imageVars[e.src].startingPath=p;n.imageVars[e.src].paths[n.imageVars[e.src].pathIndex]="M"+p;l(e,"L"+a(h,s?"bottomRight":"topLeft"));var v={node:h,dir:s?"down":"up"};while(v.status!=="complete")v=c(e,v.node,v.dir);n.imageVars[e.src].startingPath="";n.imageVars[e.src].pathIndex++}s=!s;if(!n.multiplePaths)break}f.x++}}return n.imageVars[e.src].paths.length>0}function m(e){return e instanceof HTMLImageElement}function g(e,t){return new Promise(function(r,i){setTimeout(function(){if(s(e)){if(!v(e))return i("image has no alpha above the tolerance: "+e);n.masksBySrc[e.src]=p(e);if(n.debug.on){n.debug.completeCount++;console.log(e.src+" mask calculated ("+n.debug.completeCount+" of "+Object.keys(n.masksBySrc).length+")")}return r(e.src)}return g(e,100)},t)})}var n=this,r=[{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0}],i={up:{left:0,leftCorner:"bottomLeft",leftString:"left",straight:1,straightCorner:"topLeft",rightCorner:"topRight",rightString:"right"},right:{left:2,leftCorner:"topLeft",leftString:"up",straight:3,straightCorner:"topRight",rightCorner:"bottomRight",rightString:"down"},down:{left:4,leftCorner:"topRight",leftString:"right",straight:5,straightCorner:"bottomRight",rightCorner:"bottomLeft",rightString:"left"},left:{left:6,leftCorner:"bottomRight",leftString:"down",straight:7,straightCorner:"bottomLeft",rightCorner:"topLeft",rightString:"up"}};this.multiplePaths=t&&t.multiplePaths||!1;this.mappingTolerance=t&&t.mappingTolerance||2;this.alphaTolerance=t&&t.alphaTolerance||80;this.searchTolerance=t&&t.searchTolerance||1;this.replaceImage=t&&t.replaceImage||!0;this.debug={on:t&&t.debug||!1,completeCount:0};this.imageVars={};this.masksBySrc={};var y=new Promise(function(t,r){var i=document.getElementsByClassName(e);if(!i.length)return r("cannot find class: "+e);var s=[];for(var o=0;o<i.length;o++){var u,a=i[o];if(!m(a))return r("element is not an image: "+a);a.src=a.getAttribute("src");if(!n.masksBySrc[a.src]){n.masksBySrc[a.src]={};u=g(a,0)}else u=new Promise(function(e){return e(a.src)});s.push(u)}return Promise.all(s).then(function(e){for(var r=i.length-1;r>=0;r--){var s=n.masksBySrc[e[r]].cloneNode(!0),o=i[r];i[r].parentNode.replaceChild(s,o)}return t(n.masksBySrc)},function(e){return r(e)})});n.debug.on&&y.then(function(e){console.log("Complete:");console.log(e)},function(e){console.log("Error: "+e)});return y},pngMaskByImage;