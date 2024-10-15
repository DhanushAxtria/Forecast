import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  MiniMap,
  Controls,
  MarkerType,
} from 'react-flow-renderer';
import './ModelFlow.scss'; // Custom CSS for fixed headers and styling
import './SavedScenario.scss'; // Control Sheet styling

// Initial nodes and edges for the flow diagram
const initialNodes = [
  { id: '1', data: { label: 'Product Level Treated Patients' }, position: { x: 250, y: 50 }, style: { width: 200 } },
  { id: '2', data: { label: 'Patients per product (based on trending)' }, position: { x: 250, y: 150 }, style: { width: 250 } },
  { id: '3', data: { label: 'Final patients per product (post events)' }, position: { x: 250, y: 250 }, style: { width: 250 } },
  { id: '4', data: { label: 'Compliant units' }, position: { x: 250, y: 350 }, style: { width: 150 } },
  { id: '5', data: { label: 'Dosage' }, position: { x: 600, y: 150 }, style: { width: 150 } },
  { id: '6', data: { label: 'Compliance %' }, position: { x: 600, y: 250 }, style: { width: 150 } },
  { id: '7', data: { label: 'Extra Molecular Usage' }, position: { x: 600, y: 350 }, style: { width: 200 } },
  { id: '8', data: { label: 'Patient Stocking Adjustments' }, position: { x: 600, y: 450 }, style: { width: 250 } },
  { id: '9', data: { label: 'Seasonality Adjustments' }, position: { x: 600, y: 550 }, style: { width: 200 } },
  { id: '10', data: { label: 'Overall Adjustment factor (calculated)' }, position: { x: 250, y: 450 }, style: { width: 250 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: '3', target: '4', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-10', source: '4', target: '10', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e10-5', source: '10', target: '5', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: '5', target: '6', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6-7', source: '6', target: '7', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e7-8', source: '7', target: '8', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8-9', source: '8', target: '9', animated: true, label: '', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
];

const availableLaunchDates = ['Feb-14', 'Feb-17', 'Mar-18', 'Apr-18', 'Jun-20', 'Jul-21', 'Aug-22', 'Sep-22', 'Oct-23', 'Nov-18'];

const ForecastAndFlowDiagram = () => {
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState('controlSheet'); // Manage which tab is active

  // Control sheet form states
  const [historicalStartMonth, setHistoricalStartMonth] = useState('Jan-15');
  const [forecastStartMonth, setForecastStartMonth] = useState('Nov-24');
  const [forecastMetric, setForecastMetric] = useState('Patients');
  const [currency, setCurrency] = useState('EUR');
  const [forecastCycle, setForecastCycle] = useState('2024-H1');
  const [country, setCountry] = useState('USA');
  const [therapeuticArea, setTherapeuticArea] = useState('Oncology');
  // Initialize the product list state
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Product1',
      include: true,
      xyzProduct: true,
      launchDate: 'Feb-14',
      indications: {},
    },
    {
      id: 2,
      name: 'Product2',
      include: true,
      xyzProduct: true,
      launchDate: 'Feb-17',
      indications: {},
    },
  ]);

  const [indicationColumns, setIndicationColumns] = useState([]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setGreeting(currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  // Function to handle adding a new product
  const handleAddProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: `Product${products.length + 1}`,
      include: true,
      xyzProduct: true,
      launchDate: 'Jan-25',
      indications: {},
    };
    setProducts([...products, newProduct]);
  };

  // Function to handle adding a new indication
  const handleAddIndication = () => {
    const newIndication = `Indication ${indicationColumns.length + 1}`;
    setIndicationColumns([...indicationColumns, newIndication]);

    // Initialize the new indication as 'No' for each product
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        indications: { ...product.indications, [newIndication]: 'Yes' },
      }))
    );
  };

  // Function to toggle indication values (Yes/No)
  const handleToggleIndication = (productId, indicationKey) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              indications: {
                ...product.indications,
                [indicationKey]: product.indications[indicationKey] === 'Yes' ? 'No' : 'Yes',
              },
            }
          : product
      )
    );
  };

  // Function to handle Include/Exclude toggle
  const handleIncludeChange = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, include: !product.include } : product))
    );
  };
  const handleXYZProductChange = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, xyzProduct: !product.xyzProduct } : product))
    );
  };
  // Function to handle Launch Date selection
  const handleSelectChange = (id, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, [field]: value } : product))
    );
  };

  // React Flow chart states for nodes and edges (Only used in the flow diagram tab)
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

  return (
    <div className="container">
      {/* Horizontal Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'controlSheet' ? 'active' : ''}`} onClick={() => setActiveTab('controlSheet')}>
          Forecast Scenario
        </button>
        <button className={`tab ${activeTab === 'flowDiagram' ? 'active' : ''}`} onClick={() => setActiveTab('flowDiagram')}>
          Model Flow
        </button>
      </div>

      <div className="content">
        {/* Display Control Sheet content if activeTab is 'controlSheet' */}
        {activeTab === 'controlSheet' && (
          <>
            <h1 className="greeting">{greeting}, Welcome to the Forecast & Worksheet Selections</h1>
            <div className="flex-container">
              <div className="section">
                <h2>General Information</h2>
                <div className="input-group">
                  <label>Forecast Cycle:</label>
                  <input type="text" value={forecastCycle} disabled />
                </div>
                <div className="input-group">
                  <label>Country:</label>
                  <input type="text" value={country} disabled />
                </div>
                <div className="input-group">
                  <label>Therapeutic Area:</label>
                  <input type="text" value={therapeuticArea} disabled />
                </div>
              </div>
            </div>
            {/* Forecast Horizon and Granularity */}
            <div className="flex-container">
              <div className="section">
                <h2>Forecast Horizon</h2>
                <div className="input-group">
                  <label>Historical start month:</label>
                  <select value={historicalStartMonth} onChange={(e) => setHistoricalStartMonth(e.target.value)}>
                    <option value="Jan-15">Jan-15</option>
                    <option value="Feb-15">Feb-15</option>
                    <option value="Mar-15">Mar-15</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Forecast start month:</label>
                  <select value={forecastStartMonth} onChange={(e) => setForecastStartMonth(e.target.value)}>
                    <option value="Nov-24">Nov-24</option>
                    <option value="Dec-24">Dec-24</option>
                    <option value="Jan-25">Jan-25</option>
                  </select>
                </div>
              </div>

              <div className="section">
                <h2>Granularity of the Model</h2>
                <div className="input-group">
                  <label>Forecast Start Metric:</label>
                  <select value={forecastMetric} onChange={(e) => setForecastMetric(e.target.value)}>
                    <option value="Patients">Patients</option>
                    <option value="Units">Units</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Local Currency in the Model:</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="section">
              <h2>Product List</h2>
              <button className="add-product-btn" onClick={handleAddProduct}>
                + Add Product
              </button>
              <button className="add-indication-btn" onClick={handleAddIndication}>
                + Add Indication
              </button>
              <table className="product-table">
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Product</th>
                    <th>Include?</th>
                    <th>XYZ Product?</th>
                    <th>Launch Dates</th>
                    {indicationColumns.map((indication, index) => (
                      <th key={index}>{indication}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>
                        <button className={`toggle-btn ${product.include ? 'yes' : 'no'}`} onClick={() => handleIncludeChange(product.id)}>
                          {product.include ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td>
                        <button className={`toggle-btn ${product.xyzProduct ? 'yes' : 'no'}`} onClick={() => handleXYZProductChange(product.id)}>
                          {product.xyzProduct ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td>
                        <select value={product.launchDate} onChange={(e) => handleSelectChange(product.id, 'launchDate', e.target.value)}>
                          {availableLaunchDates.map((date) => (
                            <option key={date} value={date}>
                              {date}
                            </option>
                          ))}
                        </select>
                      </td>
                      {indicationColumns.map((indication, index) => (
                        <td key={index}>
                          <button
                            className={`toggle-btn ${product.indications[indication] === 'Yes' ? 'yes' : 'no'}`}
                            onClick={() => handleToggleIndication(product.id, indication)}
                          >
                            {product.indications[indication]}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Apply Button */}
            <div className="apply-container">
              <button className="apply-btn">Apply</button>
            </div>
          </>
        )}

        {/* Display Flow Diagram content if activeTab is 'flowDiagram' */}
        {activeTab === 'flowDiagram' && (
          <div className="flow-diagram-container">
            {/* Fixed Headers */}
            <div className="fixed-header">
              <div className="section-header">Market and Shares</div>
              <div className="section-header">Conversion</div>
            </div>

            {/* React Flow */}
            <div className="flow-container">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                style={{ height: '80vh' }}
              >
                <Background color="#aaa" gap={16} />
                <Controls />
              </ReactFlow>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastAndFlowDiagram;
