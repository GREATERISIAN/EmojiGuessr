chrome.browserAction.setBadgeText({ text: "NOPE" });
chrome.browserAction.setBadgeBackgroundColor({ color: "#4125dd" });
let reloads_holder = {};

const YEP = "YEP";
const NOPE = "NOPE";


// Main auto-reload function
chrome.storage.onChanged.addListener((whatChanged, area) => {
	if (area === "local") {
		const currentKey = Object.keys(whatChanged)[0];
		const currentVal = whatChanged[currentKey].newValue;

		if (typeof currentVal.active === "boolean") {
			if (currentVal.active) {
				// Start reloading current tab
				const reloadInterval =
					currentVal.unit === "min"
						? currentVal.input * 60 * 1000
						: currentVal.input * 1000;

				reloads_holder[currentKey] = setInterval(() => {
					chrome.tabs.reload(parseInt(currentKey));
				}, reloadInterval);
			} else {
				// Stop reloading
				clearInterval(reloads_holder[currentKey]);
			}
		}
	}
});

// Update badge text
chrome.tabs.onActivated.addListener(() => {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		let tab = tabs[0];

		chrome.storage.local.get(tab.id.toString(), (items) => {
			if (items[tab.id] && items[tab.id].active) {
				chrome.browserAction.setBadgeText({ text: YEP });
			} else {
				chrome.browserAction.setBadgeText({ text: NOPE });
			}
		});
	});
});

// Catch tab removed and remove the related reloader
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
	clearInterval(reloads_holder[tabId]);
});