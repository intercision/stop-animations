
var screenShotId = 0;
var screenShotDiv = null;
var screenShotImg = null;
var screenShotTimeout = null;

function removeScreenShot() {
	if (screenShotDiv !== null) {

		// console.log('remove');

		screenShotDiv.parentNode.removeChild(screenShotDiv);

		screenShotDiv = null;
		screenShotImg = null;

		window.removeEventListener('scroll', updateScreenShot);
		window.removeEventListener('resize', updateScreenShot);

	}
}

function updateScreenShot() {

	// console.log('update');

	screenShotDiv.style.display = 'none'; // Can't remove as this will loose the on-scroll event handler

	screenShotId++;

	if (screenShotTimeout) {
		clearTimeout(screenShotTimeout);
	}
	screenShotTimeout = setTimeout(takeScreenShot, (0.07*1000)); // slight delay

}

function takeScreenShot() {

	chrome.extension.sendRequest({
			'action': 'screenShotRequest',
			'screenShotId': screenShotId
		});

}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

		if (request.action === 'screenShotResponse') {

			if (request.screenShotId != screenShotId) {
				// console.log('Skipped (' + request.screenShotId + ' != ' + screenShotId + ')');
				return false;
			}

			removeScreenShot();

			// console.log('apply');

			window.addEventListener('scroll', updateScreenShot);
			window.addEventListener('resize', updateScreenShot);

			var windowWidth = (document.compatMode !== 'BackCompat' ? document.documentElement.clientWidth : document.body.clientWidth);
			var windowHeight = (document.compatMode !== 'BackCompat' ? document.documentElement.clientHeight : document.body.clientHeight);

			screenShotImg = document.createElement('img');
			screenShotImg.src = request.screenShotUrl;
			screenShotImg.style.display = 'block';
			screenShotImg.style.maxWidth = 'none';
			screenShotImg.onclick = removeScreenShot;

			screenShotDiv = document.createElement('div');
			screenShotDiv.appendChild(screenShotImg);
			screenShotDiv.style.position = 'absolute';
			screenShotDiv.style.cursor = 'pointer';
			screenShotDiv.style.top = document.body.scrollTop + 'px';
			screenShotDiv.style.left = document.body.scrollLeft + 'px';
			screenShotDiv.style.width = windowWidth + 'px'; // Hide the scroll bar in screen-shot
			screenShotDiv.style.height = windowHeight + 'px';
			screenShotDiv.style.zIndex = 2147483647; // Always on top
			screenShotDiv.style.overflow = 'hidden';

			var bodyRef = document.getElementsByTagName('body');
			if (bodyRef[0]) {
				bodyRef[0].appendChild(screenShotDiv);
			}

		}

	});

function screenShotKeyPress(e) {
	if (e.keyCode === 27 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
		if (screenShotDiv !== null) {
			removeScreenShot();
		} else {
			takeScreenShot();
		}
	}
}

document.addEventListener('keydown', screenShotKeyPress, true);