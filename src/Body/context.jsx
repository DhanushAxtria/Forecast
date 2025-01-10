import React, { createContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { set } from 'date-fns';

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
  const [storeValues, setStoreValues] = useState({});
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
  const [fromHistoricalDate, setFromHistoricalDate] = useState(dayjs());
  const [fromForecastDate, setFromForecastDate] = useState(dayjs());
  const [toForecastDate, setToForecastDate] = useState(dayjs());
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
  const [countries, setCountries] = React.useState([]);
  const [therapeuticAreas, setTherapeuticAreas] = React.useState([]);
  const [forecastCycles, setForecastCycles] = React.useState([]);

  const [rowsData, setRowsData] = useState([
    {
      country: "Sweden",
      currentForecastStatus: "Ongoing",
      forecast: "Forecast 1",
      forecastScenario: "H2 - 2023",
      forecastStarted: "2024-11-10",
      therapeuticArea: "Cardiology",
      username: "michael_wang",
      worksheet: "Output Sheet",
    },
    {
      country: "Spain",
      currentForecastStatus: "Pending",
      forecast: "Forecast 1",
      forecastScenario: "H1 - 2023",
      forecastStarted: "2024-04-25",
      therapeuticArea: "HIV",
      username: "john_doe",
      worksheet: "Output Sheet",
    },
    {
      country: "Finland",
      currentForecastStatus: "Submitted",
      forecast: "Forecast 1",
      forecastScenario: "H2 - 2024",
      forecastStarted: "2024-09-08",
      therapeuticArea: "Cardiology",
      username: "john_wick",
      worksheet: "Output Sheet",
    },
  ]);



  const [Formulas, setFormulas] = useState(() => {
    const formulas = {};
    Object.keys(products).forEach((tabKey) => {
      formulas[tabKey] = Object.keys(products[tabKey]).reduce((acc, tableKey) => {
        acc[tableKey] = products[tabKey][tableKey].reduce((acc2, row) => {
          acc2[row.id] = { emptyArray: [""], plusArray: ["+"] };
          return acc2;
        }, {});
        return acc;
      }, {});
    });
    return formulas;
  });

  const [editingFormula, setEditingFormula] = useState({ ...Formulas });

  useEffect(() => {
    setFromHistoricalDate(dayjs('2025-01-01'));
    setFromForecastDate(dayjs('2025-05-01'));
    setToForecastDate(dayjs('2025-11-01'));
    fetch('/values.json')
      .then(response => response.json())
      .then(data => setValues(data));
    fetch('/values2.json')
      .then(response => response.json())
      .then(data => setValues2(data));
    fetch('/values3.json')
      .then(response => response.json())
      .then(data => setValues3(data));
  }, []);
  useEffect(() => {
    const formulasDemo = { ...Formulas };
    Object.keys(formulasDemo).forEach((tabKey) => {
      Object.keys(formulasDemo[tabKey]).forEach((tableKey) => {
        formulasDemo[tabKey][tableKey]['T1-1'] = { emptyArray: ['T1-1'], plusArray: ['+'] };
        formulasDemo[tabKey][tableKey]['T1-3'] = { emptyArray: ['T1-1', 'T1-2'], plusArray: ['+', '+'] };
        formulasDemo[tabKey][tableKey]['T1-4'] = { emptyArray: ['T1-1', 'T1-2', 'T1-3'], plusArray: ['+', '+', '+'] };
        formulasDemo[tabKey][tableKey]['T1-2'] = { emptyArray: ['T1-1'], plusArray: ['+'] };
        formulasDemo[tabKey][tableKey]['T2-2'] = { emptyArray: ['T2-1'], plusArray: ['+'] };
        formulasDemo[tabKey][tableKey]['T2-3'] = { emptyArray: ['T2-1', 'T2-2'], plusArray: ['+', '+'] };
        formulasDemo[tabKey][tableKey]['T2-4'] = { emptyArray: ['T2-1', 'T2-2', 'T2-3'], plusArray: ['+', '+', '*'] };
        formulasDemo[tabKey][tableKey]['T2-5'] = { emptyArray: ['T2-1', 'T2-2', 'T2-3', 'T2-4'], plusArray: ['+', '+', '+', '*'] };
        formulasDemo[tabKey][tableKey]['T2-6'] = { emptyArray: ['T2-1', 'T2-2', 'T2-3', 'T2-4', 'T2-5'], plusArray: ['+', '+', '+', '*', '/'] };
        formulasDemo[tabKey][tableKey]['T2-7'] = { emptyArray: ['T2-1', 'T2-2', 'T2-3', 'T2-4', 'T2-5'], plusArray: ['+', '+', '+', '*', '/'] };
        formulasDemo[tabKey][tableKey]['T2-1'] = { emptyArray: ['T2-1'], plusArray: ['+'] };
        formulasDemo[tabKey][tableKey]['T3-1'] = { emptyArray: ['T3-1'], plusArray: ['+'] };
        formulasDemo[tabKey][tableKey]['T3-2'] = { emptyArray: ['T3-1', 'T3-1'], plusArray: ['+', '+'] };
        formulasDemo[tabKey][tableKey]['T3-3'] = { emptyArray: ['T3-1', 'T3-2', 'T3-2'], plusArray: ['+', '+', '*'] };
      });
    });
    setFormulas(formulasDemo);
    setEditingFormula(formulasDemo);
  }, []);


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
      fromHistoricalDate, setFromHistoricalDate,
      fromForecastDate, setFromForecastDate,
      toForecastDate, setToForecastDate,
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
      timePeriod, setTimePeriod,
      countries, setCountries,
      therapeuticAreas, setTherapeuticAreas,
      forecastCycles, setForecastCycles,
      Formulas, setFormulas,
      editingFormula, setEditingFormula,
      rowsData, setRowsData,
      storeValues, setStoreValues,
    }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyProvider, MyContext };