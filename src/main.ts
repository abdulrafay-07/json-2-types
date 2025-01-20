import "./style.css";

// Grab required elements
const inputBtn = document.getElementById("input-btn") as HTMLButtonElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;
const jsonOutput = document.getElementById("json-output") as HTMLTextAreaElement;
const textareaInput = document.getElementById("json-input") as HTMLTextAreaElement;

// TODO list: check for array with multiple types, check for optional values, check for 2d array types

function getType(value: any, indentLevel = 1): string {
  const indent = "\t".repeat(indentLevel);

  if (typeof value === "string") {
    return "string";
  } else if (typeof value === "number") {
    return "number";
  } else if (typeof value === "boolean") {
    return "boolean";
  } else if (value === null) {
    return "string | null";
  } else if (Array.isArray(value)) {
    const firstElement = value[0];
    if (!firstElement) return "any[]";
    if (Array.isArray(firstElement)) return "any[][]";

    if (typeof firstElement === "string") {
      return "string[]";
    } else if (typeof firstElement === "number") {
      return "number[]";
    } else if (typeof firstElement === "boolean") {
      return "boolean[]";
    } else if (typeof firstElement === "object") {
      const nestedType = getType(firstElement, indentLevel);
      return `${nestedType}[]`;
    };
  } else if (typeof value === "object") {
    if (Object.keys(value).length === 0) return "{};";

    let objString = "{\n";
    for (let key in value) {
      const v = value[key];
      const type = getType(v, indentLevel + 1);
      objString += `${indent}${key}: ${type};\n`;
    };
    return objString + "\t".repeat(indentLevel - 1) + "}";
  };

  return "unknown;";
};

inputBtn?.addEventListener("click", () => {
  let parsedInput;

  try {
    parsedInput = JSON.parse(textareaInput.value);
  } catch (error) {
    alert("Invalid JSON input. Please check your syntax. (error in console)");
    console.log(error);
    return
  };

  const hashMap = new Map();

  for (let key in parsedInput) {
    const value = parsedInput[key];
    const type = getType(value, 2);
    hashMap.set(key, type);
  };

  const outputObj = Object.fromEntries(hashMap);

  let outputString = 'interface JsonType {';
  for (let k in outputObj) {
    outputString += "\n\t" + k + ": " + outputObj[k] + ";";
  };
  outputString += "\n};";

  jsonOutput.value = outputString;
});

copyBtn.addEventListener("click", () => {
  if (jsonOutput.value === "") {
    alert("Output is empty");
    return;
  };

  window.navigator.clipboard.writeText(jsonOutput.value);
  alert("Copied!");
});
