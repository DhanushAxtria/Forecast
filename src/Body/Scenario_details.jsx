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

const ForecastAndFlowDiagram = () => {
    const [greeting, setGreeting] = useState('');
    const [activeTab, setActiveTab] = useState('controlSheet'); // Manage which tab is active
    // Selected predefined scenario
    const [customScenarioName, setCustomScenarioName] = useState('');
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
    const [scenarioDetails, setScenarioDetails] = useState('Custom Scenario Details');
    const [editMode, setEditMode] = useState(false);
    const [products, setProducts] = useState([
        { id: 1, name: 'Product1', include: true, xyzProduct: true, launchDate: dayjs('2014-02-01'), indications: {} },
        { id: 2, name: 'Product2', include: true, xyzProduct: true, launchDate: dayjs('2017-02-01'), indications: {} },
    ]);
    const [indicationColumns, setIndicationColumns] = useState([]);
    const predefinedScenarioNames = ['Scenario 1', 'Scenario 2', 'Scenario 3'];
    // State to control visibility of calendars for each product
    const [openCalendars, setOpenCalendars] = useState({});
    const currentYear = dayjs();
    useEffect(() => {
        const currentHour = new Date().getHours();
        setGreeting(currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening');
    }, []);
    const handleEditToggle = () => {
        setEditMode(!editMode);
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

    const handleIncludeChange = (id) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === id ? { ...product, include: !product.include } : product))
        );
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
    const handleLaunchDateChange = (id, date) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === id ? { ...product, launchDate: date } : product))
        );
    };
    const [scenarioName, setScenarioName] = useState(predefinedScenarioNames[0]);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

    return (
        <div className="container">
            <Button
                variant="contained"
                className="fixed-apply-button" // Apply the custom CSS class
                startIcon={<ApplyIcon />}
            >
                Apply
            </Button>
            <div className="tabs">
                <Button variant="outlined" className={`tab ${activeTab === 'controlSheet' ? 'active' : ''}`} onClick={() => setActiveTab('controlSheet')}>
                    Forecast Scenario
                </Button>
                <Button variant="outlined" className={`tab ${activeTab === 'flowDiagram' ? 'active' : ''}`} onClick={() => setActiveTab('flowDiagram')}>
                    Model Flow
                </Button>
            </div>

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
                                            onChange={(e) => setScenarioName(e.target.value)}
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
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton onClick={handleEditToggle}>
                                            <EditIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
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
                            {/* Scenario Parameters Section */}
                            <Grid item xs={12}>
                                <h2>Scenario Parameters</h2>
                            </Grid>
                            <Grid item xs={12} sm={6}>
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

                            <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12}>
                            <h2>Time Period</h2>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" gutterBottom>
                                    Historical Start Month
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        //label="Years in descending order"
                                        maxDate={currentYear}
                                        openTo="year"
                                        views={['year', 'month']}
                                        value={historicalStartMonth}
                                        onChange={(newDate) => setHistoricalStartMonth(newDate)}
                                        sx={{ minWidth: 250 }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" gutterBottom>
                                    Forecast Start Month
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        //label="Years in descending order"
                                        maxDate={currentYear}
                                        openTo="year"
                                        views={['year', 'month']}
                                        value={forecastStartMonth}
                                        onChange={(newDate) => setForecastStartMonth(newDate)}
                                        sx={{ minWidth: 250 }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <div className="section">
                            <h2>Product List</h2>
                            <Button variant="contained" color="primary" onClick={handleAddProduct} style={{ marginRight: '10px' }}>
                                + Add Product
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleAddIndication}>
                                + Add Indication
                            </Button>

                            <table className="product-table">
                                <thead>
                                    <tr>
                                        <th>S No.</th>
                                        <th>Product</th>
                                        <th>Include?</th>
                                        <th>XYZ Product?</th>
                                        <th>Launch Date</th>
                                        {indicationColumns.map((indication, index) => (
                                            <th key={index}>{indication}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
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
                                                        //label="Years in descending order"
                                                        maxDate={currentYear}
                                                        openTo="year"
                                                        views={['year', 'month']}
                                                        value={product.launchDate}
                                                        onChange={(newDate) => handleLaunchDateChange(product.id, newDate)}
                                                        sx={{ minWidth: 250 }}
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
                            </table >
                        </div >
                    </>
                )}

                {
                    activeTab === 'flowDiagram' && (
                        <div className="flow-diagram-container">
                            <div className="flow-layout">
                                <div className="side-header left-side">Market and Shares</div>
                                <div className="flow-diagram">
                                    <ReactFlow
                                        nodes={nodes}
                                        edges={edges}
                                        onNodesChange={onNodesChange}
                                        onEdgesChange={onEdgesChange}
                                        onConnect={onConnect}
                                        fitView
                                        style={{ height: '80vh', width: '100%' }}
                                    >
                                        <Background color="#aaa" gap={16} />
                                        <Controls />
                                    </ReactFlow>
                                </div>
                                <div className="side-header right-side">Conversion</div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default ForecastAndFlowDiagram;
