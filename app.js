import { CATEGORIES } from "./categories.js";
import { EVALUATION } from "./categories.js";
import { openDB } from "./db.js";

function displayPoints(points, pointArea) {
  pointArea.innerHTML = "";

  for (const point of points) {
    const { key, label, type } = point;
    const pointsDiv = document.createElement("div");

    const span = document.createElement("span");
    span.textContent = label;

    const sizeInput = document.createElement("input");
    sizeInput.id = `${key}SizeInput`;
    sizeInput.type = "number";

    const fitSelect = document.createElement("select");
    fitSelect.id = `${key}FitSelect`;

    EVALUATION[type].forEach((word, index) => {
      const option = document.createElement("option");
      option.textContent = word;
      option.value = index - 2;
      fitSelect.appendChild(option);
    });
    fitSelect.value = 0;

    pointsDiv.append(span, sizeInput, fitSelect);
    pointArea.appendChild(pointsDiv);
  }
}

function displayAllData(db, allDataArea) {
  allDataArea.innerHTML = "";
  const transaction = db.transaction("clothes", "readonly");
  const store = transaction.objectStore("clothes");
  const getRequest = store.getAll();

  getRequest.onsuccess = () => {
    for (const data of getRequest.result) {
      const { name, category, memo, measurements, id } = data;

      const clothesDiv = document.createElement("div");
      const nameP = document.createElement("p");
      nameP.textContent = `名前：${name}`;
      const categoryP = document.createElement("p");
      categoryP.textContent = CATEGORIES[category].label;
      const memoP = document.createElement("p");
      memoP.textContent = memo;

      const pointsDiv = document.createElement("div");
      for (const point of CATEGORIES[category].points) {
        const { key, label, type } = point;
        const { cmValue, fitEvaluation } = measurements[key];

        const p = document.createElement("p");
        if (cmValue !== null) {
          p.textContent = `${label}：${cmValue}cm、 ${EVALUATION[type][fitEvaluation + 2]}`;
        } else {
          p.textContent = `${label}:入力なし`;
        }
        pointsDiv.appendChild(p);
      }
      clothesDiv.append(nameP, categoryP, pointsDiv, memoP);
      allDataArea.appendChild(clothesDiv);
    }
  };
}

const pointArea = document.getElementById("points");
const categorySelect = document.getElementById("category");
const registerButton = document.getElementById("registerButton");
const allDataArea = document.getElementById("allData");
let mainDatabase;

openDB((db) => {
  displayAllData(db, allDataArea);
  mainDatabase = db
});
displayPoints(CATEGORIES[categorySelect.value].points, pointArea);

categorySelect.addEventListener("change", () => {
  displayPoints(CATEGORIES[categorySelect.value].points, pointArea);
});

registerButton.addEventListener("click", () => {
  const clothesInformation = {};
  clothesInformation.name = document.getElementById("name").value;
  clothesInformation.category = categorySelect.value;
  clothesInformation.memo = document.getElementById("memo").value;
  clothesInformation.measurements = {};
  for (const point of CATEGORIES[categorySelect.value].points) {
    const key = point.key;

    let sizeInputed = null;
    let fitSelected = null;

    const sizeInput = document.getElementById(`${key}SizeInput`);
    if (sizeInput.value !== "") {
      sizeInputed = Number(sizeInput.value);
      fitSelected = Number(document.getElementById(`${key}FitSelect`).value);
    }
    clothesInformation.measurements[key] = { cmValue: sizeInputed, fitEvaluation: fitSelected };
  }

  const transaction = mainDatabase.transaction("clothes", "readwrite");
  const store = transaction.objectStore("clothes");
  const storeRequest = store.add(clothesInformation);

  storeRequest.onsuccess = (event) => {
    console.log("保存しました。");
    displayAllData(mainDatabase, allDataArea);
  };
});
