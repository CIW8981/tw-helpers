import { readFileSync, writeFileSync } from "fs";

import getCountryISO2 from "country-iso-3-to-2";

// const countryList = require("country-list");

// Paths to the input and output files
const inputTopoJSONPath =
  "src/components/datavisualizer/maps/data/features.json";
const outputTopoJSONPath =
  "src/components/datavisualizer/maps/data/output.json";

// Read and parse the TopoJSON file
const topojson = JSON.parse(readFileSync(inputTopoJSONPath, "utf8"));

// Function to add new properties
function addCountryCodes(object) {
  // Example: Adding 2-char and 3-char country codes
  const countryID = object.id; // Adjust this according to your TopoJSON structure

  // Define your country code mapping
  const countryCodes = {
    [countryID]: { alpha2: getCountryISO2(countryID), alpha3: countryID },
  };
  console.log(JSON.stringify(countryCodes));

  if (countryCodes[countryID]) {
    object.properties.alpha2 = countryCodes[countryID].alpha2;
    object.properties.alpha3 = countryCodes[countryID].alpha3;
  }
}

// Loop through each object in the TopoJSON and add new properties
Object.keys(topojson.objects).forEach((objectKey) => {
  const object = topojson.objects[objectKey];
  if (object.geometries) {
    object.geometries.forEach((geometry) => {
      addCountryCodes(geometry);
    });
  } else if (object.arcs) {
    addCountryCodes(object);
  }
});

// Write the updated TopoJSON back to a file
writeFileSync(outputTopoJSONPath, JSON.stringify(topojson, null, 2));

console.log(`Updated TopoJSON file saved to ${outputTopoJSONPath}`);
