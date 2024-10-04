import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header'; // Import Header correctly
import BlankPage from './Body/Blankpage'; // Component for Forecast Page
import HomePage from './Header/Homepage'; // Home Page
//import Body from './Body/Body'; // Assuming Body is the main page content, e.g. BlogGrid

function App() {
  return (
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

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
