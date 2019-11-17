import "@babel/polyfill";
var L = require("leaflet");
var RestCountries = require("rest-countries-node");
const wiki = require("wikijs").default;

let restCountries = new RestCountries();

export function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getSumari(name) {
  const sumari = document.querySelector(".sumari");
  let wikiurl = "";
  wiki({ apiUrl: "https://en.wikipedia.org/w/api.php" })
    .page(name)
    .then(page => {
      wikiurl = page.url();
      return page.summary();
    })
    .then(text => {
      sumari.innerHTML = text;
      const a = document.createElement("a");
      a.target = "_blank";
      a.innerHTML = "Wikipedia";
      a.href = wikiurl;
      sumari.appendChild(a);
      return sumari;
    });
}

export function getCountries(continent) {
  restCountries.findByRegion(continent).then(countries => {
    const divcountries = document.querySelector("div.countries");

    for (let i = 0; i < countries.length; i += 1) {
      const country = countries[i].name.replace(/\([^()]*\)/g, "");

      const divcountry = document.createElement("div");
      divcountry.className = "country";
      const a = document.createElement("a");
      a.href = `country.html?name=${country}`;

      const flag = document.createElement("img");
      flag.src = countries[i].flag;
      flag.className = "active";
      flag.alt = capitalize(country);
      a.appendChild(flag);
      divcountry.appendChild(a);

      const p = document.createElement("p");
      const ap = document.createElement("a");

      ap.href = `country.html?name=${country}`;
      ap.innerHTML = capitalize(country);
      p.className = "caption";
      p.appendChild(ap);
      divcountry.appendChild(p);
      divcountries.appendChild(divcountry);
    }
  });
}
let map;

async function getGeoData(code) {
  const response = await fetch(`/data/${code}.geo.json`);
  return await response.json();
}

export async function getCountry(countryname) {
  const country = await restCountries.findByName(countryname);
  console.log(country[0]);
  map = L.map("map").setView(country[0].latlng, 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const geodata = await getGeoData(country[0].alpha3Code.toLowerCase());
  const geoLayer = L.geoJson().addTo(map);
  geoLayer.addData(geodata);

  const uldades = document.querySelector("#uldades");

  let lidades = document.createElement("li");
  lidades.innerHTML = "<span>Native Name:</span> " + country[0].nativeName;
  uldades.appendChild(lidades);
  lidades = document.createElement("li");
  lidades.innerHTML = "<span>Capital:</span> " + country[0].capital;
  uldades.appendChild(lidades);
  lidades = document.createElement("li");
  lidades.innerHTML = "<span>Population:</span> " + country[0].population;
  uldades.appendChild(lidades);
  let langlist = "";
  for (let i = 0; i < country[0].languages.length; i += 1) {
    if (i != 0) langlist += ", ";
    langlist += country[0].languages[i].name;
  }
  lidades = document.createElement("li");
  lidades.innerHTML = "<span>Languages:</span> " + langlist;
  uldades.appendChild(lidades);
  lidades = document.createElement("li");
  lidades.innerHTML = "<span>Timezones:</span> " + country[0].timezones.join();
  uldades.appendChild(lidades);
}

window.onload = () => {
  const countryname = decodeURI(getUrlVars().name);

  const hcountry = document.querySelector("#countryname");
  hcountry.innerHTML = capitalize(countryname);

  getSumari(countryname);
  getCountry(countryname);
};
