import { CATEGORIES } from "./categories.js";
import { EVALUATION } from "./categories.js";
import { COMPARE } from "./categories.js";
import { openDB, getAllClothes } from "./db.js";
import { predict } from "./predict.js";

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

    pointsDiv.append(span, sizeInput);
    pointArea.appendChild(pointsDiv);
  }
}

let mainDatabase;
const pointArea = document.getElementById("points");
const categorySelect = document.getElementById("category");
const startButton = document.getElementById("startButton");
const compareArea = document.getElementById("compareArea");

displayPoints(CATEGORIES[categorySelect.value].points, pointArea);
categorySelect.addEventListener("change", () => {
  displayPoints(CATEGORIES[categorySelect.value].points, pointArea);
});

openDB((db) => {
  mainDatabase = db;
});

startButton.addEventListener("click", () => {
  compareArea.innerHTML = "";
  getAllClothes(mainDatabase, (allClothes) => {
    const categoryFiltered = allClothes.filter((item) => item.category === categorySelect.value);
    let name = document.getElementById("name").value;
    if (name === "") {
      name = "名前なし";
    }

    for (const point of CATEGORIES[categorySelect.value].points) {
      const { key, label, type } = point;

      const pointsDiv = document.createElement("div");
      pointsDiv.textContent = label;

      let sizeInputed = null;

      const sizeInput = document.getElementById(`${key}SizeInput`);
      if (sizeInput.value !== "") {
        sizeInputed = Number(sizeInput.value);

        const rows = [];

        const { small, big } = predict(sizeInputed, categoryFiltered, key);
        const table = document.createElement("table");

        if (small === null && big === null) {
          const textDiv = document.createElement("div");
          textDiv.textContent = "比較する寸法がありません。";
          pointsDiv.appendChild(textDiv);
        } else if (small === null) {
          rows.push(["-", "", name, "", big.name]);
          rows.push(["-", "<", `${sizeInputed}cm`, "<", `${big.cmValue}cm`]);
          rows.push([`さらに${COMPARE[type][0]}`, "", "～", "", EVALUATION[type][big.fitEvaluation + 2]]);
        } else if (big === null) {
          rows.push([small.name, "", name, "", "-"]);
          rows.push([`${small.cmValue}cm`, "<", `${sizeInputed}cm`, "<", "-"]);
          rows.push([EVALUATION[type][small.fitEvaluation + 2], "", "～", "", `さらに${COMPARE[type][1]}`]);
        } else if (small.cmValue === sizeInputed) {
          rows.push([small.name, "", name, "", "-"]);
          rows.push([`${small.cmValue}cm`, "=", `${sizeInputed}cm`, "", "-"]);
          rows.push([EVALUATION[type][small.fitEvaluation + 2], "", "", "", "-"]);
        } else {
          rows.push([small.name, "", name, "", big.name]);
          rows.push([`${small.cmValue}cm`, "<", `${sizeInputed}cm`, "<", `${big.cmValue}cm`]);
          rows.push([EVALUATION[type][small.fitEvaluation + 2], "", "～", "", EVALUATION[type][big.fitEvaluation + 2]]);
        }
        rows.forEach((row) => {
          const tr = document.createElement("tr");
          row.forEach((item) => {
            const td = document.createElement("td");
            td.textContent = item;
            td.style.textAlign = "center";
            tr.appendChild(td);
          });
          table.appendChild(tr);
        });
        pointsDiv.appendChild(table);
        compareArea.appendChild(pointsDiv);
      }
    }
  });
});
