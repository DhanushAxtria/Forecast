import React, { createContext, useState } from 'react';
// Create a context with a default value
const MyContext = createContext();

const MyProvider = ({ children }) => {
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [ForecastedValue, setForecastValue] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [ ParsedData, setParsedData ] = useState(null);
    const [isCol, setIsCol] = useState(false);
    const [met, setMet] = useState(null);

  return (
    <MyContext.Provider value={{  
        selectedSheet, setSelectedSheet,
        ForecastedValue, setForecastValue,
        selectedFile, setSelectedFile,
        ParsedData, setParsedData,
        isCol, setIsCol,
        met, setMet,
        }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyProvider, MyContext };
