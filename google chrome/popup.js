const optionsTabs = document.getElementById("select")
const choicePicked = document.querySelector("#picked")
var checkbox = document.querySelector("#myCheck")
let mainTab = null;


queryTabs();

// get the tab from the current tab id
async function getTab(tabId) {
	if (tabId === null) return null;
	let tab = await chrome.tabs.get(parseInt(tabId));
	return tab;
}

//To check which tab did the user picked

optionsTabs.addEventListener('change', async (event) => {
	let newOptionId = event.target;
	mainTab = newOptionId.value;
	let myTab = await getTab(mainTab);
	checkbox.checked = false;
	chrome.storage.local.set({ status:"On" });
	chrome.storage.local.set({ choice: mainTab, choiceTitle: myTab.title });
})

// helper function that takes a tab and add it to current tab list
async function addNewOption(tab) {

	mainTab = await chrome.storage.local.get('choice');
	mainTab = mainTab['choice'];
	if (mainTab !== null)
		mainTab = parseInt(mainTab);

	let newOption = document.createElement('option');
	newOption.value = tab.id;
	newOption.text = tab.title;
	if (mainTab !== null && mainTab === tab.id) {
		newOption.selected = true;
	}
	optionsTabs.appendChild(newOption);

}

//check the current tabs and add them to the dropdown menu
async function queryTabs() {
	let muteButton = await chrome.storage.local.get('status');
	muteButton = muteButton['status'];
	if(muteButton=='Off'){
		checkbox.checked = true;
	}else{
		chrome.storage.local.set({ status:"On" });
		checkbox.checked = false;
		
	}
	optionsTabs.innerHTML = ''; // reset the dropdown menue
		chrome.tabs.query({})
			.then(async (tabs) => {

				//Adding a null value at the begining so the user could pick the tab even if it was the first tab.
				let newOption = document.createElement('option');
				newOption.value = "-Pick a tab-"
				newOption.text ="Select a tab:"


				optionsTabs.appendChild(newOption);
				for (let tab of tabs) { // loop over all the tabs
					addNewOption(tab);
				}
			});
	
}

//update the current tablist if a tab was added, removed, or changed by any mean.
chrome.tabs.onRemoved.addListener(
	() => {
		queryTabs();
	});
chrome.tabs.onCreated.addListener(
	() => {
		queryTabs()
	});
//get all the tabs

//Check if user wish to turn off the extension
checkbox.addEventListener('change', function() {

	//If checkbox is on 
	if (checkbox.checked == true) {
		chrome.storage.local.set({ status:"Off" });
	
		console.log("off popjs")
	} else {
		chrome.storage.local.set({ status:"On" });
		console.log("on popjs")
	}
  });
