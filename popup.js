const active = document.getElementById('active');


// Save current window tab to Chrome storage
active.onchange = function(event) {


  // Turn YEP
  if (event.target.checked) {
	chrome.browserAction.setBadgeText({ text: "Goo"});
  // Turn NOPE
  } else {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.browserAction.setBadgeText({ text: "Gaa"});
    });

    activeLabel.innerHTML = NOPE;
    settingsContainer.classList.remove('disabled');
    chrome.action.setBadgeText({ text: NOPE });

  }
}


function activate(){
    title="Carrot";
}