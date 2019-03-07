var myUl = document.getElementById("myDiv");
var myList = document.getElementById("myList");
var myInput = document.getElementById("myInput");
var myButton = document.getElementById("myButton");

myButton.onclick = () => search(myInput.value);

async function search(searchString) {
  myUl.innerHTML = "";

  let categories = "people planets films species vehicles starships".split(" ");

  categories.forEach(async function(category) {
    let results = await searchInCategory(category, searchString);
    if (results.length > 0) {
      let ul = document.createElement("ul");
      myUl.append(ul);

      let h3 = document.createElement("h3");
      h3.innerHTML = toTitleCase(category);
      ul.append(h3);

      results.forEach(result => {
        let li = document.createElement("a");
        ul.append(li);
        CreateLink(result.url, li);
      });
    }
  });
}

var progressMax = 1;
var progressNow = 1;
var lastUpdate = 1;

function updateProgressbar() {
  let bar = document.getElementsByClassName("progress-bar")[0];
  if (progressNow >= lastUpdate) {
    bar.style.width = (100 * progressNow) / progressMax + "%";
    lastUpdate = progressNow;
  }
  if (progressNow == progressMax && progressMax != 0) {
    bar.classList.remove("progress-bar-animated");
    bar.classList.remove("progress-bar-striped");
  }
}

async function doFetching(url) {
  let fetchResult = fetch(url);
  let response = await fetchResult;
  let jsonResponse = await response.json();
  return jsonResponse;
}

async function searchInCategory(category, searchParam) {
  let url = `https://swapi.co/api/${category}/?search=${searchParam}`;
  result = await doFetching(url);
  return result.results;
}

async function showInfo(json) {
  myUl.innerHTML = "";
  progressNow = 0;
  progressMax = 0;
  lastUpdate = 0;
  updateProgressbar();

  for (const key in json) {
    if (
      json.hasOwnProperty(key) &&
      !"created edited url".split(" ").includes(key)
    ) {
      let element = json[key];

      if (element != "") {
        let newDiv = document.createElement("div");
        newDiv.id = key;
        newDiv.classList.add("mt-3");
        myUl.append(newDiv);

        let label = document.createElement("h6");
        label.innerHTML = toTitleCase(key) + ":";
        newDiv.append(label);

        if (Array.isArray(element)) {
          element.forEach(async function(e) {
            CreateLink(e, newDiv);
          });
        } else if (("" + element).includes("https")) {
          CreateLink(element, newDiv);
        } else {
          let p = document.createElement("p");
          p.innerHTML = toTitleCase(element);
          newDiv.append(p);
        }
      }
    }
  }
}

async function CreateLink(url, parentElement) {
  progressMax++;
  let newButton = document.createElement("button");
  let name = await getNameOf(url);
  newButton.innerHTML = name;
  newButton.onclick = async () => {
    let info = await doFetching(url);
    showInfo(info);
  };
  newButton.classList.add("btn");
  newButton.classList.add("btn-link");
  newButton.classList.add("py-0");

  let adiv = document.createElement("div");
  adiv.append(newButton);
  parentElement.append(adiv);
  progressNow++;
  updateProgressbar();
}

async function getNameOf(url) {
  result = await doFetching(url);
  if (result.hasOwnProperty("name")) {
    return result["name"];
  } else {
    return result["title"];
  }
}

function toTitleCase(str) {
  return ("" + str)
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

async function startup() {
  // let info = await doFetching("https://swapi.co/api/people/1");
  // showInfo(info);
  // updateProgressbar();
}

// search("ma");

startup();
