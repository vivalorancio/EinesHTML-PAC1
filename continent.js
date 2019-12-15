import { getUrlVars, capitalize } from "./countries";
import { getSumari, getCountries } from "./countries";

let continentimages = [
  { name: "africa", sizes: [100, 208, 287, 355, 411, 483] },
  { name: "americas", sizes: [100, 204, 278, 343, 399, 450, 499, 509] },
  { name: "asia", sizes: [100, 210, 291, 345, 455] },
  { name: "europe", sizes: [100, 192, 256, 317, 359, 407, 450, 466] },
  { name: "oceania", sizes: [100, 282, 412, 496, 589, 640] }
];

function getImgSet(continentname) {
  const continentimg = continentimages.filter(
    item => item.name === continentname
  )[0];
  console.log(continentimg);

  let sizes =
    "(max-width: 768px) 100vw, (max-width: 1440px) 33vw, " +
    continentimg.sizes[continentimg.sizes.length - 1] +
    "px";
  var srcset = "";
  for (let i = 0; i < continentimg.sizes.length; i++) {
    let size = continentimg.sizes[i];
    srcset += `/img/${continentname}_${size}.jpg ${size}vw`;
    if (i < continentimg.sizes.length - 1) srcset += ",";
    srcset += "\n";
  }

  let src = `/img/${continentname}_${
    continentimg.sizes[continentimg.sizes.length - 1]
  }.jpg`;

  const iconti = document.querySelector("#continentimage");
  iconti.srcset = srcset;
  iconti.src = src;
  iconti.sizes = sizes;

  console.log(sizes);
  console.log(srcset);
  console.log(src);
}

window.onload = () => {
  const continent = getUrlVars().name;

  const hconti = document.querySelector("#continentname");
  hconti.innerHTML = capitalize(continent);
  getImgSet(continent);

  getSumari(continent);
  getCountries(continent);
};
