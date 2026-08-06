doInclude ([
  include ("features/base_handler/index.js")
])

/**
 * Save dialog Graph handler.
 *
 */
function SavedDialogGraphImageHandler(app)
{
    BaseHandler.apply(this, arguments);
    this.message = "";
    this.imageName = "";
}

// inheritance.
SavedDialogGraphImageHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
SavedDialogGraphImageHandler.prototype.firstObject = null;
// Path
SavedDialogGraphImageHandler.prototype.pathObjects = null;
// Objects.
SavedDialogGraphImageHandler.prototype.objects    = null;

SavedDialogGraphImageHandler.prototype.showDialogCallback = function (imageExtension)
{
    var dialogButtons = {};

    dialogButtons[g_close] = function() {
        $( this ).dialog( "close" );
    };

    var fileLocation = "tmp/saved/" + this.imageName.substr(0, 2) + "/"+ this.imageName + "." + imageExtension

    document.getElementById("showSavedImageGraph").src     = "/" + fileLocation;
    document.getElementById("showSavedImageGraphRef").href = "/" + fileLocation;
    var imageUrl = window.location.protocol + "//" + window.location.host + "/" + fileLocation;
    var graphImageName = document.getElementById("GraphImageName");
    if (graphImageName) {
        graphImageName.value = imageUrl;
    }

    document.getElementById("SaveImageLinks").innerHTML =
    document.getElementById("SaveImageLinks").innerHTML.replace(/tmp\/saved\/([A-Za-z]*)\/([A-Za-z]*).png/g, fileLocation);

    var copyImageButton = document.getElementById('CopyGraphImageLink');
    if (copyImageButton) {
        copyImageButton.onclick = this.copyGraphImageLink.bind(this);
        this.setCopyImageButtonIcon('bi bi-copy');
    }

    $( "#saveImageDialog" ).dialog({
                              resizable: false,
                              height: "auto",
                              width:  "auto",
                              modal: true,
                              title: g_save_image_dialog,
                              buttons: dialogButtons,
                              dialogClass: 'EdgeDialog'
                              });

}

SavedDialogGraphImageHandler.prototype.showWorkspace = function()
{
    var object = this;
    var callback = function() {
      object.showDialogCallback("png");
    };
    
    this.imageName = this.app.SaveGraphImageOnDisk(callback);
}

SavedDialogGraphImageHandler.prototype.showFullgraph = function()
{
    var object = this;
    var callback = function() {
      object.showDialogCallback("png");
    };
    
    this.imageName = this.app.SaveFullGraphImageOnDisk(callback, false);
}

SavedDialogGraphImageHandler.prototype.showPrint = function()
{
    var object = this;
    var callback = function() {
      object.showDialogCallback("png");
    };
    
    this.imageName = this.app.SaveFullGraphImageOnDisk(callback, true);
}

SavedDialogGraphImageHandler.prototype.showSvg = function()
{
    var object = this;
    var callback = function() {
      object.showDialogCallback("svg");
    };
    
    this.imageName = this.app.SaveSVGGraphOnDisk(callback);
}

SavedDialogGraphImageHandler.prototype.copyGraphImageLink = function()
{
    var imageInput = document.getElementById('GraphImageName');
    if (!imageInput) {
        return;
    }

    var text = imageInput.value;
    if (!text) {
        return;
    }

    var self = this;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            self.setCopyImageButtonIcon('bi bi-check2-square');
        }, function() {
            self.fallbackCopyImageText(text);
        });
    } else {
        if (this.fallbackCopyImageText(text)) {
            this.setCopyImageButtonIcon('bi bi-check2-square');
        }
    }
};

SavedDialogGraphImageHandler.prototype.fallbackCopyImageText = function(text)
{
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();

    var successful = false;
    try {
        successful = document.execCommand('copy');
    } catch (err) {
        successful = false;
    }
    document.body.removeChild(textarea);
    if (successful) {
        this.setCopyImageButtonIcon('bi bi-check2-square');
    }
    return successful;
};

SavedDialogGraphImageHandler.prototype.setCopyImageButtonIcon = function(iconClass)
{
    var icon = document.querySelector('#CopyGraphImageLink span');
    if (icon) {
        icon.className = iconClass;
    }
};
