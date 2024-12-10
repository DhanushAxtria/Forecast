import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header'; // Import Header correctly
import BlankPage from './Body/Blankpage'; // Component for Forecast Page (New Scenario)
import HomePage from './Header/Homepage'; // Home Page
import ScenarioComparsion from './Body/ScenarioComparsion'; // Component for Scenario Comparison
import { SavedFilesProvider } from './Body/SavedFilesContext'; // Import the context provider
import DataConsolidation from './Body/Data_Consolidation';
//import Savedpage from './Body/Savedpage';
import SavedScenario from './Body/Saved-Scenario';
import HelpPage from './Header/HelpPage';
import ScenarioDetails from './Body/Scenario_details'
import ReviewScenario from './Body/ReviewScenario'
import SummaryScenario from './Body/SummaryScenario'
import Submission_Tracker from './Body/Submission_Tracker'
import Inputpage from './Body/Inputpage'
import Savedpage from './Body/Newpage'
import Admin from './Body/Forecastpage'
import Patient_Forecast from './Body/Patient_Forecast'
import Forecasted_Results from './Body/forecasted_results';
import Dashboard from './Body/Dashboard'
//import Navbar from './Body/Navbar'
function App() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false); // Initialize the state
  return (
    <SavedFilesProvider> {/* Wrap the app with SavedFilesProvider */}

      <Router>
        {/* Header stays fixed across all pages */}
        <Header hasUnsavedChanges={hasUnsavedChanges} setHasUnsavedChanges={setHasUnsavedChanges} />
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
          <Route path="/new-scenario/scenario-details" element={<ScenarioDetails />} />
          <Route path="/saved-scenario/review-scenario" element={<ReviewScenario />} />
          <Route path="/saved-scenario/Summary-scenario" element={<SummaryScenario />} />
          <Route path="/submissions-tracker" element={<Submission_Tracker />} />
          <Route path="/" element={<ScenarioDetails hasUnsavedChanges={hasUnsavedChanges} setHasUnsavedChanges={setHasUnsavedChanges} />} />
          <Route path="new-scenario/scenario-details/Inputpage" element={<Inputpage />} />
          <Route path="/saved-scenario" element={<Savedpage />} />
          {/* <Route path="/Inputpage" element={<Inputpage/>} /> */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/forecastdeepdive" element={<Patient_Forecast />} />
          <Route path="/admin/forecasted_results" element={<Forecasted_Results />} />
          <Route path="/forecastdeepdive/dashboard" element={<Dashboard />} />

          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </SavedFilesProvider>
  );
}

export default App;
