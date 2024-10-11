import React from 'react';
import ForecastAndWorksheetSelectionsWithGreeting from './ScenarioComparsion_jsx.jsx'
import ScenarioComparsion from './ScenarioComparsion.scss'
function ScenarioComparsion1() {
    return (
      <div className='Scenario_Comparsion'>
        
        {/* Country and Therapeutic Area Selection Dropdowns */}
        <div>  {/* Add some spacing between title and dropdowns */}
          <ForecastAndWorksheetSelectionsWithGreeting/>
        </div>
      </div>
    );
  }
  
  export default ScenarioComparsion1;