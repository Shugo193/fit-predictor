export const CATEGORIES = {
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
