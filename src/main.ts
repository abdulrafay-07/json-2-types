import "./style.css";

// Grab required elements
const inputBtn = document.getElementById("input-btn") as HTMLButtonElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;
const jsonOutput = document.getElementById("json-output") as HTMLTextAreaElement;
const textareaInput = document.getElementById("json-input") as HTMLTextAreaElement;

function getType(value: any): string {
  if (typeof value === "string") {
    return "string;";
  } else if (typeof value === "number") {
    return "number;";
  } else if (typeof value === "boolean") {
    return "boolean;";
  } else if (value === null) {
    return "string | null;";
  } else if (Array.isArray(value)) {
    const firstElement = value[0];

    if (typeof firstElement === "string") {
      return "string[];";
    } else if (typeof firstElement === "number") {
      return "number[];";
    } else if (typeof firstElement === "boolean") {
      return "boolean[];";
    };
  };

  return "unknown;";
};

inputBtn?.addEventListener("click", () => {
  const input = textareaInput.value;
  if (input === "" || !input.startsWith("{") || !input.endsWith("}")) {
    textareaInput.value = "";
    alert("Invalid input");
    return;
  };

  const parsedInput = JSON.parse(input);
  
  const hashMap = new Map();

  for (let key in parsedInput) {
    const value = parsedInput[key];
    const type = getType(value);
    hashMap.set(key, type);
  };

  const outputObj = Object.fromEntries(hashMap);

  let outputString = 'interface JsonType {';
  for (let k in outputObj) {
    outputString += "\n\t" + k + ": " + outputObj[k];
  };
  outputString += "\n};";

  console.log(outputString);
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
