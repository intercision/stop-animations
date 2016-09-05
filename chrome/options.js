var screenshotOptions = "with_every_scroll";

function loadOptions() {
	// var screenshotOptions = localStorage["screenshotOptions"];

	// load the button listener here
	document.getElementById('save').addEventListener('click',
    saveOptions);
	
	
	// valid colors are red, blue, green and yellow
	if (screenshotOptions == undefined || (favColor != "with_every_scroll" && favColor != "just_once")) {
		screenshotOptions = 'with_every_scroll';
	}

	var select = document.getElementById("screenshot");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
			if (child.value == screenshotOptions) {
			child.selected = "true";
			break;
		}
	}
}

function saveOptions() {
	var select = document.getElementById("screenshot");
	var selectedScreenshotOption = select.children[select.selectedIndex].value;
	
	// localStorage["screenshotOptions"] = selectedScreenshotOption;
	
	 newStoreOption(selectedScreenshotOption);
	
	// alert(selectedScreenshotOption);
}

function eraseOptions() {
	localStorage.removeItem("screenshotOptions");
	location.reload();
}

// new way to store prefs
function newStoreOption(screenshotOptions) {
    var key = "myKey",
        testPrefs = JSON.stringify({
            'val': screenshotOptions
        });
    var jsonfile = {};
    jsonfile[key] = testPrefs;
    chrome.storage.sync.set(jsonfile, function () {
        console.log('Saved', key, testPrefs);
    });

}



document.addEventListener('DOMContentLoaded', loadOptions);

	