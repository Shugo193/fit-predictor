import { CATEGORIES } from "./categories.js";
import { EVALUATION } from "./categories.js";
import { openDB, getAllClothes, addClothes } from "./db.js";

function displayPoints(points, pointArea) {
  pointArea.innerHTML = "";

  for (const point of points) {
    const { key, label, type } = point;
    const pointsDiv = document.createElement("div");
    pointsDiv.classList.add("input-row");

    const sizeInput = document.createElement("input");
    const inputLabel = document.createElement("label");
    inputLabel.textContent = `${label}：`;
    sizeInput.id = `${key}SizeInput`;
    sizeInput.type = "number";
    inputLabel.htmlFor = `${key}SizeInput`;

    const fitSelect = document.createElement("select");
    fitSelect.id = `${key}FitSelect`;

    EVALUATION[type].forEach((word, index) => {
      const option = document.createElement("option");
      option.textContent = word;
      option.value = index - 2;
      fitSelect.appendChild(option);
    });
    fitSelect.value = 0;

    pointsDiv.append(inputLabel, sizeInput, fitSelect);
    pointArea.appendChild(pointsDiv);
  }
}

function displayAllData(db, allDataArea) {
  allDataArea.innerHTML = "";

  getAllClothes(db, (result) => {
    for (const data of result) {
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
      clothesDiv.classList.add("card");
      allDataArea.appendChild(clothesDiv);
    }
  });
}

const pointArea = document.getElementById("points");
const categorySelect = document.getElementById("category");
const registerButton = document.getElementById("registerButton");
const allDataArea = document.getElementById("allData");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOverlay = document.getElementById("modalOverlay");
const toast = document.getElementById("toast");
let mainDatabase;

openDB((db) => {
  displayAllData(db, allDataArea);
  mainDatabase = db;
});
displayPoints(CATEGORIES[categorySelect.value].points, pointArea);

categorySelect.addEventListener("change", () => {
  displayPoints(CATEGORIES[categorySelect.value].points, pointArea);
});

openModalBtn.addEventListener("click", () => {
  modalOverlay.classList.add("active");
});

closeModalBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
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

  addClothes(mainDatabase, clothesInformation, () => {
    modalOverlay.classList.remove("active");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 1000);
    displayAllData(mainDatabase, allDataArea);
    displayPoints(CATEGORIES[categorySelect.value].points, pointArea);
    document.getElementById("name").value = "";
    document.getElementById("memo").value = "";
  });
});
