import React from 'react';

import { useContext, useEffect, useState } from 'react';

import { Tabs, Tab, Box} from '@mui/material';

import GenerateReport from './GenerateReport';
import DataConsolidation from './Data_Consolidation';
import ScenarioComparison from './ScenarioComparsion';


const ReportTabs = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box
    >
            <Tabs value={selectedTab} onChange={handleChange} centered>
                <Tab label="Data Consolidation" />
                <Tab label="Scenario Comparison" />
                <Tab label="Standard Reports" />
            </Tabs>
        
            <Box sx={{ padding: 2, marginTop: 2 }}>
                {selectedTab === 0 && <DataConsolidation />}
                {selectedTab === 1 && <ScenarioComparison />}
                {selectedTab === 2 && <GenerateReport />}
            </Box>
        </Box>
    );
};

export default ReportTabs;

