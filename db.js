export function openDB(whenLoaded) {
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
    whenLoaded(db);
  };
}

export function getAllClothes(db, whenRead) {
  const transaction = db.transaction("clothes", "readonly");
  const store = transaction.objectStore("clothes");

  const getRequest = store.getAll();
  getRequest.onsuccess = () => {
    whenRead(getRequest.result);
  };
}
export function addClothes(db, clothesInformation, whenAdded) {
  const transaction = db.transaction("clothes", "readwrite");
  const store = transaction.objectStore("clothes");
  const storeRequest = store.add(clothesInformation);

  storeRequest.onsuccess = (event) => {
    console.log("保存しました。");
    whenAdded();
  };
}
