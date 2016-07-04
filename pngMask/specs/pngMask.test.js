describe("pngMask Tests", function() {
  var imageElement;
  var url = "";
  
  beforeEach(function() {
    imageElement = document.createElement("img");
    imageElement.src= url;
  });

  afterEach(function() {
    imageElement = null;
  });

  
  it("performance test 1", function() {
    // var promise = new pngMaskByClass("pokemon");
    
    expect(true).toBe(true);
  });

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
