import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import WaterFall from './WaterFall';
import KPI from './KPI'
import Dashboard from './Dashboard';

const Analysis = () => {
    const [Mode, setMode] = useState('Dashboard');
    
    return (
        <>
                
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <ButtonGroup variant="contained" color="primary">
                        <Button
                            onClick={() => setMode("Dashboard")}
                            variant={Mode === "Dashboard" ? "contained" : "outlined"}
                        >
                            Dashboard
                        </Button>
                        <Button
                            onClick={() => setMode("Sensitivity")}
                            variant={Mode === "Sensitivity" ? "contained" : "outlined"}
                        >
                            Sensitivity
                        </Button>
                        <Button
                            onClick={() => setMode("WaterFall")}
                            variant={Mode === "WaterFall" ? "contained" : "outlined"}
                        >
                            WaterFall
                        </Button>
                    </ButtonGroup>
                </Box>

                {/* Conditionally render components based on the selected mode */}
                <Box sx={{ marginTop: 2 }}>
                    {Mode === "Dashboard" && <Dashboard />}
                    {Mode === "Sensitivity" && <KPI />}
                    {Mode === "WaterFall" && <WaterFall />}
                </Box>
        </>
    );
};

export default Analysis;
