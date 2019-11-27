# PNG Mask

Creates a svg mask for png images, so that we can have actions only on the solid parts of the image.

The idea here came originally from playing around with SVG elements. Unlike a standard image where the element is defined by a box, an SVG `<path>` tag has an interesting property that the mouse events target the shapes that is defined. For example you could create SVG's that make up a Venn diagram and each individual path you make has it's own mouse events (click, hover etc.). This class is a basic algorithm that maps through the image based on opacity, and generates a path based on the defined shape of the image.

**Key Features:**
- Multiple paths
- Opacity threshold (alpha tolerance)
- Inner paths (cavities)
- Targeted searches (additionalSearchRows)
- Process multiple images together
- A debug mode
- Mask / Shadow (this show on top or underneath the image)
- Replace image with svg option (replaceImage)
- Adding attributes to elements (elementAttributes)

I also added support for using it with JQuery because at the time I was interested in how 3rd party functionality can be added as JQuery functions.

# Who's that Pokemon

Live example: [willbrennan.tech/png-mask/](https://willbrennan.tech/png-mask/)

I created this example page to highlight what the PNG Mask algorithm does. Taking a bit of inspiration from an old pokemon trope. I created a basic page that loads up a Pokemon PNG image, dynamically creates a SVG that gets layered on top of the image. The idea here is to highlight the image only when you hover inside the contours of the SVG. This also works for images that have multiple pieces and inner cavities.
