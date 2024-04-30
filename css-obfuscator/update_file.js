import { readFile, readdir, stat, writeFile } from "fs";
import { join } from "path";

// Define the directory path
const directoryPath = "../src/components/core";

// Read the mainfile.json containing key-value pairs
readFile("main-file.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    const replacements = JSON.parse(data);
    // Update all .tsx files in the specified directory
    updateTsxFiles(directoryPath, replacements);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});

function updateTsxFiles(directoryPath, replacements) {
  // Read all files in the directory
  readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // Iterate through each file
    files.forEach((file) => {
      const filePath = join(directoryPath, file);
      // Check if the file is a directory
      stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isDirectory()) {
          // Recursively update files in subdirectories
          updateTsxFiles(filePath, replacements);
        } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
          // Update .tsx files
          updateTsxFile(filePath, replacements);
        }
      });
    });
  });
}

function replaceWithinString(string = "", replacements) {
  const words = string.split(/\s+/); // Split the string by whitespace
  const replacedWords = words.map((word) => {
    for (const [originalClass, newClass] of Object.entries(replacements)) {
      // console.log(escapeRegExp(originalClass), newClass);
      if (word === escapeRegExp(originalClass)) {
        return escapeRegExp(newClass);
      }
    }
    return word;
  });
  return replacedWords.join(" ");
}

async function updateTsxFile(filePath, replacements) {
  // Read the .tsx file
  readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Extract strings within double quotes and perform replacements
    data = data.replace(/"(.*)"/g, (match, string) => {
      string = replaceWithinString(string, replacements);
      return `"${string}"`; // Return the updated string wrapped in double quotes
    });

    // Extract strings within backtick and perform replacements
    data = data.replace(/`(.*)`/g, (match, string) => {
      string = replaceWithinString(string, replacements);
      return `\`${string}\``; // Return the updated string wrapped `string`
    });

    const regexDoubleSpaui = /\bspaui-spaui-\b/g;
    data = data.replace(regexDoubleSpaui, "spaui-");

    // Write the updated content back to the .tsx file
    writeFile(filePath, data, "utf8", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${filePath} updated successfully`);
    });
  });
}

function getUpdateData(data, stringRegex) {
  data.replace(stringRegex, (match, string) => {
    // Perform find and replace for each key-value pair within the string
    for (const [originalClass, newClass] of Object.entries(replacements)) {
      console.log(originalClass, newClass);
      string = string.replace(
        new RegExp(escapeRegExp(originalClass), "g"),
        escapeRegExp(newClass),
      );
    }
    return `"${string}"`; // Return the updated string wrapped in double quotes
  });
}
// Function to escape special characters in a string for use in a regex
function escapeRegExp(string) {
  return string;
  if (string.startsWith(".")) {
    string = string.substring(1);
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
