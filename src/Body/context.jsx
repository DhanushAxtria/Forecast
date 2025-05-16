

import React, { createContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { de } from 'date-fns/locale';

// Create a context with a default value
const MyContext = createContext();



const MyProvider = ({ children }) => {
  const [therapeuticArea, setTherapeuticArea] = useState('STD');
  const [timePeriod, setTimePeriod] = useState('Yearly');
  const [caseTypeLabels, setCaseTypeLabels] = useState(['Base', 'Downside', 'Upside']);
  const [caseTypeLabelsOnco, setCaseTypeLabelsOnco] = useState(['Line 1', 'Line 2', 'Line 3+']);
  const therapeuticAreaOptions = ['Cardiology', 'Oncology', 'Neurology', 'STD', 'Immunology', 'HIV'];
  const [forecastCycle, setForecastCycle] = useState('H1-2023');
  const [TALabels, setTALabels] = useState(
    therapeuticAreaOptions.reduce((acc, curr) => {
      acc[curr] = curr === 'Oncology' ? ['Line 1', 'Line 2', 'Line 3+'] : ['Base', 'Downside', 'Upside'];
      return acc;
    }, {})
  );
  const [Mode, setMode] = useState('Dashboard');
  const [text, setText] = useState({
    'T1-1.base': 'US Census',
    'T1-1.downside': 'US Census',
    'T1-1.upside': 'US Census',
    'T1-4.base': 'CDC',
    'T1-4.downside': 'CDC',
    'T1-4.upside': 'CDC'
  });
  const [text2, setText2] = useState({
    'T1-1.base': 'https://www.census.gov/data-tools/demo/idb/#/pop?COUNTRY_YEAR=2023&COUNTRY_YR_ANIM=2023&menu=popViz&popPages=BYAGE&CCODE_SINGLE=US&CCODE=FR,DE,IT,ES,GB,US&POP_YEARS=2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032',
    'T1-1.downside': 'https://www.census.gov/data-tools/demo/idb/#/pop?COUNTRY_YEAR=2023&COUNTRY_YR_ANIM=2023&menu=popViz&popPages=BYAGE&CCODE_SINGLE=US&CCODE=FR,DE,IT,ES,GB,US&POP_YEARS=2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032',
    'T1-1.upside': 'https://www.census.gov/data-tools/demo/idb/#/pop?COUNTRY_YEAR=2023&COUNTRY_YR_ANIM=2023&menu=popViz&popPages=BYAGE&CCODE_SINGLE=US&CCODE=FR,DE,IT,ES,GB,US&POP_YEARS=2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032',
    'T1-4.base': 'CDC',
    'T1-4.downside': 'CDC',
    'T1-4.upside': 'CDC'
  });
  const [rows, setRows] = useState([]); // State to track table rows
  const [showTable, setShowTable] = useState(false); // Controls table visibility
  const [storeValues, setStoreValues] = useState({});
  const initialProducts1 = [
    { id: 'T1-1', name: 'US Population(14-49 years)', type: 'value' },
    { id: 'T1-2', name: 'Prevalence Rate', type: '%' },
    { id: 'T1-3', name: 'Prevalence of STD Patients', type: 'value' },
    { id: 'T1-4', name: 'Diagnosis  Rate', type: '%' },
    { id: 'T1-5', name: 'Diagnosed STD Patients', type: 'value' },
    { id: 'T1-6', name: 'Treatment Rate', type: '%' },
    { id: 'T1-7', name: 'Treated STD Patients', type: 'value' }
  ];
  const initialProducts2 = [
    { id: 'T2-1', name: 'Patients on Chronic Therapy', type: '%' },
    { id: 'T2-2', name: 'Patients on Episodic Therapy', type: '%' },
    // { id: 'T2-3', name: 'Patients on No Treatment', type: '%' },
    { id: 'T2-3', name: 'Patients on Chronic Therapy(#)', type: 'value' },
    { id: 'T2-4', name: 'Patients on Episodic Therapy(#)', type: 'value' },
    // { id: 'T2-6', name: 'Patients on No Treatment(#)', type: 'value' },
    { id: 'T2-5', name: 'Total STD Patients', type: 'value' },
    { id: 'T2-6', name: 'Product A - Chronic Therapy(market share)', type: '%' },
    { id: 'T2-7', name: 'Product A - Episodic Therapy(market share)', type: '%' },
    { id: 'T2-8', name: 'Patients on Chronic Therapy(pre Compliance)', type: 'value' },
    { id: 'T2-9', name: 'Patients on Episodic Therapy(pre Compliance)', type: 'value' }

  ];
  const initialProducts3 = [
    { id: 'T3-1', name: 'Compliance - Chronic Therapy', type: '%' },
    { id: 'T3-2', name: 'Market Access - Chronic Therapy', type: '%' },
    { id: 'T3-3', name: 'Patients on Product A (post Compliance) and market access- Chronic Therapy', type: 'value' },
    { id: 'T3-4', name: 'Compliance - Episodic Therapy', type: '%' },
    { id: 'T3-5', name: 'Market Access - Episodic Therapy', type: '%' },
    { id: 'T3-6', name: 'Patients on Product A (post Compliance) and market access- Episodic Therapy', type: 'value' },
    { id: 'T3-7', name: 'Total Patients (Chronic + Episodic)', type: 'value' },
    { id: 'T3-8', name: 'US Price', type: 'value' },
    { id: 'T3-9', name: timePeriod === 'Yearly' ? 'Price Change (Y-o-Y)' : 'Price Change (M-o-M)', type: '%' },
    { id: 'T3-10', name: 'Revenue - Chronic Therapy', type: 'value' },
    { id: 'T3-11', name: 'Revenue - Episodic Therapy', type: 'value' },
    { id: 'T3-12', name: 'Total Revenue', type: 'value' }
  ];

  const initialProducts = {
    downside: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
    base: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
    upside: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
  };
  const combinedProducts = [...initialProducts1, ...initialProducts2, ...initialProducts3];
  const combinedProductsForInput = [
    { id: 'T1-1', name: 'US Population(14-49 years)', type: 'value' },
    { id: 'T1-2', name: 'Prevalence Rate', type: '%' },
    { id: 'T1-4', name: 'Diagnosis Rate', type: '%' },
    { id: 'T1-6', name: 'Treatment Rate', type: '%' },
    { id: 'T2-1', name: 'Patients on Chronic Therapy', type: '%' },
    { id: 'T2-2', name: 'Patients on Episodic Therapy', type: '%' },
    // { id: 'T2-3', name: 'Patients on No Treatment', type: '%' },
    { id: 'T2-6', name: 'Product A - Chronic Therapy(market share)', type: '%' },
    { id: 'T2-7', name: 'Product A - Episodic Therapy(market share)', type: '%' },
    { id: 'T3-1', name: 'Compliance - Chronic Therapy', type: '%' },
    { id: 'T3-2', name: 'Market Access - Chronic Therapy', type: '%' },
    { id: 'T3-4', name: 'Compliance - Episodic Therapy', type: '%' },
    { id: 'T3-5', name: 'Market Access - Episodic Therapy', type: '%' },
    { id: 'T3-8', name: 'US Price', type: 'value' },
    { id: 'T3-9', name: timePeriod === 'Yearly' ? 'Price Change (Y-o-Y)' : 'Price Change (M-o-M)', type: '%' },

  ];
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
  const [defaultvalues, setDefaultValues] = useState({});
  const [defaultvalues2, setDefaultValues2] = useState({});
  const [defaultvalues3, setDefaultValues3] = useState({});
  const [cardTitle1, setCardTitle1] = useState('Epidemiology');
  const [cardTitle2, setCardTitle2] = useState('Market Landscape');
  const [cardTitle3, setCardTitle3] = useState('Conversion Parameter & Revenue');
  const [dropdownGroups, setDropdownGroups] = useState([
    { Case: "base", SelectedCard: "table3", SelectedRow: "T3-12" },
    { Case: "downside", SelectedCard: "table3", SelectedRow: "T3-12" },
    { Case: "upside", SelectedCard: "table3", SelectedRow: "T3-12" },
  ]);
  //for KPI Page
  const [highMethodForRow, setHighMethodForRow] = useState({
    "0": "%",
    "1": "%",
    "2": "%",
    "3": "%",
    "4": "%",
    "5": "%",
    "6": "%",
  });
  const [lowMethodForRow, setLowMethodForRow] = useState({
    "0": "%",
    "1": "%",
    "2": "%",
    "3": "%",
    "4": "%",
    "5": "%",
    "6": "%",
  });
  const [editingHighPercentVal, setEditingHighPercentVal] = useState({
    "0": 15,
    "1": 13,
    "2": 12,
    "3": 11,
    "4": 10,
    "5": 9,
    "6": 4
  });
  const [editingLowPercentVal, setEditingLowPercentVal] = useState({
    "0": -12,
    "1": -10,
    "2": -12,
    "3": -11,
    "4": -10,
    "5": -9,
    "6": -3,
  });
  const [HighPercentVal, setHighPercentVal] = useState({
    "0": 15,
    "1": 13,
    "2": 12,
    "3": 11,
    "4": 10,
    "5": 9,
    "6": 4
  });
  const [LowPercentVal, setLowPercentVal] = useState({
    "0": -12,
    "1": -10,
    "2": -12,
    "3": -11,
    "4": -10,
    "5": -9,
    "6": -3,
  });
  const [dropdownGroupKPI, setDropdownGroupKPI] = useState([
    { Case: "base", OutputMetric: "T3-12", Field: "T1-2" },
    { Case: "base", OutputMetric: "T3-12", Field: "T1-4" },
    { Case: "base", OutputMetric: "T3-12", Field: "T2-1" },
    { Case: "base", OutputMetric: "T3-12", Field: "T2-6" },
    { Case: "base", OutputMetric: "T3-12", Field: "T3-1" },
    { Case: "base", OutputMetric: "T3-12", Field: "T3-2" },
    { Case: "base", OutputMetric: "T3-12", Field: "T3-8" },
  ]);

  //for Waterfall page
  const [MethodForRow, setMethodForRow] = useState({
    "0": "%",
    "1": "%",
   


  });
  const [editingPercentVal, setEditingPercentVal] = useState({
    "0": 46.59,
    "1": 7.6,
  });
  const [PercentVal, setPercentVal] = useState({
    "0": 46.59,
    "1": 7.6,
  });
  const [dropdownGroupsW, setDropdownGroupsW] = useState([
    { Case: "base", OutputMetric: "T3-12", Field: "T2-6" },
    { Case: "base", OutputMetric: "T3-12", Field: "T3-8" },

  ]);
  const [showTabs, setShowTabs] = useState(false);

  const [countries, setCountries] = React.useState([]);
  const [therapeuticAreas, setTherapeuticAreas] = React.useState([]);
  const [forecastCycles, setForecastCycles] = React.useState([]);
  const [tutHome, setTutHome] = useState(true);

  const [rowsData, setRowsData] = useState([
    {
      country: "Sweden",
      currentForecastStatus: "Ongoing",
      forecast: "Forecast 1",
      forecastScenario: "H2 - 2023",
      forecastStarted: "2024-11-10",
      therapeuticArea: "Cardiology",
      username: "Michael Wang",
      worksheet: "Output Sheet",
    },
    {
      country: "Spain",
      currentForecastStatus: "Pending",
      forecast: "Forecast 1",
      forecastScenario: "H1 - 2023",
      forecastStarted: "2024-04-25",
      therapeuticArea: "HIV",
      username: "John Doe",
      worksheet: "Output Sheet",
    },
    {
      country: "US",
      currentForecastStatus: "Submitted",
      forecast: "Forecast 1",
      forecastScenario: "H2 - 2024",
      forecastStarted: "2024-09-08",
      therapeuticArea: "Cardiology",
      username: "Jane Smith",
      worksheet: "Output Sheet",
    },
  ]);

  const [Formulas, setFormulas] = useState(() => {
    const formulas = {};
    Object.keys(products).forEach((tabKey) => {
      formulas[tabKey] = Object.keys(products[tabKey]).reduce((acc, tableKey) => {
        acc[tableKey] = products[tabKey][tableKey].reduce((acc2, row) => {
          acc2[row.id] = { emptyArray: [""], plusArray: ["+"], cases: [tabKey] };
          return acc2;
        }, {});
        return acc;
      }, {});
    });
    return formulas;
  });

  const [editingFormula, setEditingFormula] = useState({ ...Formulas });

  useEffect(() => {
    setFromHistoricalDate(dayjs('2018'));
    setFromForecastDate(dayjs('2025'));
    setToForecastDate(dayjs('2032'));
    fetch('/values.json')
      .then(response => response.json())
      // .then(data => setValues(data));
      .then(data => setDefaultValues(data));
    fetch('/values2.json')
      .then(response => response.json())
      // .then(data => setValues2(data));
      .then(data => setDefaultValues2(data));
    fetch('/values3.json')
      .then(response => response.json())
      // .then(data => setValues3(data));
      .then(data => setDefaultValues3(data));
  }, []);
  useEffect(() => {
    const formulasDemo = { ...Formulas };
    Object.keys(formulasDemo).forEach((tabKey) => {
      formulasDemo[tabKey]["table1"]['T1-3'] = { emptyArray: ['T1-1', 'T1-2'], plusArray: ['+', '*'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table1"]['T1-5'] = { emptyArray: ['T1-3', 'T1-4'], plusArray: ['+', '*',], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table1"]['T1-7'] = { emptyArray: ['T1-5', 'T1-6'], plusArray: ['+', '*',], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table2"]['T2-3'] = { emptyArray: ['T1-5', 'T2-1'], plusArray: ['+', '*'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table2"]['T2-4'] = { emptyArray: ['T1-5', 'T2-2'], plusArray: ['+', '*'], cases: [tabKey, tabKey] };
      // formulasDemo[tabKey]["table2"]['T2-6'] = { emptyArray: ['T1-5', 'T2-3'], plusArray: ['+', '*'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table2"]['T2-5'] = { emptyArray: ['T2-4', 'T2-3'], plusArray: ['+', '+'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table2"]['T2-8'] = { emptyArray: ['T2-3', 'T2-6'], plusArray: ['+', '*'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table2"]['T2-9'] = { emptyArray: ['T2-4', 'T2-7'], plusArray: ['+', '*'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table3"]['T3-3'] = { emptyArray: ['T3-1', 'T3-2', 'T2-8'], plusArray: ['+', '*', '*'], cases: [tabKey, tabKey, tabKey, tabKey] };
      formulasDemo[tabKey]["table3"]['T3-6'] = { emptyArray: ['T3-4', 'T3-5', 'T2-9'], plusArray: ['+', '*', '*'], cases: [tabKey, tabKey, tabKey, tabKey] };
      formulasDemo[tabKey]["table3"]['T3-7'] = { emptyArray: ['T3-3', 'T3-6'], plusArray: ['+', '+'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table3"]['T3-10'] = { emptyArray: ['T3-3', 'T3-8'], plusArray: ['+', '*'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table3"]['T3-11'] = { emptyArray: ['T3-6', 'T3-8'], plusArray: ['+', '*'], cases: [tabKey, tabKey] };
      formulasDemo[tabKey]["table3"]['T3-12'] = { emptyArray: ['T3-10', 'T3-11'], plusArray: ['+', '+'], cases: [tabKey, tabKey] };
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
      defaultvalues, setDefaultValues,
      defaultvalues2, setDefaultValues2,
      defaultvalues3, setDefaultValues3,
      cardTitle1, setCardTitle1,
      cardTitle2, setCardTitle2,
      cardTitle3, setCardTitle3,
      LowPercentVal, setLowPercentVal,
      HighPercentVal, setHighPercentVal,
      editingLowPercentVal, setEditingLowPercentVal,
      editingHighPercentVal, setEditingHighPercentVal,
      highMethodForRow, setHighMethodForRow,
      lowMethodForRow, setLowMethodForRow,
      combinedProducts,
      combinedProductsForInput,
      dropdownGroups, setDropdownGroups,
      dropdownGroupKPI, setDropdownGroupKPI,
      editingPercentVal, setEditingPercentVal,
      MethodForRow, setMethodForRow,
      PercentVal, setPercentVal,
      dropdownGroupsW, setDropdownGroupsW,
      showTabs, setShowTabs,
      timePeriod, setTimePeriod,
      countries, setCountries,
      therapeuticAreas, setTherapeuticAreas,
      forecastCycles, setForecastCycles,
      forecastCycle, setForecastCycle,
      Formulas, setFormulas,
      editingFormula, setEditingFormula,
      rowsData, setRowsData,
      text, setText,
      text2, setText2,
      storeValues, setStoreValues,
      tutHome, setTutHome,
      rows, setRows,
      showTable, setShowTable,
      Mode, setMode,
      therapeuticArea, setTherapeuticArea,
      caseTypeLabels, setCaseTypeLabels,
      caseTypeLabelsOnco, setCaseTypeLabelsOnco,
      TALabels, setTALabels,
      therapeuticAreaOptions,
    }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyProvider, MyContext };