import React, { useCallback, useState, useEffect } from 'react';
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
import { Grid, Button, TextField, MenuItem, Typography, IconButton } from '@mui/material';
import ApplyIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

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

const ForecastAndFlowDiagram = () => {
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
    const [currency, setCurrency] = useState('EUR');
    const [forecastCycle, setForecastCycle] = useState('2024-H1');
    const [country, setCountry] = useState('USA');
    const [therapeuticArea, setTherapeuticArea] = useState('Oncology');
    const [showHistoricalCalendar, setShowHistoricalCalendar] = useState(false);
    const [showForecastCalendar, setShowForecastCalendar] = useState(false);
    const [historicalView, setHistoricalView] = useState('year'); // Track the view state
    const [forecastView, setForecastView] = useState('year'); // Track the view state
    const [openProductCalendars, setOpenProductCalendars] = useState({});//lauch date
    //const [scenarioName, setScenarioName] = useState(predefinedScenarioNames[0]);
    const [previousScenarioProducts, setPreviousScenarioProducts] = useState([]);
    //const [scenarioName, setScenarioName] = useState(predefinedScenarioNames[0]);
    const [indicationColumns, setIndicationColumns] = useState(defaultIndicationColumns);
    const location = useLocation();
    const [scenarioDetails, setScenarioDetails] = useState('Custom Scenario Details');
    //const [editMode, setEditMode] = useState(false); // Track if edit is enabled
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [tempScenarioDetails, setTempScenarioDetails] = useState(scenarioDetails); // Temp storage for edit text
    const folder = location.state?.folder;
    //const [scenarioDetails, setScenarioDetails] = useState('Custom Scenario Details');
    const [editMode, setEditMode] = useState(false);
    const [products, setProducts] = useState(defaultProducts);

    //const [indicationColumns, setIndicationColumns] = useState(['Indication 1', 'Indication 2', 'Indication 3', 'Indication 4']);
    //const [indicationColumns, setIndicationColumns] = useState([]);
    const predefinedScenarioNames = ['Scenario 1', 'Scenario 2', 'Scenario 3'];
    // State to control visibility of calendars for each product
    const [openCalendars, setOpenCalendars] = useState({});
    const currentYear = dayjs();
    useEffect(() => {
        const currentHour = new Date().getHours();
        setGreeting(currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening');
    }, []);
    const handleEditToggle = () => {
        setTempScenarioDetails(scenarioDetails); // Set current details to the input field
        setIsModalOpen(true); // Open the modal
    };
    const handleSaveScenarioDetails = () => {
        setScenarioDetails(tempScenarioDetails); // Update scenario details
        setIsModalOpen(false); // Close the modal
    };
    const handleCancelEdit = () => {
        setTempScenarioDetails(scenarioDetails); // Reset temp details to original
        setIsModalOpen(false); // Close the modal
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
    const [scenarioName, setScenarioName] = useState(predefinedScenarioNames[0]);
    const handleScenarioChange = (event) => {
        setScenarioName(event.target.value);
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
    const handleLaunchDateChange = (id, date) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === id ? { ...product, launchDate: date } : product))
        );
    };
    const navigate = useNavigate();
    const handleSaveAndContinue = () => {
        navigate('/Inputpage'); // Navigate to the input page
    };
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

    return (
        <div className="container">
            {activeTab === 'controlSheet' && (
                <div className='fixedApplyDiv'>
                    <Button
                        variant="contained"
                        className="fixed-apply-button" // Apply the custom CSS class
                        startIcon={<ApplyIcon />}
                        onClick={handleSaveAndContinue}
                    >
                        Save & Continue
                    </Button>
                </div>

            )}

            <div className="content">
                {activeTab === 'controlSheet' && (
                    <>
                        <h1 className="greeting">{greeting}, Welcome to the Forecast & Worksheet Selections</h1>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <h2>General Information</h2>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Scenario Name"
                                            value={scenarioName}
                                            onChange={handleScenarioChange}
                                            variant="outlined"
                                        >
                                            {predefinedScenarioNames.map((name, index) => (
                                                <MenuItem key={index} value={name}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={5}>
                                        {editMode ? (
                                            <TextField
                                                fullWidth
                                                label="Scenario Details"
                                                value={scenarioDetails}
                                                onChange={(e) => setScenarioDetails(e.target.value)}
                                                variant="outlined"
                                            />
                                        ) : (
                                            <TextField
                                                fullWidth
                                                label="Scenario Details"
                                                value={scenarioDetails}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                            />
                                        )}
                                        {/* Edit Scenario Details Modal */}
                                        <Dialog open={isModalOpen} onClose={handleCancelEdit}>
                                            <DialogTitle>Edit Scenario Details</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    label="Scenario Details"
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={tempScenarioDetails}
                                                    onChange={(e) => setTempScenarioDetails(e.target.value)}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleCancelEdit} color="secondary">
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSaveScenarioDetails} color="primary">
                                                    Save
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton onClick={handleEditToggle}>
                                            <EditIcon />
                                        </IconButton>


                                    </Grid>
                                </Grid>

                                {/* Align Forecast Cycle, Country, and Therapeutic Area side by side */}
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            label="Forecast Cycle"
                                            value={forecastCycle}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            value={country}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            fullWidth
                                            label="Therapeutic Area"
                                            value={therapeuticArea}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* Scenario Parameters Section */}
                        <Grid container spacing={3} style={{ marginTop: '-20px' }}>
                            <Grid item xs={12}>
                                <h2>Scenario Parameters</h2>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    value={forecastMetric}
                                    onChange={(e) => setForecastMetric(e.target.value)}
                                    label="Forecast Metric"
                                    variant="outlined"
                                >
                                    <MenuItem value="Patients">Patients</MenuItem>
                                    <MenuItem value="Units">Units</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    label="Local Currency"
                                    variant="outlined"
                                >
                                    <MenuItem value="EUR">EUR</MenuItem>
                                    <MenuItem value="USD">USD</MenuItem>
                                    <MenuItem value="GBP">GBP</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} style={{ marginTop: '10px' }}>
                            <Grid item xs={12}>
                                <h2>Time Period</h2>
                            </Grid>
                            <Grid container spacing={3} style={{ paddingLeft: '32px   ' }}>
                                {/* Historical Start Month */}
                                <Grid item xs={4}> {/* Set each field to take up 4/12 of the row width */}
                                    <Typography variant="h6" gutterBottom>
                                        Historical Start Month
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            maxDate={currentYear}
                                            openTo="year"
                                            views={['year', 'month']}
                                            value={historicalStartMonth}
                                            onChange={(newDate) => setHistoricalStartMonth(newDate)}
                                            sx={{ minWidth: 250 }}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                {/* Forecast Start Month */}
                                <Grid item xs={4}>
                                    <Typography variant="h6" gutterBottom>
                                        Forecast Start Month
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            maxDate={currentYear}
                                            openTo="year"
                                            views={['year', 'month']}
                                            value={forecastStartMonth}
                                            onChange={(newDate) => setForecastStartMonth(newDate)}
                                            sx={{ minWidth: 250 }}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                {/* Forecast End Month */}
                                <Grid item xs={4}>
                                    <Typography variant="h6" gutterBottom>
                                        Forecast End Month
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            maxDate={currentYear}
                                            openTo="year"
                                            views={['year', 'month']}
                                            value={forecastEndMonth} // New state for forecast end month
                                            onChange={(newDate) => setForecastEndMonth(newDate)} // New handler for forecast end month
                                            sx={{ minWidth: 250 }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Grid>
                        <div className="section">
                            <h2>Product List</h2>
                            <Button variant="contained" color="primary" onClick={handleAddProduct} style={{ marginRight: '10px' }}>
                                + Add Product
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleAddIndication}>
                                + Add Indication
                            </Button>
                            <div style={{ maxHeight: '400px', overflowX: 'auto', overflowY: 'auto', marginTop: '10px' }}> {/* Added scrollbars */}
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
                                                        onChange={(e) => {
                                                            const newIndicationColumns = [...indicationColumns];
                                                            newIndicationColumns[index] = e.target.value;
                                                            setIndicationColumns(newIndicationColumns);
                                                        }} // Editable header
                                                        variant="outlined"
                                                    />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.id}</td>
                                                <td>
                                                    <TextField
                                                        value={product.name}
                                                        onChange={(e) => {
                                                            const newProducts = [...products];
                                                            const index = newProducts.findIndex((p) => p.id === product.id);
                                                            newProducts[index].name = e.target.value;
                                                            setProducts(newProducts);
                                                        }}
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="outlined"
                                                        className={`toggle-btn ${product.include ? 'yes' : 'no'}`}
                                                        onClick={() => {
                                                            const newProducts = [...products];
                                                            const index = newProducts.findIndex((p) => p.id === product.id);
                                                            newProducts[index].include = !newProducts[index].include;
                                                            setProducts(newProducts);
                                                        }}
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
                                                            //label="Years in descending order"
                                                            maxDate={currentYear}
                                                            openTo="year"
                                                            views={['year', 'month']}
                                                            value={product.launchDate}
                                                            onChange={(newDate) => {
                                                                const newProducts = [...products];
                                                                const index = newProducts.findIndex((p) => p.id === product.id);
                                                                newProducts[index].launchDate = newDate;
                                                                setProducts(newProducts);
                                                            }}
                                                            sx={{ minWidth: 250 }}
                                                        />
                                                    </LocalizationProvider>
                                                </td>
                                                {indicationColumns.map((indication, index) => (
                                                    <td key={index}>
                                                        <Button
                                                            variant="outlined"
                                                            className={`toggle-btn ${product.indications[indication] === 'Yes' ? 'yes' : 'no'}`}
                                                            onClick={() => {
                                                                const newProducts = [...products];
                                                                const index = newProducts.findIndex((p) => p.id === product.id);
                                                                newProducts[index].indications[indication] =
                                                                    newProducts[index].indications[indication] === 'Yes' ? 'No' : 'Yes';
                                                                setProducts(newProducts);
                                                            }}

                                                        >
                                                            {product.indications[indication]}
                                                        </Button>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table >
                            </div >
                        </div>
                    </>
                )}
            </div >
        </div >
    );
};

export default ForecastAndFlowDiagram;
