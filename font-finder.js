/*
* This script will print out which font is being used for
* each text page in a Sketch document.
*/


// Initialize font and layer variables
function captureAllFonts(){
    var doc = context.document,
        page = {},
        artboards = [],
        layer = {}
        fontUsed = '',
        fontMap = {},
        fontArray = [];

    // Loop through all pages
    for (var i=0; i < doc.pages().count(); i++) {
        page = doc.pages().objectAtIndex(i);
        artboards = page.children();

        // Loop through all children of current page
        for (var j=0; j < artboards.count(); j++) {
            layer = artboards.objectAtIndex(j);

            // If text layer, save to map
            if(layer.class() == "MSTextLayer") {
                fontUsed = [layer fontPostscriptName];
                fontMap[fontUsed] = "1";
            }
        }
    }

    // Convert fontMap object to an array to populate select box
    for (var k in fontMap) {
        fontArray.push(k);
    }

    return fontArray;
};

function createSelect(msg, items, selectedItemIndex){
  selectedItemIndex = selectedItemIndex || 0;

  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,25));
  accessory.addItemsWithObjectValues(items);
  accessory.selectItemAtIndex(selectedItemIndex);

  var alert = NSAlert.alloc().init();
  alert.setMessageText(msg);
  alert.addButtonWithTitle('OK');
  alert.addButtonWithTitle('Cancel');
  alert.setAccessoryView(accessory);

  var responseCode = alert.runModal();
  var sel = accessory.indexOfSelectedItem();

  return [responseCode, items[sel]];
}

function alertMessage(msg) {
    var alert = NSAlert.alloc().init();
    alert.setMessageText(msg);
    alert.addButtonWithTitle('OK');

    var responseCode = alert.runModal();

    return responseCode;
}

function findTargetFont(targetFont) {
    var doc = context.document,
        page = {},
        artboards = [],
        artboardName = '',
        layer = {}
        fontUsed = '',
        layerName = '',
        instanceCount = 0;

    log("Scanning document for " + targetFont + "...\n" +
        "=============================================");

    for (var i = 0; i < doc.pages().count(); i++) {

        // Get the current page and its artboards
        page = doc.pages().objectAtIndex(i);
        artboards = page.children();

        // Loop through all children of the page
        for (var j = 0; j < artboards.count(); j++) {

            // Get the current layer
            layer = artboards.objectAtIndex(j);

            // Store the most recent artboard name
            if(layer.class() == "MSArtboardGroup") {
                artboardName = [layer name];
            }

            // Check if the layer is a text layer
            if(layer.class() == "MSTextLayer") {
                fontUsed = [layer fontPostscriptName];
                if (fontUsed == targetFont) {
                    layerName = [layer name];
                    log("[" + [page name] + " / " + artboardName + "]: " +
                        "\"" + layerName + "\" is using \'" + targetFont + "\'");
                    instanceCount++;
                }
            }
        }
    }

    log("=============================================");

    alertMessage("Scan completed successfully.\n\n" +
        "There are " + instanceCount + " occurrences of this font.\n");

    // TODO: Add script for easily replacing the target font
}

// Get target font from user
var targetFont = createSelect('Which font do you want to search for?', captureAllFonts(), 0);

// Begin font search
if (targetFont[0] == 1000) {
    findTargetFont(targetFont[1]);
} else {
    log('Search canceled.');
}