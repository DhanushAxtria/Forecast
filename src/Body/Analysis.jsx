import React, { useContext } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import WaterFall from './WaterFall';
import KPI from './KPI'
import Dashboard from './Dashboard';
import { MyContext } from './context';

const Analysis = () => {
    const { Mode, setMode } = useContext(MyContext);
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
