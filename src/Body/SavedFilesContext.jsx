// SavedFilesContext.js
import React, { createContext, useState } from 'react';

export const SavedFilesContext = createContext();

export const SavedFilesProvider = ({ children }) => {
  const [savedFiles, setSavedFiles] = useState([]);

  return (
    <SavedFilesContext.Provider value={{ savedFiles, setSavedFiles }}>
      {children}
    </SavedFilesContext.Provider>
  );
};
