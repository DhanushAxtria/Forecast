import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Controls, MarkerType } from 'react-flow-renderer';
import { Grid, Button, TextField, MenuItem, Typography, Box, Tabs, Tab } from '@mui/material';


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
    { id: 'e1-2', source: '1', target: '2', animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-3', source: '2', target: '3', animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
];

/**
 * InputPage
 *
 * This component renders the Input Form and Model Flow tabs.
 * The Input Form tab renders a form with input fields for Therapeutic Area, Forecast Cycle, Country, and Scenario Name.
 * The Model Flow tab renders a React Flow diagram with nodes and edges.
 * The user can interact with the diagram, and the state of the nodes and edges is stored in the component's state.
 */
const InputPage = () => {
    const [activeTab, setActiveTab] = useState(0); // Tab index
    const [greeting, setGreeting] = useState('');
    const [therapeuticArea, setTherapeuticArea] = useState('Oncology');
    const [forecastCycle, setForecastCycle] = useState('2024-H1');
    const [country, setCountry] = useState('USA');
    const [scenarioName, setScenarioName] = useState('Base Scenario 2024');

    // State for React Flow nodes and edges
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // Get the current hour and set the greeting based on the time of day
    useEffect(() => {
        const currentHour = new Date().getHours();
        setGreeting(currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening');
    }, []);
    const handleCreateScenario = () => {
        console.log('Creating scenario with details:', { therapeuticArea, forecastCycle, country, scenarioName });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Handlers for React Flow changes
    // Handle changes to nodes
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    // Handle changes to edges
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    // Handle edge connections (adds new edges)
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        []
    );


    return (
        <div className="container">
            {/* Tabs for navigation */}
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Input Form" />
                <Tab label="Model Flow" />
            </Tabs>

            {/* Tab Content */}
            {activeTab === 0 && (
                <Box p={3}>
                    {/* Input Form Tab */}
                    <h2>{greeting}, Welcome to the Input Form Page!</h2>
                    <Typography variant="h6" gutterBottom>
                        Please provide Scenario details to build Scenario
                    </Typography>
                    {/* Grid of input fields for scenario details */}
                    <Grid container spacing={3} mt={2}>
                        <Grid item xs={12} sm={6}>
                            {/* Therapeutic Area dropdown */}
                            <TextField
                                select
                                label="Therapeutic Area"
                                value={therapeuticArea}
                                onChange={(e) => setTherapeuticArea(e.target.value)}
                                fullWidth
                                variant="outlined"
                            >
                                {/* List of therapeutic areas as options */}
                                <MenuItem value="Oncology">Oncology</MenuItem>
                                <MenuItem value="Cardiology">Cardiology</MenuItem>
                                <MenuItem value="Neurology">Neurology</MenuItem>
                                <MenuItem value="Immunology">Immunology</MenuItem>
                                <MenuItem value="Dermatology">Dermatology</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* Forecast Cycle dropdown */}
                            <TextField
                                select
                                label="Forecast Cycle"
                                value={forecastCycle}
                                onChange={(e) => setForecastCycle(e.target.value)}
                                fullWidth
                                variant="outlined"
                            >
                                {/* List of forecast cycles as options */}
                                <MenuItem value="2024-H1">2024-H1</MenuItem>
                                <MenuItem value="2024-H2">2024-H2</MenuItem>
                                <MenuItem value="2025-H1">2025-H1</MenuItem>
                                <MenuItem value="2025-H2">2025-H2</MenuItem>
                                <MenuItem value="2026-H1">2026-H1</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* Country dropdown */}
                            <TextField
                                select
                                label="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                fullWidth
                                variant="outlined"
                            >
                                {/* List of countries as options */}
                                <MenuItem value="USA">USA</MenuItem>
                                <MenuItem value="UK">UK</MenuItem>
                                <MenuItem value="Germany">Germany</MenuItem>
                                <MenuItem value="Canada">Canada</MenuItem>
                                <MenuItem value="Japan">Japan</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* Scenario Name dropdown */}
                            <TextField
                                select
                                label="Scenario Name"
                                value={scenarioName}
                                onChange={(e) => setScenarioName(e.target.value)}
                                fullWidth
                                variant="outlined"
                            >
                                {/* List of scenario names as options */}
                                <MenuItem value="Base Scenario 2024">Base Scenario 2024</MenuItem>
                                <MenuItem value="Oncology Expansion">Oncology Expansion</MenuItem>
                                <MenuItem value="High-Growth Forecast">High-Growth Forecast</MenuItem>
                                <MenuItem value="Seasonal Adjustment">Seasonal Adjustment</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* Centered Create Scenario Button */}
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button variant="contained" color="primary" onClick={handleCreateScenario}>
                            Create Scenario
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Model Flow Tab is displayed when activeTab is 1 */}
            {activeTab === 1 && (
                <Box p={3}>
                    {/* Model Flow Tab */}
                    <h2>{greeting}, Welcome to the Model Flow Page!</h2>
                    <Typography variant="h6">Model Flow Diagram</Typography>
                    <Box className="flow-diagram-container" mt={2}>
                        {/* The ReactFlow component is used to render the model flow diagram. 
                            The `nodes` and `edges` props are passed in as the initial state of the model flow diagram. 
                            The `onNodesChange` and `onEdgesChange` props are callbacks that are called when the user interacts with the model flow diagram, 
                            e.g. by dragging and dropping nodes or by connecting nodes with edges.*/}
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect} // The `onConnect` prop is a callback that is called when a new edge is created. 
                            fitView //The `fitView` prop is a boolean that determines whether the model flow diagram is automatically resized to fit the available space. 
                            style={{ height: '80vh', width: '100%' }}
                        >
                            <Controls />
                        </ReactFlow>
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default InputPage;
