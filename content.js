//TODO can you share constants?
const STORAGE_KEY = 'enabled';
const TRUE = "true"
const WORD_LIST = new Map();

WORD_LIST.set("example", "totally not example")

onload = function () {
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

		WORD_LIST.forEach((value, key) => {
			v = v.replaceAll(new RegExp(key, "ig"), value);
		})

		textNode.nodeValue = v;
	}
}