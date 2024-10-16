export const decryptId = (encryptedId) => {
    return atob(encryptedId);
  };
  
  export const encryptId = (id) => {
    return btoa(id);
  };