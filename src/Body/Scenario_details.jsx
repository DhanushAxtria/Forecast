import React, { useCallback, useState, useEffect, useContext } from 'react';
import introJs from 'intro.js';
import ReactFlow, {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    MarkerType,
} from 'react-flow-renderer';
import './ModelFlow.scss'; // Custom CSS for fixed headers and styling
import './SavedScenario.scss'; // Control Sheet styling
import dayjs from 'dayjs'; // For date manipulation
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {
    Grid, Button, TextField, MenuItem, Typography, IconButton, Dialog, DialogActions,
    DialogContent, DialogTitle, Tooltip,
    Box, ListItemIcon, List, ListItem, ListItemText
} from '@mui/material';
import ApplyIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdjustIcon from '@mui/icons-material/Adjust';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { MyContext } from './context';

import InputAdornment from '@mui/material/InputAdornment';  // Close icon for indications
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Patient_Forecast_Input from './Patient_Forecast_Input';
import Header from '../Header/Header'
import { set } from 'date-fns';
import { useLocation } from 'react-router-dom';



const initialNodes = [
    { id: '1', data: { label: 'Product Level Treated Patients' }, position: { x: 250, y: 50 }, style: { width: 200 } },
    { id: '2', data: { label: 'Patients per product (based on trending)' }, position: { x: 250, y: 150 }, style: { width: 250 } },
    { id: '3', data: { label: 'Final patients per product (post events)' }, position: { x: 250, y: 250 }, style: { width: 250 } },
    { id: '4', data: { label: 'Compliant units' }, position: { x: 250, y: 350 }, style: { width: 150 } },
    { id: '5', data: { label: 'Dosage' }, position: { x: 600, y: 150 }, style: { width: 150 } },
    { id: '6', data: { label: 'Compliance %' }, position: { x: 600, y: 250 }, style: { width: 150 } },
    { id: '7', data: { label: 'Extra Molecular Usage' }, position: { x: 600, y: 350 }, style: { width: 200 } },
    { id: '8', data: { label: 'Patient Stocking Adjustments' }, position: { x: 600, y: 450 }, style: { width: 250 } },
    { id: '9', data: { label: 'Seasonality Adjustments' }, position: { x: 600, y: 550 }, style: { width: 200 } },
    { id: '10', data: { label: 'Overall Adjustment factor (calculated)' }, position: { x: 250, y: 450 }, style: { width: 250 } },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-3', source: '2', target: '3', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e4-10', source: '4', target: '10', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e10-5', source: '10', target: '5', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e5-6', source: '5', target: '6', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e6-7', source: '6', target: '7', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e7-8', source: '7', target: '8', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e8-9', source: '8', target: '9', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
];
const defaultProducts = [
    { id: 1, name: 'Product1', include: true, xyzProduct: true, launchDate: dayjs('2014-02-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'No', 'Indication 3': 'Yes' } },
    { id: 2, name: 'Product2', include: true, xyzProduct: true, launchDate: dayjs('2017-02-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'No' } },
    { id: 3, name: 'Product3', include: false, xyzProduct: false, launchDate: dayjs('2019-06-01'), indications: { 'Indication 1': 'No', 'Indication 2': 'Yes', 'Indication 3': 'Yes' } },
    { id: 4, name: 'Product4', include: true, xyzProduct: true, launchDate: dayjs('2020-03-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'No', 'Indication 3': 'Yes' } },
    { id: 5, name: 'Product5', include: true, xyzProduct: false, launchDate: dayjs('2016-11-01'), indications: { 'Indication 1': 'No', 'Indication 2': 'No', 'Indication 3': 'Yes' } },
    { id: 6, name: 'Product6', include: false, xyzProduct: true, launchDate: dayjs('2018-01-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'No' } },
];
const defaultIndicationColumns = ['Indication 1', 'Indication 2', 'Indication 3'];

const ForecastAndFlowDiagram = (props) => {
    const location = useLocation();
    const scenario = location.state?.scenario;
    const { fromHistoricalDate, setFromHistoricalDate, fromForecastDate, setFromForecastDate, toForecastDate, setToForecastDate, timePeriod, setTimePeriod, caseTypeLabelsOnco, setCaseTypeLabelsOnco} = useContext(MyContext);
    const { hasUnsavedChanges, setHasUnsavedChanges } = props;
    console.log(scenario);
    const [isProductListVisible, setIsProductListVisible] = useState(false);
    const toggleProductListVisibility = () => {
        setIsProductListVisible((prev) => !prev);
    };
    const [greeting, setGreeting] = useState('');
    const [activeTab, setActiveTab] = useState('controlSheet'); // Manage which tab is active
    // Selected predefined scenario
    //const [activeTab, setActiveTab] = useState(0);
    const [customScenarioName, setCustomScenarioName] = useState('');
    const [forecastEndMonth, setForecastEndMonth] = useState(dayjs());
    // Control sheet form states
    const [historicalStartMonth, setHistoricalStartMonth] = useState(dayjs('2015-01-01'));
    const [forecastStartMonth, setForecastStartMonth] = useState(dayjs());
    const [forecastMetric, setForecastMetric] = useState('Patients');
    const [currency, setCurrency] = useState('USD');
    const [forecastCycle, setForecastCycle] = useState(scenario?.forecastScenario ? scenario.forecastScenario : '');
    const [country, setCountry] = useState(scenario?.country ? scenario.country : '');
    const [isProductTableCollapsed, setIsProductTableCollapsed] = useState(false);
    //const [therapeuticArea, setTherapeuticArea] = useState(scenario?.therapeuticArea ? scenario.therapeuticArea : '');
    const { therapeuticArea, setTherapeuticArea } = useContext(MyContext);
    const { caseTypeLabels, setCaseTypeLabels } = useContext(MyContext);
    const [showHistoricalCalendar, setShowHistoricalCalendar] = useState(false);
    const [showForecastCalendar, setShowForecastCalendar] = useState(false);
    const [historicalView, setHistoricalView] = useState('year'); // Track the view state
    const [forecastView, setForecastView] = useState('year'); // Track the view state
    const [openProductCalendars, setOpenProductCalendars] = useState({});//lauch date
    //const [scenarioName, setScenarioName] = useState(predefinedScenarioNames[0]);
    const [previousScenarioProducts, setPreviousScenarioProducts] = useState([]);
    const [parameters, setParameters] = useState([
        {
            name: '', // Name of the parameter
            rows: [
                { type: 'Downside', values: [] },
                { type: 'Base', values: [] },
                { type: 'Upside', values: [] },
            ],
        },
    ]);
    useEffect(() => {
        console.log(fromHistoricalDate);

    }, [fromHistoricalDate])


    //const [scenarioName, setScenarioName] = useState(predefinedScenarioNames[0]);
    const [indicationColumns, setIndicationColumns] = useState(defaultIndicationColumns);
    //const [editMode, setEditMode] = useState(false); // Track if edit is enabled
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [tempScenarioDetails, setTempScenarioDetails] = useState(); // Temp storage for edit text
    const folder = location.state?.folder;

    const [editMode, setEditMode] = useState(false);
    const [products, setProducts] = useState(defaultProducts);
    const [isInputTableCollapsed, setIsInputTableCollapsed] = useState(false);
    const [timePeriods, setTimePeriods] = useState([]);
    //const [indicationColumns, setIndicationColumns] = useState(['Indication 1', 'Indication 2', 'Indication 3', 'Indication 4']);
    //const [indicationColumns, setIndicationColumns] = useState([]);
    const predefinedScenarioNames = ['Scenario 1', 'Scenario 2', 'Scenario 3'];
    const therapeuticAreaOptions = ['Cardiology', 'Oncology', 'Neurology', 'Immunology', 'Dermatology', 'HIV'];
    const countryOptions = ['Iceland', 'Germany', 'UK', 'Finland', 'France', 'Italy', 'Spain', 'Denmark', 'Norway', 'Sweden'];
    const currencies = {
        "Iceland": "ISK",
        "Germany": "EUR",
        "UK": "GBP",
        "Finland": "EUR",
        "France": "EUR",
        "Italy": "EUR",
        "Spain": "EUR",
        "Denmark": "DKK",
        "Norway": "NOK",
        "Sweden": "SEK"
    }
    const forecastCycleOptions = ['H1 - 2023', 'H2 - 2023', 'H1 - 2024', 'H2 - 2024'];
    // State to control visibility of calendars for each product
    const [openCalendars, setOpenCalendars] = useState({});
    const currentYear = dayjs();
    useEffect(() => {
        const currentHour = new Date().getHours();
        setGreeting(currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening');
    }, []);

    const [scenarioName, setScenarioName] = useState('Scenario 1');
    const [isEditingScenarioName, setIsEditingScenarioName] = useState(false);
    const [editedScenarioName, setEditedScenarioName] = useState('');


    // Save the edited scenario name
    // Save the edited scenario name
    const handleSaveScenarioName = () => {
        setScenarioName(editedScenarioName);
        setIsEditingScenarioName(false);
    };

    // Cancel editing and revert any changes
    const handleCancelScenarioName = () => {
        setEditedScenarioName(scenarioName); // Revert changes to the original scenario name
        setIsEditingScenarioName(false);
    };

    // Handle changes to the edited scenario name
    const handleEditedScenarioNameChange = (event) => {
        setEditedScenarioName(event.target.value);
    };
    const handleForecastCycleChange = (event) => {
        setForecastCycle(event.target.value);
    };

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    };

    const handleTherapeuticAreaChange = (event) => {
        setTherapeuticArea(event.target.value);
    };



    const handleRemoveProduct = (id) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    };
    const handleRemoveIndication = (index) => {
        const indicationToRemove = indicationColumns[index];

        // Update indication columns
        setIndicationColumns((prevColumns) => prevColumns.filter((_, colIndex) => colIndex !== index));

        // Update products to remove the indication
        setProducts((prevProducts) =>
            prevProducts.map((product) => {
                const updatedIndications = { ...product.indications };
                delete updatedIndications[indicationToRemove];
                return { ...product, indications: updatedIndications };
            })
        );
    };




    const handleAddProduct = () => {
        const newProductIndications = indicationColumns.reduce((acc, indication) => {
            acc[indication] = 'Yes';
            return acc;
        }, {});
        const newProduct = {
            id: products.length + 1,
            name: `Product${products.length + 1}`,
            include: true,
            xyzProduct: true,
            launchDate: dayjs(),
            indications: newProductIndications,
        };
        setProducts([...products, newProduct]);
    };
    useEffect(() => {
        if (products.length === 0) setProducts(defaultProducts);
        if (indicationColumns.length === 0) setIndicationColumns(defaultIndicationColumns);
    }, [products, indicationColumns]);

    const handleAddIndication = () => {
        const newIndication = `Indication ${indicationColumns.length + 1}`;
        setIndicationColumns([...indicationColumns, newIndication]);

        setProducts((prevProducts) =>
            prevProducts.map((product) => ({
                ...product,
                indications: { ...product.indications, [newIndication]: 'Yes' },
            }))
        );
    };


    const handleToggleIndication = (productId, indicationKey) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId
                    ? {
                        ...product,
                        indications: {
                            ...product.indications,
                            [indicationKey]: product.indications[indicationKey] === 'Yes' ? 'No' : 'Yes',
                        },
                    }
                    : product
            )
        );
    };
    const savedScenarios = {
        'Scenario 1': {
            products: [
                { id: 1, name: 'Product1', include: true, xyzProduct: true, launchDate: dayjs('2014-02-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'Yes', 'Indication 4': 'Yes' } },
                { id: 2, name: 'Product2', include: true, xyzProduct: true, launchDate: dayjs('2017-02-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'Yes', 'Indication 4': 'Yes' } },
                { id: 3, name: 'Product3', include: true, xyzProduct: true, launchDate: dayjs('2018-04-02'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'Yes', 'Indication 4': 'Yes' } },
                { id: 4, name: 'Product4', include: true, xyzProduct: true, launchDate: dayjs('2012-02-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'Yes', 'Indication 4': 'Yes' } },
                { id: 5, name: 'Product5', include: true, xyzProduct: true, launchDate: dayjs('2015-07-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'Yes', 'Indication 4': 'Yes' } },
                { id: 6, name: 'Product6', include: true, xyzProduct: true, launchDate: dayjs('2020-02-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'Yes', 'Indication 4': 'Yes' } },




            ],
            indicationColumns: ['Indication 1', 'Indication 2', 'Indication 3', 'Indication 4']
        },
        'Scenario 2': {
            products: [
                { id: 1, name: 'ProductA', include: true, xyzProduct: false, launchDate: dayjs('2015-05-01'), indications: { 'Indication A': 'Yes', 'Indication B': 'No' } },
                { id: 2, name: 'ProductB', include: true, xyzProduct: true, launchDate: dayjs('2018-08-01'), indications: { 'Indication A': 'Yes', 'Indication B': 'Yes' } },
            ],
            indicationColumns: ['Indication A', 'Indication B']
        },
        // Add more mock scenarios if needed
    };
    useEffect(() => {
        if (savedScenarios[scenarioName]) {
            const selectedScenario = savedScenarios[scenarioName];
            setProducts(selectedScenario.products);
            setIndicationColumns(selectedScenario.indicationColumns);
        } else {
            // Explicitly set 6 products and 4 indications if no saved scenario is found
            setProducts([
                { id: 1, name: 'Product1', include: true, xyzProduct: true, launchDate: dayjs('2014-02-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'No', 'Indication 3': 'Yes', 'Indication 4': 'No' } },
                { id: 2, name: 'Product2', include: true, xyzProduct: true, launchDate: dayjs('2017-02-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'No', 'Indication 4': 'Yes' } },
                { id: 3, name: 'Product3', include: false, xyzProduct: false, launchDate: dayjs('2019-06-01'), indications: { 'Indication 1': 'No', 'Indication 2': 'Yes', 'Indication 3': 'Yes', 'Indication 4': 'No' } },
                { id: 4, name: 'Product4', include: true, xyzProduct: true, launchDate: dayjs('2020-03-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'No', 'Indication 3': 'Yes', 'Indication 4': 'No' } },
                { id: 5, name: 'Product5', include: true, xyzProduct: false, launchDate: dayjs('2016-11-01'), indications: { 'Indication 1': 'No', 'Indication 2': 'No', 'Indication 3': 'Yes', 'Indication 4': 'Yes' } },
                { id: 6, name: 'Product6', include: false, xyzProduct: true, launchDate: dayjs('2018-01-01'), indications: { 'Indication 1': 'Yes', 'Indication 2': 'Yes', 'Indication 3': 'No', 'Indication 4': 'Yes' } },
            ]);
            setIndicationColumns(['Indication 1', 'Indication 2', 'Indication 3', 'Indication 4']);
        }
    }, [scenarioName]);
    const handleIncludeChange = (id) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === id ? { ...product, include: !product.include } : product))
        );
    };
    const handleProductNameChange = (id, newName) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id ? { ...product, name: newName } : product
            )
        );
    };
    const handleIndicationChange = (productId, indicationKey, newValue) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId
                    ? {
                        ...product,
                        indications: {
                            ...product.indications,
                            [indicationKey]: newValue,
                        },
                    }
                    : product
            )
        );
    };
    const handleReviewScenario = (id) => {
        // Logic for handling review of the specific scenario
        console.log(`Review Scenario for Product ID: ${id}`);
        // Implement navigation or modal open here
    };

    const handleReviewScenarioSummary = (id) => {
        // Logic for handling review of the scenario summary
        console.log(`Review Scenario Summary for Product ID: ${id}`);
        // Implement navigation or modal open here
    };
    const handleHistoricalDateChange = (newDate) => {
        setHistoricalStartMonth(newDate);
        setHistoricalView('month'); // Switch to month view after selecting a year
    };

    const handleForecastDateChange = (newDate) => {
        setForecastStartMonth(newDate);
        setForecastView('month'); // Switch to month view after selecting a year
    };
    const handleYearClick = (isHistorical) => {
        if (isHistorical) {
            setHistoricalView('year');
        } else {
            setForecastView('year');
        }
    };
    const handleToggleView = (isHistorical) => {
        if (isHistorical) {
            setHistoricalView((prev) => (prev === 'year' ? 'month' : 'year'));
        } else {
            setForecastView((prev) => (prev === 'year' ? 'month' : 'year'));
        }
    };
    const toggleCalendar = (isHistorical) => {
        if (isHistorical) {
            setShowHistoricalCalendar((prev) => !prev);
        } else {
            setShowForecastCalendar((prev) => !prev);
        }
    };
    const handleXYZProductChange = (id) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === id ? { ...product, xyzProduct: !product.xyzProduct } : product))
        );
    };
    const toggleProductCalendar = (id) => {
        setOpenProductCalendars((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    const handleIndicationColumnChange = (index, newName) => {
        setIndicationColumns((prevColumns) =>
            prevColumns.map((col, colIndex) => (colIndex === index ? newName : col))
        );

        // Update all products to map the new indication name with the previous values
        setProducts((prevProducts) =>
            prevProducts.map((product) => {
                const oldIndicationName = indicationColumns[index]; // Get the old column name
                const newIndications = { ...product.indications };

                // Keep the Yes/No toggle under the new column name
                newIndications[newName] = newIndications[oldIndicationName];
                delete newIndications[oldIndicationName]; // Remove the old column entry

                return { ...product, indications: newIndications };
            })
        );
    };
    const handleToggleCollapse = (isInputTable) => {
        if (isInputTable) {
            setIsInputTableCollapsed(!isInputTableCollapsed);
        } else {
            setIsProductTableCollapsed(!isProductTableCollapsed);
        }
    };
    const handleLaunchDateChange = (id, date) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === id ? { ...product, launchDate: date } : product))
        );
    };
    const handleRemoveParameter = (index) => {
        setParameters((prev) => prev.filter((_, i) => i !== index));
    };
    const toggleInputTableCollapse = () => {
        setIsInputTableCollapsed(!isInputTableCollapsed);
    };
    const navigate = useNavigate();
    const handleSaveAndContinue = () => {
        navigate('/new-model/epidemiology-model/scenario-details/forecastdeepdive'); // Navigate to the patient forecast page
    };
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    useEffect(() => {
        const generateTimePeriods = () => {
            const start = dayjs(historicalStartMonth);
            const end = dayjs(forecastEndMonth);
            const months = [];
            let current = start.startOf('month');

            while (current.isBefore(end) || current.isSame(end, 'month')) {
                months.push(current.format('MMM YYYY')); // Format like "Jan 2023"
                current = current.add(1, 'month');
            }

            return months;
        };

        setTimePeriods(generateTimePeriods());
    }, [historicalStartMonth, forecastEndMonth]);
    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

    const startTour2 = () => {
        const end = introJs();
        end.setOptions({
            steps: [
                {
                    element: '.start-tour-button',
                    intro: 'You can click here to rewatch the tutorial.',
                    position: 'left'
                },
            ],
            showProgress: false, // Disable progress bar
            showStepNumbers: false,
            showBullets: false,
            nextLabel: '', // Remove "Next" button label
            prevLabel: '', // Remove "Previous" button label    
            showButtons: false, // Disable default Next/Prev buttons
        });

        end.onafterchange(() => {
            const tooltipContainer = document.querySelector('.introjs-tooltipbuttons');
            const tooltip = document.querySelector('.introjs-tooltip');
            const crossIcon = document.querySelector('.introjs-skipbutton')

            if (crossIcon) {
                Object.assign(crossIcon.style, {
                    color: "red",
                    padding: "2px",
                    marginBottom: '0px'
                })
            }
            // Remove any existing buttons in the tooltip
            if (tooltipContainer) {
                tooltipContainer.innerHTML = ''; // Clear all buttons
            }

            // Style the tooltip box
            if (tooltip) {
                Object.assign(tooltip.style, {
                    backgroundColor: '#f9f9f9',
                    color: '#333',
                    whiteSpace: 'nowrap',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: "5px",
                    maxWidth: '500px',
                    fontSize: '14px',
                    minWidth: '300px',
                    textAlign: 'center',
                });
                tooltip.style.display = 'flex';
                tooltip.style.flexDirection = 'column';
                tooltip.style.justifyContent = 'space-between';
            }
        });
        end.start();
    };

    // main tutorial
    const startTour = () => {
        const intro = introJs();
        intro.setOptions({
            steps: [
                {
                    element: '.edit-button',
                    intro: 'Clicking here allows you to change the scenario name.',
                    position: 'right',
                },
                {
                    element: '.scenario-details-button',
                    intro: 'You can use these dropdowns to change the scenario details.',
                    position: 'right',
                },
                {
                    element: '.scenario-parameters-button',
                    intro: 'You can use these dropdowns to change the scenario parameter details.',
                    position: 'right',
                },
                {
                    element: '.time-period-button',
                    intro: 'You can use these dropdowns to change the scenario time period details.',
                    position: 'top',
                },
                {
                    element: '.input-table-container',
                    intro: 'You can click on the add parameter button to add a new parameter.\nA table will be displayed to add the parameter details for each case.',
                    position: 'top',
                },
                {
                    element: '.product-indication-table-container',
                    intro: 'clicking on this button displays the product-indication table.',
                    position: 'left',
                },
                {
                    element: '.save-continue',
                    intro: 'clicking on this button saves the details and takes you to the patient forecasting page.',
                    position: 'left',
                }

            ],
            showProgress: false, // Disable progress bar
            showStepNumbers: false,
            showBullets: false,
            nextLabel: 'Next Step',
            prevLabel: 'Previous Step',
            doneLabel: 'Finished'
        });

        intro.onafterchange(() => {
            const tooltipContainer = document.querySelector('.introjs-tooltipbuttons');
            const nextButton = document.querySelector('.introjs-nextbutton');
            const prevButton = document.querySelector('.introjs-prevbutton');
            const tooltip = document.querySelector('.introjs-tooltip');
            const totalSteps = intro._options.steps.length; // Get total number of steps
            const currentStep = intro._currentStep; // Get current step index
            console.log(currentStep)
            console.log(totalSteps)

            // Remove default close button
            const crossIcon = document.querySelector('.introjs-skipbutton');
            if (crossIcon) {
                crossIcon.remove();
            }

            // Add a custom "Skip Tutorial" button
            let customSkipButton = document.querySelector('.custom-skip-button');
            if (!customSkipButton) {
                customSkipButton = document.createElement('button');
                customSkipButton.className = 'custom-skip-button';
                Object.assign(customSkipButton.style, {
                    backgroundColor: 'red',
                    fontSize: '12px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    textShadow: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    height: '20px',
                    borderRadius: '5px',
                });

                customSkipButton.onclick = () => {
                    intro.exit(); // End the current tour
                    startTour2(); // Start the second tour
                };

                if (tooltipContainer && prevButton) {
                    tooltipContainer.insertBefore(customSkipButton, prevButton.nextSibling);
                }
            }

            // Update the custom "Skip Tutorial" button text dynamically
            if (currentStep === totalSteps - 1) {
                customSkipButton.textContent = 'Close'; // Change Skip button text to "Close"
            } else {
                customSkipButton.textContent = 'Skip Tutorial'; // Reset Skip button text
            }

            if (nextButton) {
                if (currentStep === totalSteps - 1) {
                    // Disable and style the Next button on the last step
                    nextButton.disabled = true;
                    Object.assign(nextButton.style, {
                        position: 'absolute',
                        bottom: '15px',
                        right: '10px',
                        backgroundColor: 'grey',
                        color: 'white',
                        cursor: 'not-allowed',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textShadow: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        boxShadow: 'none',
                    });
                } else {
                    // Enable and style the Next button for other steps
                    nextButton.disabled = false;
                    Object.assign(nextButton.style, {
                        position: 'absolute',
                        bottom: '15px',
                        right: '10px',
                        backgroundColor: 'green',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textShadow: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        boxShadow: 'none',
                    });
                }
            }

            // Style the Previous button
            if (prevButton) {
                if (currentStep === 0) {
                    prevButton.disabled = true;
                    Object.assign(prevButton.style, {
                        backgroundColor: 'grey',
                        fontSize: '12px',
                        color: 'white',
                        marginRight: '40px',
                        fontWeight: 'bold',
                        textShadow: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                    });
                }
                else {
                    Object.assign(prevButton.style, {
                        backgroundColor: 'navy',
                        fontSize: '12px',
                        color: 'white',
                        marginRight: '40px',
                        fontWeight: 'bold',
                        textShadow: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                    })
                }
            }

            // Style the tooltip box
            if (tooltip) {
                Object.assign(tooltip.style, {
                    backgroundColor: '#f9f9f9',
                    color: '#333',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '5px',
                    maxWidth: '500px',
                    fontSize: '14px',
                    minWidth: '300px',
                    textAlign: 'center',
                });
            }
        });

        intro.start();
    };


    return (

        <div className="content">
            {activeTab === 'controlSheet' && (
                <>
                    <Box sx={{ display: 'flex', padding: '20px', flexDirection: 'column', marginTop: '-35px', paddingBottom: '40px' }} >
                        <Button
                            variant="contained"
                            size='small'
                            sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 3, mr: 2 }}
                            onClick={startTour}
                            className="start-tour-button"
                        >
                            Show Tutorial
                        </Button>
                        <h2 className="greeting">{greeting}, Welcome to the Forecast & Worksheet Selections</h2>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <h2>General Information</h2>
                                {/* Align Forecast Cycle, Country, and Therapeutic Area side by side */}
                                <Grid container spacing={2}>
                                    <Box display="flex" alignItems="center" gap="15px" ml={2} p={2}>
                                        <TextField
                                            size="small"

                                            label="Scenario Name"
                                            value={isEditingScenarioName ? editedScenarioName : scenarioName}
                                            onChange={handleEditedScenarioNameChange} // Update value during editing
                                            variant="outlined"
                                            margin="normal"
                                            InputProps={{
                                                endAdornment: isEditingScenarioName ? (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="Save Scenario Name"
                                                            onClick={handleSaveScenarioName}
                                                            color="primary"
                                                        >
                                                            <CheckIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            aria-label="Cancel Edit Scenario Name"
                                                            onClick={handleCancelScenarioName}
                                                            color="secondary"
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ) : (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="Edit Scenario Name"
                                                            onClick={() => {
                                                                setIsEditingScenarioName(true);
                                                                setEditedScenarioName(scenarioName); // Initialize with the current value
                                                            }}
                                                        >
                                                            <EditIcon className='edit-button' />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                readOnly: !isEditingScenarioName, // Set input as read-only unless editing
                                            }}
                                        />
                                        <Box className="scenario-details-button">
                                            <TextField
                                                select
                                                size="small"
                                                sx={{ width: '200px', mr: 2 }}
                                                label="Forecast Cycle"
                                                value={forecastCycle}
                                                onChange={handleForecastCycleChange}
                                                variant="outlined"
                                                margin="normal"

                                            >
                                                {forecastCycleOptions.map((cycle) => (
                                                    <MenuItem key={cycle} value={cycle}>
                                                        {cycle}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                select
                                                size="small"
                                                sx={{ width: '200px', mr: 2 }}
                                                label="Country"
                                                value={country}
                                                onChange={handleCountryChange}
                                                variant="outlined"
                                                margin="normal"

                                            >
                                                {countryOptions.map((countryName) => (
                                                    <MenuItem key={countryName} value={countryName}>
                                                        {countryName}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            <TextField
                                                select
                                                size="small"
                                                sx={{ width: '200px' }}
                                                label="Therapeutic Area"
                                                value={therapeuticArea}
                                                onChange={handleTherapeuticAreaChange}
                                                variant="outlined"
                                                margin="normal"

                                            >
                                                {therapeuticAreaOptions.map((area) => (
                                                    <MenuItem key={area} value={area}>
                                                        {area}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* Scenario Parameters Section */}
                        <Grid container spacing={2} >
                            <Grid item xs={12}>
                                <h2>Scenario Parameters</h2>
                            </Grid>
                            <Box display="flex" alignItems="center" ml={2} p={2} className="scenario-parameters-button">

                                <TextField
                                    select
                                    size="small"
                                    sx={{ width: '200px', mr: 2 }}
                                    value={forecastMetric}
                                    onChange={(e) => setForecastMetric(e.target.value)}
                                    label="Forecast Metric"
                                    variant="outlined"
                                >
                                    <MenuItem value="Patients">Patients</MenuItem>
                                    <MenuItem value="Units">Units</MenuItem>
                                </TextField>


                                <TextField
                                    select
                                    size="small"
                                    sx={{ width: '200px' }}
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    label="Currency"
                                    variant="outlined"
                                >
                                    <MenuItem value="local">{currencies[country]}</MenuItem>
                                    <MenuItem value="USD">USD</MenuItem>

                                </TextField>

                            </Box>
                        </Grid>
                        <Grid container spacing={2} >


                            <Box display="flex" alignItems="center" mt={2} ml={2} p={2} className="time-period-button">
                                {/* Time Period Selection */}
                                <TextField
                                    select
                                    label="Time Period"
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(e.target.value)}
                                    size="small"
                                    variant="outlined"
                                    sx={{ width: '200px', mr: 2 }}
                                >
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                    <MenuItem value="Yearly">Yearly</MenuItem>
                                </TextField>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                        label={timePeriod === 'Monthly' ? 'Historical Start Month' : 'Historical Start Year'}
                                        value={fromHistoricalDate}
                                        onChange={(newValue) => setFromHistoricalDate(newValue)}
                                        format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                        slotProps={{ textField: { size: 'small' } }}
                                        sx={{ width: '200px', mr: 2 }}
                                        maxDate={toForecastDate}
                                    />
                                    <DatePicker
                                        views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                        label={timePeriod === 'Monthly' ? 'Forecast Start Month' : 'Forecast Start Year'}
                                        value={fromForecastDate}
                                        onChange={(newValue) => setFromForecastDate(newValue)}
                                        format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                        slotProps={{ textField: { size: 'small' } }}
                                        sx={{ width: '200px', mr: 2 }}
                                        minDate={fromHistoricalDate}
                                    />
                                    <DatePicker
                                        views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                        label={timePeriod === 'Monthly' ? 'Forecast End Month' : 'Forecast End Year'}
                                        value={toForecastDate}
                                        onChange={(newValue) => setToForecastDate(newValue)}
                                        format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                        slotProps={{ textField: { size: 'small' } }}
                                        sx={{ width: '200px', mr: 2 }}
                                        minDate={fromForecastDate}
                                    />
                                </LocalizationProvider>
                            </Box>

                            {/* Dynamic Case Type Labels Input */}
                            <Box display="flex" flexDirection="row" mt={2} ml={2} p={2}>
                                {caseTypeLabels.map((label, index) => (
                                    <TextField
                                        key={index}
                                        label={`Label ${index + 1}`}
                                        variant="outlined"
                                        size="small"
                                        value={therapeuticArea === 'Oncology'? caseTypeLabelsOnco[index] : caseTypeLabels[index]}
                                        onChange={(e) => {
                                            const updatedLabels = [...therapeuticArea === 'Oncology'? caseTypeLabelsOnco : caseTypeLabels];
                                            updatedLabels[index] = e.target.value;
                                            therapeuticArea === 'Oncology'? setCaseTypeLabelsOnco(updatedLabels) : setCaseTypeLabels(updatedLabels);
                                        }}
                                        sx={{ width: '200px', mr: 2, mb: 1 }}
                                    />
                                ))}
                            </Box>
                        </Grid>
                        <Box>
                            <Grid item xs={12}>
                                <h2>Input Table</h2>
                            </Grid>
                            <Box className="input-table-container">
                                <Patient_Forecast_Input />
                            </Box>
                        </Box>

                        <div className="section">
                            <h2>Product List</h2>
                            <Box display="flex" justifyContent={'flex-end'}  >
                                <Button
                                    variant="outlined"
                                    size='small'
                                    startIcon={isProductListVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    onClick={toggleProductListVisibility}
                                    className='product-indication-table-container'

                                >
                                    {isProductListVisible ? 'Collapse' : 'Expand'}
                                </Button>
                            </Box>


                            {isProductListVisible && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddProduct}
                                        style={{ marginRight: '10px' }}
                                    >
                                        + Add Product
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddIndication}
                                    >
                                        + Add Indication
                                    </Button>
                                    <div style={{ maxHeight: '400px', overflowX: 'auto', overflowY: 'auto', marginTop: '10px' }}>
                                        <table className="product-table" style={{ minWidth: indicationColumns.length > 2 ? '150%' : '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th>S No.</th>
                                                    <th>Product</th>
                                                    <th>Include?</th>
                                                    <th>XYZ Product?</th>
                                                    <th>Launch Date</th>
                                                    {indicationColumns.map((indication, index) => (
                                                        <th key={index}>
                                                            <TextField
                                                                value={indication}
                                                                onChange={(e) => handleIndicationColumnChange(index, e.target.value)}
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{ width: '200px' }}
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                onClick={() => handleRemoveIndication(index)}
                                                                                size="small"
                                                                                color="error"
                                                                            >
                                                                                <CloseIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((product, productIndex) => (
                                                    <tr key={product.id}>
                                                        <td>{productIndex + 1}</td>
                                                        <td>
                                                            <TextField
                                                                value={product.name}
                                                                onChange={(e) => handleProductNameChange(product.id, e.target.value)}
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{ width: '200px' }}
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                onClick={() => handleRemoveProduct(product.id)}
                                                                                size="small"
                                                                                color="error"
                                                                            >
                                                                                <DeleteIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="outlined"
                                                                className={`toggle-btn ${product.include ? 'yes' : 'no'}`}
                                                                onClick={() => handleIncludeChange(product.id)}
                                                            >
                                                                {product.include ? 'Yes' : 'No'}
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="outlined"
                                                                className={`toggle-btn ${product.xyzProduct ? 'yes' : 'no'}`}
                                                                onClick={() => handleXYZProductChange(product.id)}
                                                            >
                                                                {product.xyzProduct ? 'Yes' : 'No'}
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DatePicker
                                                                    maxDate={currentYear}
                                                                    openTo="year"
                                                                    views={['year', 'month']}
                                                                    value={product.launchDate}
                                                                    onChange={(newDate) => handleLaunchDateChange(product.id, newDate)}
                                                                    slotProps={{ textField: { size: 'small' } }}
                                                                    sx={{ width: '200px' }}
                                                                />
                                                            </LocalizationProvider>
                                                        </td>
                                                        {indicationColumns.map((indication, index) => (
                                                            <td key={index}>
                                                                <Button
                                                                    variant="outlined"
                                                                    className={`toggle-btn ${product.indications[indication] === 'Yes' ? 'yes' : 'no'}`}
                                                                    onClick={() => handleToggleIndication(product.id, indication)}
                                                                >
                                                                    {product.indications[indication]}
                                                                </Button>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'fixed',
                        bottom: 0,
                        right: 10,
                        padding: '10px',
                        zIndex: 10,
                    }}>
                        <Button
                            variant="contained"
                            color="success"
                            className="save-continue" // Apply the custom CSS class
                            startIcon={<ApplyIcon />}
                            onClick={handleSaveAndContinue}
                        >
                            Save & Continue
                        </Button>
                    </Box>
                </>
            )}
        </div>

    )
}
export default ForecastAndFlowDiagram;
