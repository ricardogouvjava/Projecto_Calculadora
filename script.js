"use strict";
// Selecting elements
const numberButtons = document.querySelectorAll(".number");
const operationButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");
const ouputEl = document.querySelector(".output");
const signalChange = document.querySelector(".signal");
const changeToPercentage = document.querySelector(".percentage");

// max digits per operand
const maxDigits = 12;

const operations = ["+", "-", "÷", "x"];

let currentOperand, previousOperand, operation, ouputInfo, result;

// clears all variables
const fullclear = function () {
  previousOperand = "";
  currentOperand = "";
  operation = "";
  result = "";
  setOutput("0");
};

// clears variables except output
const simpleClear = function (value) {
  previousOperand = "";
  currentOperand = "";
  operation = "";
  setOutput(value);
};

// creates output string
const creatOutput = function () {
  ouputInfo = "";
  ouputInfo += previousOperand ? previousOperand + " " : previousOperand;
  ouputInfo += operation ? operation + " " : operation;
  ouputInfo += currentOperand;
  setOutput(ouputInfo);
};

const setOutput = function (out) {
  checkOuputLayout(out);
  ouputEl.textContent = out;
};

const setNewComputation = function (opButton) {
  operation = opButton.textContent;
  previousOperand = currentOperand;
  currentOperand = "";
  setOutput(previousOperand + " " + operation);
};

const formateComputation = function (value) {
  return value.toString().replace(".", ",");
};

const calculate = function () {
  console.log(previousOperand, operation, currentOperand);
  let computation;
  let curr = parseFloat(currentOperand.replace(",", "."));
  let prev = parseFloat(previousOperand.replace(",", "."));
  if (isNaN(prev) || isNaN(curr)) return;
  switch (operation) {
    case "×":
      computation = prev * curr;
      break;
    case "÷":
      computation = curr === 0 ? "Not a Number" : prev / curr;
      break;
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    default:
      return;
  }
  return analyseToOutput(computation);
};

const analyseToOutput = function (toAnalyse) {
  if (toAnalyse !== "Not a Number") {
    return toAnalyse.toPrecision(maxDigits - 2).replace(/(\.0+|0+)$/, "");
  } else {
    return toAnalyse;
  }
};

const checkOuputLayout = function (out) {
  if (out.length <= maxDigits) {
    ouputEl.classList.remove("big");
    ouputEl.classList.add("small");
  } else {
    ouputEl.classList.add("big");
    ouputEl.classList.remove("small");
  }
};

fullclear();

/* Events */
/* When Number Pressed */
numberButtons.forEach((numberButton) => {
  numberButton.addEventListener("click", function () {
    let newChar = numberButton.innerText;
    // dont allow more than maxDigits
    if (currentOperand.length < maxDigits) {
      // verify validity of input ,
      if (newChar === "," && currentOperand.includes(",")) return;
      // verify validity of input 0
      if (
        newChar === "0" &&
        (currentOperand.charAt(0) === "0" ||
          currentOperand.substring(1, 2) === "-0") &&
        !currentOperand.includes(",")
      )
        return;
      // add without other restriction
      currentOperand += newChar;
    }
    creatOutput();
  });
});

/* When operator Pressed */
operationButtons.forEach((operationButton) => {
  operationButton.addEventListener("click", () => {
    if (!currentOperand && !result) return;
    if (!currentOperand && result) {
      currentOperand = result;
      result = "";
    }
    if (currentOperand && !operation) {
      setNewComputation(operationButton);
      return;
    }
    if (currentOperand && operation) {
      currentOperand = calculate();
      console.log(currentOperand);
      setNewComputation(operationButton);
    }
  });
});

/* When equals Pressed */
equalsButton.addEventListener("click", () => {
  if (!currentOperand || !operation || !previousOperand) return;
  result = calculate();
  console.log(result);
  simpleClear(result); // save result if value to continued to be used
});

/*When Clear Pressed 
Clears all parameters
*/
clearButton.addEventListener("click", fullclear);

/* When change Signal Pressed 
changes the signal of the current operand 
*/
signalChange.addEventListener("click", () => {
  if (result) {
    currentOperand =
      result.charAt(0) !== "-"
        ? "-" + result
        : result.substring(1, result.length);
    result = "";
    creatOutput();
    return;
  }
  if (currentOperand) {
    currentOperand =
      currentOperand.charAt(0) !== "-"
        ? "-" + currentOperand
        : currentOperand.substring(1, currentOperand.length);
    creatOutput();
  }
});

changeToPercentage.addEventListener("click", () => {
  if (!currentOperand && !result) return;
  if (result && !currentOperand) {
    let percentageValue = parseFloat(result.replace(",", ".")) / 100;
    currentOperand = analyseToOutput(percentageValue);
    creatOutput();
  }
  if (!result && currentOperand) {
    let percentageValue = parseFloat(currentOperand.replace(",", ".")) / 100;
    currentOperand = analyseToOutput(percentageValue);
    creatOutput();
  }
});
