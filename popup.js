//TODO can you share constants?
const STORAGE_KEY = 'enabled';
const ON = "On";
const OFF = "Off";
const TRUE = "true"
const FALSE = "false"

const active = document.getElementById('active');

chrome.storage.local.get(STORAGE_KEY, (val) => {
    active.checked = val[STORAGE_KEY] ? val[STORAGE_KEY] === TRUE : false;
});

active.onchange = function() {
  if (active.checked) {
      //TODO do this right
      let val = {};
      val[STORAGE_KEY] = TRUE;
      chrome.storage.local.set(val)

      chrome.browserAction.setBadgeText({ text: ON });
  } else {
      let val = {};
      val[STORAGE_KEY] = FALSE;
      chrome.storage.local.set(val)

      chrome.browserAction.setBadgeText({ text: OFF });

  }
}