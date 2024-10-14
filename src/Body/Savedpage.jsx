import React from 'react';
import ForecastAndWorksheetSelectionsWithGreeting from './Saved-Scenario.jsx'

function Savedpage() {
  return (
    <div className='Saved_Scenario'>
      
      {/* Country and Therapeutic Area Selection Dropdowns */}
      <div>  {/* Add some spacing between title and dropdowns */}
        <ForecastAndWorksheetSelectionsWithGreeting />
      </div>
    </div>
  );
}

export default Savedpage;