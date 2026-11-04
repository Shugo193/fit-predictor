export function openDB(whenOpened) {
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
    whenOpened(db);
  };
}
