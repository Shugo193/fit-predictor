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
    fitSelect.value = 0

    pointsDiv.append(span, sizeInput, fitSelect);
    pointArea.appendChild(pointsDiv);
  }
}

const pointArea = document.querySelector("#points");
const categorySelect = document.querySelector("#category");

displayPoints(CATEGORIES[categorySelect.value].points, pointArea);

categorySelect.addEventListener("change", () => {
  displayPoints(CATEGORIES[categorySelect.value].points, pointArea);
});

pointArea.addEventListener("change", function (event) {
  console.log(event.target.value);
});
