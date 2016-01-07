/*
* This script will print out which font is being used for
* each text page in a Sketch document.
*/

// Initialize font and layer variables
var doc = context.document,
    fontUsed = '',
    layerName = '';

for (var i = 0; i < doc.pages().count(); i++) {
    var page = doc.pages().objectAtIndex(i),
        layers = page.children();

    // Loop through all children of the page

    for (var j = 0; j < layers.count(); j++) {

        // get the current layer

        var layer = layers.objectAtIndex(j);

        // Check if the layer is a text layer

        if(layer.class() == "MSTextLayer") {
            var fontUsed = [layer fontPostscriptName]
            var layerName = [layer name]
            log("\'" + layerName + "\'  >>>  " + fontUsed)
        }
    }
}