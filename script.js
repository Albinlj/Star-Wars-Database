var myDiv = document.getElementById("myDiv");
var myList = document.getElementById("myList");
var myInput = document.getElementById("myInput");
var myButton = document.getElementById("myButton");

myButton.onclick = () => search(myInput.value);

async function search(searchString) {
  let categories = "people planets films species vehicles starships".split(" ");

  categories.forEach(async function(category) {
    let results = await searchInCategory(category, searchString);
    if (results.length > 0) {
      let ul = document.createElement("ul");
      myDiv.append(ul);

      let h3 = document.createElement("h3");
      h3.innerHTML = category;
      ul.append(h3);

      results.forEach(result => {
        let listItem = document.createElement("li");
        ul.append(listItem);

        let a = document.createElement("a");
        a.innerHTML = result.name;

        let id = "https://swapi.co/api/" + category + "?search=" + result.name;
        a.setAttribute("id", id);

        listItem.append(a);
      });
    }
  });
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
  myDiv.innerHTML = "";

  for (const key in json) {
    // console.log(key);
    if (
      json.hasOwnProperty(key) &&
      !"created edited url".split(" ").includes(key)
    ) {
      let newDiv = document.createElement("div");
      newDiv.id = key;
      myDiv.append(newDiv);

      let element = json[key];

      let label = document.createElement("h4");
      label.innerHTML = toTitleCase(key);
      newDiv.append(label);

      if (Array.isArray(element)) {
        element.forEach(async function(e) {
          CreateLink(e, newDiv);
        });
      } else if (("" + element).includes("https")) {
        CreateLink(element, newDiv);
      } else {
        let p = document.createElement("p");
        p.innerHTML = element;
        myDiv.append(p);
      }
    }
  }
  // myDiv.innerHTML = "he";
}

async function CreateLink(url, parentElement) {
  let a = document.createElement("a");
  let name = await getNameOf(url);
  a.innerHTML = name;
  a.onclick = async () => {
    let info = await doFetching(url);
    showInfo(info);
  };

  parentElement.append(a);
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
  return str
    .replace("_", " ")
    .replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

async function startup() {
  let info = await doFetching("https://swapi.co/api/people/1");
  showInfo(info);
}

// search("ma");

startup();
