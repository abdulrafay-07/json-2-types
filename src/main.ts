import "./style.css";

// Grab required elements
const inputBtn = document.getElementById("input-btn") as HTMLButtonElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;
const jsonOutput = document.getElementById("json-output") as HTMLTextAreaElement;
const textareaInput = document.getElementById("json-input") as HTMLTextAreaElement;
const toastDiv = document.getElementById("toast") as HTMLDivElement;

// TODO: check for optional values

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

    // check each array index type
    let sameType = true;
    for (let i = 0; i < value.length - 1; i++) {
      if (typeof value[i] !== typeof value[i+1]) {
        sameType = false;
        break;
      };
    };

    if (!sameType) return "any[]";

    // check for 2d array
    if (Array.isArray(firstElement)) {
      const type = getType(firstElement[0]);
      return `${type}[][]`;
    };

    const type = getType(firstElement, indentLevel);
    return `${type}[]`;
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

  return "unknown";
};

inputBtn.addEventListener("click", () => {
  let parsedInput;

  try {
    parsedInput = JSON.parse(textareaInput.value);
  } catch (error) {
    toastDiv.innerHTML = "✖ Invalid JSON input";
    toastDiv.classList.remove("hidden");
    toastDiv.classList.add("error", "flex");

    console.log(error);

    setTimeout(() => {
      toastDiv.classList.remove("flex", "error");
      toastDiv.classList.add("hidden");
    }, 2000);
    
    return;
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
    toastDiv.innerHTML = "✖ Nothing to copy";
    toastDiv.classList.remove("hidden");
    toastDiv.classList.add("error", "flex");

    setTimeout(() => {
      toastDiv.classList.remove("flex", "error");
      toastDiv.classList.add("hidden");
    }, 2000);

    return;
  };

  window.navigator.clipboard.writeText(jsonOutput.value);

  toastDiv.innerHTML = "✔ Interface copied";
    toastDiv.classList.remove("hidden");
    toastDiv.classList.add("success", "flex");

    setTimeout(() => {
      toastDiv.classList.remove("flex", "success");
      toastDiv.classList.add("hidden");
    }, 2000);
});
