import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header'; // Import Header correctly
import BlankPage from './Body/Blankpage'; // Component for Forecast Page (New Scenario)
import HomePage from './Header/Homepage'; // Home Page
import ScenarioComparsion from './Body/ScenarioComparsion'; // Component for Scenario Comparison
import { SavedFilesProvider } from './Body/SavedFilesContext'; // Import the context provider
import Page3 from './Body/Page3';
import DataConsolidation from './Body/Data_Consolidation';
import Savedpage from './Body/Savedpage';
import SavedScenario from './Body/Saved-Scenario';
import HelpPage from  './Header/HelpPage';
import ScenarioDetails from './Body/Scenario_details'
import ReviewScenario from './Body/ReviewScenario'
import SummaryScenario from './Body/SummaryScenario'
//import Navbar from './Body/Navbar'
function App() {
  return (
    <SavedFilesProvider> {/* Wrap the app with SavedFilesProvider */}
      
      <Router>
        {/* Header stays fixed across all pages */}
        <Header />
        {/* Routes determine what body content to show */}
        <Routes>
          {/* Home Page Route - Display HomePage and Body */}
          <Route path="/" element={
            <>
              <HomePage />
            </>
          } />

          {/* New Scenario Page Route - Display BlankPage only */}
          <Route path="/new-scenario" element={<BlankPage />} />
          <Route path="/help" element={<HelpPage />} /> 
          {/* Scenario Comparison Page Route */}
          <Route path="/scenario-comparsion" element={<ScenarioComparsion />} />
          <Route path="/data-consolidation" element={<DataConsolidation />} />
          /{/*<Route path="/Forecast" element={<HomePage />} />*/}
          <Route path="/scenario-details" element={<ScenarioDetails />} />
          <Route path="/review-scenario" element={<ReviewScenario />} />
          <Route path="/Summary-scenario" element={<SummaryScenario />} />

          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </SavedFilesProvider> 
  );
}

export default App;
