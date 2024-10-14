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

const ForecastAndFlowDiagram = () => {
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState('controlSheet'); // Manage which tab is active

  // Control sheet form states
  const [historicalStartMonth, setHistoricalStartMonth] = useState('Jan-15');
  const [forecastStartMonth, setForecastStartMonth] = useState('Nov-24');
  const [forecastMetric, setForecastMetric] = useState('Patients');
  const [currency, setCurrency] = useState('EUR');

  // Product list with default values
  const [products, setProducts] = useState([
    { id: 1, name: 'Product1', include: true, xyzProduct: true, launchDate: 'Feb-14', indication: 'Indication 1' },
    { id: 2, name: 'Product2', include: false, xyzProduct: false, launchDate: 'Feb-17', indication: 'Indication 2' },
    { id: 3, name: 'Product3', include: true, xyzProduct: true, launchDate: 'Jan-18', indication: 'Indication 1' },
  ]);

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const handleIncludeChange = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, include: !product.include } : product
      )
    );
  };

  // React Flow chart states for nodes and edges
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

  return (
    <div className="container">
      {/* Horizontal Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'controlSheet' ? 'active' : ''}`}
          onClick={() => setActiveTab('controlSheet')}
        >
          Control Sheet
        </button>
        <button
          className={`tab ${activeTab === 'flowDiagram' ? 'active' : ''}`}
          onClick={() => setActiveTab('flowDiagram')}
        >
          Flow Diagram
        </button>
      </div>

      <div className="content">
        {/* Display Control Sheet content if activeTab is 'controlSheet' */}
        {activeTab === 'controlSheet' && (
          <>
            <h1 className="greeting">{greeting}, Welcome to the Forecast & Worksheet Selections</h1>

            <div className="flex-container">
              <div className="section">
                <h2>Forecast Horizon</h2>
                <div className="input-group">
                  <label>Historical start month:</label>
                  <select
                    value={historicalStartMonth}
                    onChange={(e) => setHistoricalStartMonth(e.target.value)}
                  >
                    <option value="Jan-15">Jan-15</option>
                    <option value="Feb-15">Feb-15</option>
                    <option value="Mar-15">Mar-15</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Forecast start month:</label>
                  <select
                    value={forecastStartMonth}
                    onChange={(e) => setForecastStartMonth(e.target.value)}
                  >
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
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="section">
              <h2>Product List</h2>
              <table className="product-table">
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Product</th>
                    <th>Include?</th>
                    <th>XYZ Product?</th>
                    <th>Launch Dates</th>
                    <th>Indication</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>
                        <button
                          className={`toggle-btn ${product.include ? 'yes' : 'no'}`}
                          onClick={() => handleIncludeChange(product.id)}
                        >
                          {product.include ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td>{product.xyzProduct ? 'Yes' : 'No'}</td>
                      <td>{product.launchDate}</td>
                      <td>{product.indication}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <MiniMap nodeColor={() => 'blue'} />
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
