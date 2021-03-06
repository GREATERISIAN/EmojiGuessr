//TODO can you share constants?
const STORAGE_KEY = 'enabled';
const TRUE = "true"

const url = chrome.runtime.getURL('translations.json');

let words;
let Strarray=[];
// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath,true);
	if (mimeType != null) {
		if (xmlhttp.overrideMimeType) {
			xmlhttp.overrideMimeType(mimeType);
		}
	}
	xmlhttp.onload = callback;
	xmlhttp.send();
}

let loadEvent = function () {

	chrome.storage.local.get(STORAGE_KEY, (val) => {
		let enabled = val[STORAGE_KEY];

		if (!enabled || enabled !== TRUE) {
			return;
		}

		walk(document.body);

		function walk(node)
		{
			// Basically identical, originally, to the 'Cloud to Butt' software
			let child, next;

			const tagName = node.tagName ? node.tagName.toLowerCase() : "";
			if (tagName === 'input' || tagName === 'textarea') {
				return;
			}
			if (node.classList && node.classList.contains('ace_editor')) {
				return;
			}

			switch ( node.nodeType )
			{
				case 1:  // Element
				case 9:  // Document
				case 11: // Document fragment
					child = node.firstChild;
					while ( child )
					{
						next = child.nextSibling;
						walk(child);
						child = next;
					}
					break;
					
				case 3: // Text node
					handleText(node);
					break;
			}
		}
	});



	function handleText(textNode)
	{
			
		
		let v = textNode.nodeValue;

		const james=v.split(" ", v.length);
		james.forEach(element =>  {
			if (element.toLowerCase()<="zzzz"&&element.toLowerCase()>="a"){
			var hasfound=false;
			
			element=element.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		for(let entry of Object.entries(words)){
			if(entry[0].toLowerCase()>=element.toLowerCase()&&!hasfound){
			
			hasfound=true;
				v = v.replaceAll(new RegExp("\\b" + element + "\\b", "ig"), entry[1]);
			}
			}
			}

		});
	
		
	for (let entry of Object.entries(words)) {
		v = v.replaceAll(new RegExp("\\b" + entry[0] + "\\b", "ig"), entry[1]);
	}
	

	
		textNode.nodeValue = v;
	}
}


// Load json file;
loadTextFileAjaxSync(url, "application/json", event => {
	// Parse json
	words = JSON.parse(event.target.responseText);

	if (document.readyState !== 'complete') {
		onload = loadEvent;
	} else {
		loadEvent()
	}
	

for(let entry of Object.entries(words)){
	Strarray.push(entry[0]);
}



});