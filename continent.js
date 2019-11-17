import { getUrlVars, capitalize } from "./countries";
import { getSumari, getCountries } from "./countries";

window.onload = () => {
  const continent = getUrlVars().name;

  const hconti = document.querySelector("#continentname");
  hconti.innerHTML = capitalize(continent);

  getSumari(continent);
  getCountries(continent);
};
