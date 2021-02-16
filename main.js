const UNIQUE_HASH = "654dee9345b9"; //TODO: replace with provided unique hash
const ENDPOINT_URL = `http://${UNIQUE_HASH}.ngrok.io`

// Given the user clicks the add button for either resource
// Then the table data should refresh
// So that the new entry is immediately displayed

// Given the user clicks the add button for either resource
// When either submission field for that resource is blank
// Then don't add the entry and notify the user of the validation error
// So that empty rows of data cannot be saved

// Given the user clicks the header of a column of either resource
// Then the table should refresh displayed in ascending order of the respective column data
// So that the user can sort to find their entry more easily
//  (Bonus): ability to click on header a second time to display descending

const MONSTERS = "monsters";
const RESEARCHERS = "researchers";

document.addEventListener("DOMContentLoaded", function () {
  updateVisitorCount();

  let types = [RESEARCHERS, MONSTERS]
  types.forEach((type) => {
    getTableData(type).then((res) => {
      return res.json()
    }).then((data) => {
      populateTable(type, data);
    });
  });

  addResearcherBtn = document.querySelector("#add-researcher");
  addResearcherBtn.addEventListener("click", (e) => {
    addResearcher();
    document.querySelector("#first-name").value = null;
    document.querySelector("#last-name").value = null;
  });

  addMonsterBtn = document.querySelector("#add-monster");
  addMonsterBtn.addEventListener("click", (e) => {
    addMonster();
    document.querySelector("#monster-name").value = null;
    document.querySelector("#monster-codename").value = null;
  });
});


function updateVisitorCount() {
  fetch(`${ENDPOINT_URL}/visitors`)
    .then((res) => res.json())
    .then(data => {
      let dataPlus = data["count"] + 1;
      fetch(`${ENDPOINT_URL}/visitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "count": dataPlus })
      }).then((res) => {
        if (res.status === 201) {
          el = document.getElementById('counter');
          el.innerHTML = dataPlus;
        }
      })
    });
}


function getTableData(type) {
  return fetch(`${ENDPOINT_URL}/${type}`);
}


function populateTable(type, data) {
  if (type === RESEARCHERS) {
    html = researcherRowFactory(data)
  } else if (type === MONSTERS) {
    html = monsterRowFactory(data)
  }
  let divId = `${type}-data`;
  el = document.getElementById(divId)
  el.innerHTML = html;
}


// Given an array of researcher objects return html row
function researcherRowFactory(data) {
  let html = '';
  data.forEach((entity) => {
    let row = '<tr>'
    row += `<td>${entity['id']}</td>`;
    row += `<td>${entity['first_name']}</td>`;
    row += `<td>${entity['last_name']}</td>`;
    row += '</tr>';
    html += row;
  });
  return html
}


// Given an array monster objects return html row
function monsterRowFactory(data) {
  let html = '';
  data.forEach((entity) => {
    let row = '<tr>'
    row += `<td>${entity['id']}</td>`;
    row += `<td>${entity['name']}</td>`;
    row += `<td>${entity['codename']}</td>`;
    row += '</tr>';
    html += row;
  });
  return html
}


function addResource(type, data) {
  fetch(`${ENDPOINT_URL}/${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}


function addResearcher() {
  firstNameInput = document.querySelector("#first-name");
  lastNameInput = document.querySelector("#last-name");
  data = {
    "first_name": firstNameInput.value,
    "last_name": lastNameInput.value
  };
  addResource(RESEARCHERS, data);
}


function addMonster() {
  monsterNameInput = document.querySelector("#monster-name");
  monsterCodenameInput = document.querySelector("#monster-codename");
  data = {
    "name": monsterNameInput.value,
    "codename": monsterCodenameInput.value
  };
  addResource(MONSTERS, data);
}