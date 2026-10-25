const CATEGORIES = {
  //width:緩キツ　length:長短
  tops: {
    label: "トップス",
    points: [
      { key: "bodyWidth", label: "身幅", type: "width" },
      { key: "shoulderWidth", label: "肩幅", type: "width" },
      { key: "bodyLength", label: "着丈", type: "length" },
      { key: "sleeveLength", label: "袖丈", type: "length" },
      { key: "hemCircumference", label: "すそ回り", type: "width" },
    ],
  },
  pants: {
    label: "パンツ",
    points: [
      { key: "waist", label: "ウエスト", type: "width" },
      { key: "hip", label: "ヒップ", type: "width" },
      { key: "frontRise", label: "股上", type: "length" },
      { key: "inseam", label: "股下", type: "length" },
      { key: "thighCircumference", label: "もも回り", type: "width" },
      { key: "legOpeningCircumference", label: "すそ回り", type: "width" },
    ],
  },
};

const EVALUATION = {
  width: ["きつい", "ややきつい", "ちょうど", "ややゆるい", "ゆるい"],
  length: ["短い", "やや短い", "ちょうど", "やや長い", "長い"],
};

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
//indexedDB
const requestOpen = indexedDB.open("clothesDB", 1);
let db;
requestOpen.onupgradeneeded = (event) => {
  const database = event.target.result;
  database.createObjectStore("clothes", { keyPath: "id", autoIncrement: true });
};

requestOpen.onerror = (event) => {
  console.error("failed");
};

requestOpen.onsuccess = (event) => {
  db = event.target.result;
  displayAllData(db, allDataArea);
};

const pointArea = document.getElementById("points");
const categorySelect = document.getElementById("category");
const registerButton = document.getElementById("registerButton");
const allDataArea = document.getElementById("allData");

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

  const transaction = db.transaction("clothes", "readwrite");
  const store = transaction.objectStore("clothes");
  const storeRequest = store.add(clothesInformation);

  storeRequest.onsuccess = (event) => {
    console.log("保存しました。");
    displayAllData(db, allDataArea);
  };
});
