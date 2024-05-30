import { readFileSync, writeFileSync } from "fs";

import lookup from "country-code-lookup";

// Function to validate country alpha-2 code
function isValidAlpha2Code(alpha2) {
  if (alpha2.length !== 2) {
    return false;
  }
  if (alpha2.toUpperCase() !== alpha2) {
    return false;
  }
  if (!lookup.byIso(alpha2)) {
    return false;
  }

  console.log(lookup.byIso("PSE"));
  return true;
}

// Function to validate country alpha-3 code
function isValidAlpha3Code(alpha3) {
  if (alpha3.length !== 3) {
    return false;
  }
  if (alpha3.toUpperCase() !== alpha3) {
    return false;
  }
  if (!lookup.byIso(alpha3)) {
    return false;
  }
  return true;
}

// Paths to the input and output files
const inputTopoJSONPath =
  "src/components/datavisualizer/maps/data/features.json";
const outputTopoJSONPath =
  "src/components/datavisualizer/maps/data/outout.json";

// Read and parse the TopoJSON file
const topojson = JSON.parse(readFileSync(inputTopoJSONPath, "utf8"));

// Function to add new properties
function addCountryCodes(object) {
  // Example: Adding 2-char and 3-char country codes
  const countryName = object.properties.name; // Adjust this according to your TopoJSON structure

  // Define your country code mapping
  const countryCodes = {
    "United States": { code2: "US", code3: "USA" },
    Canada: { code2: "CA", code3: "CAN" },
    // Add more country mappings here
  };

  if (countryCodes[countryName]) {
    object.properties.code2 = countryCodes[countryName].code2;
    object.properties.code3 = countryCodes[countryName].code3;
  }
}

// Loop through each object in the TopoJSON and add new properties
Object.keys(topojson.objects).forEach((objectKey) => {
  const object = topojson.objects[objectKey];
  if (object.geometries) {
    object.geometries.forEach((geometry) => {
      const properties = geometry.properties;
      const alpha2 = properties.alpha2;
      const alpha3 = properties.alpha3;
      if (!isValidAlpha2Code(alpha2)) {
        console.log(properties);
      }
      if (!isValidAlpha3Code(alpha3)) {
        console.log(properties);
      }
      // console.log(alpha3, alpha2);
      // if ("region" in properties) {
      //   // console.log(geometry.properties);
      // } else {
      //   console.log(geometry.properties);
      // }
    });
  }
});

// Write the updated TopoJSON back to a file
// writeFileSync(outputTopoJSONPath, JSON.stringify(topojson, null, 2));

console.log(`reviewed ${outputTopoJSONPath}`);
