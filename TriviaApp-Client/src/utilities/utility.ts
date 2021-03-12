export enum StorageTypes {
  sessionStorage,
  localStorage
}

function handleError(error: string) {
  console.error(`Storage error: ${error}`);
}

export function storageAvailable(type: StorageTypes): boolean {
  let storage: Storage | null = null;
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
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (error) {
    handleError(error.message);
    return error instanceof DOMException && (
      // everything except Firefox
      error.code === 22 ||
      // Firefox
      error.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      error.name === 'QuotaExceededError' ||
      // Firefox
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (!!storage && storage.length !== 0);;
  }
}