import React, { createContext, useState } from 'react';
import dayjs from 'dayjs';

// Create a context with a default value
const MyContext = createContext();
const initialProducts1 = [
  { id: 'T1-1', name: 'US Population(14-49)' },
  { id: 'T1-2', name: 'Prevalence Rate' },
  { id: 'T1-3', name: 'Diagonsis Rate (%)' },
  { id: 'T1-4', name: 'Diagnosis GH Patients(%)' }

];
const initialProducts2 = [
  { id: 'T2-1', name: '% Patients on Chronic Therapy' },
  { id: 'T2-2', name: '% Patients on Episodic Therapy ' },
  { id: 'T2-3', name: 'Patients on Chronic Therapy' },
  { id: 'T2-4', name: 'Patients on Episodic Therapy ' },
  { id: 'T2-5', name: 'Total GH Patients ' },
  { id: 'T2-6', name: 'Chronic Therapy' },
  { id: 'T2-7', name: 'Episodic Therapy' }
];
const initialProducts3 = [
  { id: 'T3-1', name: 'Compliance' },
  { id: 'T3-2', name: 'Payer Access' },
  { id: 'T3-3', name: 'Patients on GS1179 (post Compliance) - Chronic Therapy' }

];

const initialProducts = {
  downside: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
  base: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
  upside: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
};


const MyProvider = ({ children }) => {
  const combinedProducts = [...initialProducts1, ...initialProducts2, ...initialProducts3];
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [ForecastedValue, setForecastValue] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ParsedData, setParsedData] = useState(null);
  const [isCol, setIsCol] = useState(false);
  const [met, setMet] = useState(null);
  const [historyFromDate, setHistoryFromDate] = useState(null);
  const [historyToDate, setHistoryToDate] = useState(null);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  const [products, setProducts] = useState(initialProducts);
  const [values, setValues] = useState({});
  const [values2, setValues2] = useState({});
  const [values3, setValues3] = useState({});
  const [cardTitle1, setCardTitle1] = useState('Epidemiology');
  const [cardTitle2, setCardTitle2] = useState('Total GH Patients');
  const [cardTitle3, setCardTitle3] = useState('Conversion Parameter');
  const [dropdownGroups, setDropdownGroups] = useState([
    { Case: "", SelectedCard: "", SelectedRow: "" },
  ]);
  const [showTabs, setShowTabs] = useState(false);
  const [timePeriod, setTimePeriod] = useState('Monthly');




  return (
    <MyContext.Provider value={{
      selectedSheet, setSelectedSheet,
      ForecastedValue, setForecastValue,
      selectedFile, setSelectedFile,
      ParsedData, setParsedData,
      isCol, setIsCol,
      met, setMet,
      historyFromDate, setHistoryFromDate,
      historyToDate, setHistoryToDate,
      selectedFromDate, setSelectedFromDate,
      selectedToDate, setSelectedToDate,
      fromDate, setFromDate,
      toDate, setToDate,
      products, setProducts,
      values, setValues,
      values2, setValues2,
      values3, setValues3,
      cardTitle1, setCardTitle1,
      cardTitle2, setCardTitle2,
      cardTitle3, setCardTitle3,
      combinedProducts,
      dropdownGroups, setDropdownGroups,
      showTabs, setShowTabs,
      timePeriod, setTimePeriod
    }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyProvider, MyContext };