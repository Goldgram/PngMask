describe("pngMask Tests", function() {
  var imageElement;
  var url0 = "src/test-images/007.png";
  // var url1 = "src/test-images/063.png";
  // var url2 = "src/test-images/092.png";
  // var class1 = "pokemon"

  

  it("performance test 1", function(done) {
    imageElement = document.createElement("img");
    imageElement.src= url0;
    var elements = [imageElement];

    var testTimeStart = new Date();
    var testTimeEnd;
    new _PngMask(elements).then(function(result) {
      testTimeEnd = new Date();
      var timeTaken = testTimeEnd.getTime() - testTimeStart.getTime();
      expect(timeTaken).toBeLessThan(600);
      // other expects
      done();
    });
  });

  
  // beforeEach(function() {
  //   imageElement = document.createElement("img");
  //   imageElement.src= url0;
  //   imageElement.className = class1;
  //   document.body.appendChild(imageElement);
  // });

  // afterEach(function() {
  //   imageElement = null;
  //   imageElement1 = null;
  //   imageElement2 = null;
  // });
  // it("performance test byClass", function(done) {
  //   var testTimeStart = new Date();
  //   var testTimeEnd;
  //   new pngMaskByClass("pokemon").then(function(result) {
  //     testTimeEnd = new Date();
  //     var timeTaken = testTimeEnd.getTime() - testTimeStart.getTime();
  //     expect(timeTaken).toBeLessThan(1000);
  //     // other expects
  //     done();
  //   });
  // });

  // it("ByImageUrl (single)", function() {
  //   expect(true).toBe(true);
  // });
  // it("ByImageUrls (array)", function() {
  //   expect(true).toBe(true);
  // });

  // it("pngMaskById (single)", function() {
  //   expect(true).toBe(true);
  // });
  // it("pngMaskByClass (array)", function() {
  //   expect(true).toBe(true);
  // });
  // it("pngMaskByElement (single)", function() {
  //   expect(true).toBe(true);
  // });
  // it("pngMaskByElements (array)", function() {
  //   expect(true).toBe(true);
  // });
  // it("jQuery id (single)", function() {
  //   expect(true).toBe(true);
  // });
  // it("jQuery class (array)", function() {
  //   expect(true).toBe(true);
  // });
});
