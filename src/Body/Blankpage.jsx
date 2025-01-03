import React from 'react';
import CountryAndTherapeuticSelect from './New_Scenario'; // Import the dropdown component
import "./Blankpage.scss";

function BlankPage() {
  return (
    <div className='New_Scenario'>
      
      {/* Country and Therapeutic Area Selection Dropdowns */}
      <div>  {/* Add some spacing between title and dropdowns */}
        <CountryAndTherapeuticSelect />
      </div>
    </div>
  );
}

export default BlankPage;
