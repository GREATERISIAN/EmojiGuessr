//TODO can you share constants?
const STORAGE_KEY = 'enabled';
const ON = "On";
const OFF = "Off";
const TRUE = "true"
const FALSE = "false"
chrome.browserAction.setBadgeText({ text: OFF });
chrome.browserAction.setBadgeBackgroundColor({ color: "#4125dd" });

chrome.storage.local.get(STORAGE_KEY, (val) => {
    chrome.browserAction.setBadgeText({ text: val[STORAGE_KEY] && val[STORAGE_KEY] === TRUE ? ON : OFF });
});