import React from 'react';

interface SampleDataProps {
  onClose: () => void;
}

const SampleData: React.FC<SampleDataProps> = ({ onClose }) => {
  const sampleJson = {
    "paintStyles": [
      {
        "name": "Brand/Primary/Blue 500",
        "description": "Main brand blue",
        "paints": [
          { "type": "solid", "hex": "#1E40AF", "opacity": 1 }
        ]
      },
      {
        "name": "Brand/Gradients/Hero Sky",
        "description": "Landing hero gradient",
        "paints": [
          {
            "type": "gradient-linear",
            "stops": [
              { "position": 0, "hex": "#60A5FA", "opacity": 1 },
              { "position": 1, "hex": "#3B82F6", "opacity": 1 }
            ],
            "handles": [
              { "x": 0, "y": 0 },
              { "x": 1, "y": 1 },
              { "x": 0, "y": 1 }
            ]
          }
        ]
      }
    ],
    "textStyles": [
      {
        "name": "Text/Heading/H1",
        "description": "Desktop H1",
        "font": { "family": "Inter", "style": "Bold" },
        "fontSize": 48,
        "lineHeight": { "unit": "PIXELS", "value": 56 },
        "letterSpacing": { "unit": "PERCENT", "value": 0 },
        "paragraphSpacing": 0,
        "textCase": "ORIGINAL",
        "textDecoration": "NONE"
      }
    ],
    "effectStyles": [
      {
        "name": "Effects/Shadows/Soft Elevation",
        "description": "Soft drop shadow",
        "effects": [
          {
            "type": "DROP_SHADOW",
            "color": { "hex": "#000000", "opacity": 0.15 },
            "offset": { "x": 0, "y": 8 },
            "radius": 24,
            "spread": 0,
            "visible": true,
            "blendMode": "NORMAL"
          }
        ]
      }
    ],
    "gridStyles": [
      {
        "name": "Grids/Desktop/12 Col",
        "description": "12-col desktop grid",
        "gridType": "COLUMNS",
        "count": 12,
        "gutterSize": 24,
        "margin": 120,
        "alignment": "STRETCH",
        "color": { "r": 0.0, "g": 0.36, "b": 1.0, "a": 0.1 }
      }
    ]
  };

  const handleLoadSample = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'validate-json',
        data: sampleJson,
      },
    }, '*');
    onClose();
  };

  return (
    <div className="sample-data">
      <div className="sample-header">
        <h3>Sample JSON Data</h3>
        <button onClick={onClose} className="button secondary">×</button>
      </div>
      
      <div className="sample-content">
        <p>This sample includes examples of all supported style types:</p>
        <ul>
          <li>🎨 Paint Styles (solid colors and gradients)</li>
          <li>📝 Text Styles (typography)</li>
          <li>✨ Effect Styles (shadows and blur)</li>
          <li>📐 Grid Styles (layout grids)</li>
        </ul>
        
        <div className="sample-json">
          <pre>{JSON.stringify(sampleJson, null, 2)}</pre>
        </div>
        
        <div className="button-group">
          <button onClick={handleLoadSample} className="button primary">
            Load Sample Data
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(sampleJson, null, 2));
              alert('Sample JSON copied to clipboard!');
            }}
            className="button secondary"
          >
            Copy JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleData;
