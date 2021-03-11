export enum StorageTypes {
  sessionStorage,
  localStorage
}

function handleError(error: string) {
  console.error(`Storage error: ${error}`);
}

export function storageAvailable(type: StorageTypes): boolean {
  var storage: Storage | null = null;
  try {
    // Determine type of storage    
    switch (type) {
      case StorageTypes.localStorage:
        storage = window.localStorage;
        break;
      case StorageTypes.sessionStorage:
        storage = window.sessionStorage;
        break;
    }

    // Guard
    if (!storage)
    throw new Error("Could not determine type of storage API.");
    
    // Test
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
    handleError(e.message);
    return false;
  }
}