import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Body from './Body/Body';
import NewScenario from './Body/New_Scenario';
import ScenarioComparsion from './Body/ScenarioComparsion';
import { SavedFilesProvider } from './Body/SavedFilesContext';
import DataConsolidation from './Body/Data_Consolidation';
import HelpPage from './Header/HelpPage';
import ScenarioDetails from './Body/Scenario_details'
import ReviewScenario from './Body/ReviewScenario'
import SummaryScenario from './Body/SummaryScenario'
import Submission_Tracker from './Body/Submission_Tracker'
import SavedScenario from './Body/SavedScenario'
import Forecastpage from './Body/TimeSeriesMethods'
import Patient_Forecast from './Body/Patient_Forecast'
import Patient_Forecast_Input from './Body/Patient_Forecast_Input';
import Forecasted_Results from './Body/forecastedresults';
import Dashboard from './Body/Dashboard'
import Admin from './Body/Admin'
import Model1 from './Body/Model1'
import Analysis from './Body/Analysis';
import NewModel from './Body/NewModel';
import ReportTabs from './Body/Reports';
import SavedViewsDashboard from './Body/SavedViewsDashboard';
import SavedViewsKPI from './Body/SavedViewsKPI';
import SavedViewsWaterfall from './Body/SavedViewsWaterfall';
function App() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false); // Initialize the state
  return (
    <SavedFilesProvider> {/* Wrap the app with SavedFilesProvider */}
      <Router>

        {/* Header stays fixed across all pages */}
        <Header hasUnsavedChanges={hasUnsavedChanges} setHasUnsavedChanges={setHasUnsavedChanges} />


        {/* Routes determine what body content to show */}
        <Routes>
          {/* Help page from the header */}
          <Route path="/help" element={<HelpPage />} />
          {/* Home Page Route - Display HomePage */}
          <Route path="/" element={<Body />} />
          {/* New Scenario Page Route - Display */}
          <Route path="/new-model/epidemiology-model" element={<NewScenario />} />
          {/* Scenario Comparison Page Route */}
          <Route path="/scenario-comparsion" element={<ScenarioComparsion />} />
          {/* Data Consolidation  Page Route */}
          <Route path="/data-consolidation" element={<DataConsolidation />} />
          /{/*<Route path="/Forecast" element={<HomePage />} />*/}
          <Route path="/new-model/epidemiology-model/scenario-details" element={<ScenarioDetails />} />
          <Route path="/saved-scenario/review-scenario" element={<ReviewScenario />} />
          <Route path="/saved-scenario/Summary-scenario" element={<SummaryScenario />} />
          <Route path="/new-model/epidemiology-model/review-scenario" element={<ReviewScenario />} />
          <Route path="/new-model/epidemiology-model/Summary-scenario" element={<SummaryScenario />} />
          <Route path="/submissions-tracker" element={<Submission_Tracker />} />
          {/* <Route path="epidemiology-model/scenario-details/Inputpage" element={<Inputpage />} /> */}
          <Route path="/saved-scenario" element={<SavedScenario />} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/new-model/epidemiology-model/scenario-details/forecastdeepdive" element={<Patient_Forecast />} />
          <Route path="/new-model/time-series-model" element={<Forecastpage />} />
          <Route path="/new-model/time-series-model/forecasted_results" element={<Forecasted_Results />} />
          <Route path="/new-model/epidemiology-model/scenario-details/forecastdeepdive/dashboard" element={<Dashboard />} />
          <Route path="/new-model/epidemiology-model/scenario-details/forecastdeepdive/analysis" element={<Analysis />} />
          <Route path="/new-model/epidemiology-model/scenario-details/forecastdeepdive/patientinput" element={<Patient_Forecast_Input />} />
          <Route path="/generate-report" element={<ReportTabs />} />
          <Route path="/new-model/epidemiology-model/model1" element={<Model1 />} />
          <Route path="/new-model/epidemiology-model/model1/analysis" element={<Analysis />} />
          <Route path="/new-model" element={<NewModel />} />
          <Route path="/new-model/epidemiology-model/scenario-details/forecastdeepdive/analysis/saved-views-dashboard" element={<SavedViewsDashboard />} />
          <Route path="/new-model/epidemiology-model/scenario-details/forecastdeepdive/analysis/saved-views-kpi" element={<SavedViewsKPI />} />
          <Route path="/new-model/epidemiology-model/scenario-details/forecastdeepdive/analysis/saved-views-waterfall" element={<SavedViewsWaterfall />} />

          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </SavedFilesProvider>
  );
}

export default App;
