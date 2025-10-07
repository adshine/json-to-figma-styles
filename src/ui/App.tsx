import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

// Sample JSON data embedded in code
const SAMPLE_JSON = {
  paintStyles: [
    {
      name: "Brand/Primary/Blue 500",
      description: "Main brand blue",
      paints: [{ type: "solid", hex: "#1E40AF", opacity: 1 }]
    },
    {
      name: "Brand/Gradients/Hero Sky",
      description: "Landing hero gradient",
      paints: [{
        type: "gradient-linear",
        stops: [
          { position: 0, hex: "#60A5FA", opacity: 1 },
          { position: 1, hex: "#3B82F6", opacity: 1 }
        ],
        handles: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]
      }]
    }
  ],
  textStyles: [
    {
      name: "Text/Heading/H1",
      description: "Desktop H1",
      font: { family: "Inter", style: "Bold" },
      fontSize: 48,
      lineHeight: { unit: "PIXELS", value: 56 },
      letterSpacing: { unit: "PERCENT", value: 0 },
      paragraphSpacing: 0,
      textCase: "ORIGINAL",
      textDecoration: "NONE"
    }
  ],
  effectStyles: [
    {
      name: "Effects/Shadows/Soft Elevation",
      description: "Soft drop shadow",
      effects: [{
        type: "DROP_SHADOW",
        color: { hex: "#000000", opacity: 0.15 },
        offset: { x: 0, y: 8 },
        radius: 24,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      }]
    }
  ],
  gridStyles: [
    {
      name: "Grids/Desktop/12 Col",
      description: "12-col desktop grid",
      gridType: "COLUMNS",
      count: 12,
      gutterSize: 24,
      margin: 120,
      alignment: "STRETCH",
      color: { r: 0, g: 0.36, b: 1, a: 0.1 }
    }
  ]
};

interface StyleData {
  paintStyles?: any[];
  textStyles?: any[];
  effectStyles?: any[];
  gridStyles?: any[];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [jsonText, setJsonText] = useState('');
  const [validatedData, setValidatedData] = useState<StyleData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // File upload handler
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        // Auto-validate on upload
        parent.postMessage({
          pluginMessage: { type: 'validate-json', data }
        }, '*');
      } catch {
        setError('Invalid JSON format');
        setValidatedData(null);
      }
    };
    reader.readAsText(file);
  }, []);

  // Drag and drop handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        parent.postMessage({
          pluginMessage: { type: 'validate-json', data }
        }, '*');
      } catch {
        setError('Invalid JSON format');
        setValidatedData(null);
      }
    };
    reader.readAsText(file);
  }, []);

  // Paste validation handler
  const handleValidatePaste = useCallback(() => {
    try {
      const data = JSON.parse(jsonText);
      parent.postMessage({
        pluginMessage: { type: 'validate-json', data }
      }, '*');
    } catch {
      setError('Invalid JSON format');
      setValidatedData(null);
    }
  }, [jsonText]);

  // Generate styles handler
  const handleGenerateStyles = useCallback(() => {
    if (!validatedData) return;

    setIsProcessing(true);
    parent.postMessage({
      pluginMessage: { type: 'create-styles', data: validatedData }
    }, '*');
  }, [validatedData]);

  // Copy sample data
  const handleCopySample = useCallback(() => {
    const sampleText = JSON.stringify(SAMPLE_JSON, null, 2);

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(sampleText)
        .then(() => alert('Sample JSON copied to clipboard!'))
        .catch(() => {
          // Fallback: create temporary textarea
          const textarea = document.createElement('textarea');
          textarea.value = sampleText;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            alert('Sample JSON copied to clipboard!');
          } catch (err) {
            alert('Failed to copy. Please try pasting the JSON manually.');
          }
          document.body.removeChild(textarea);
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = sampleText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        alert('Sample JSON copied to clipboard!');
      } catch (err) {
        alert('Failed to copy. Please try pasting the JSON manually.');
      }
      document.body.removeChild(textarea);
    }
  }, []);

  // Listen for plugin messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, success, data, error: msgError } = event.data.pluginMessage || {};

      switch (type) {
        case 'validation-result':
          if (success) {
            setValidatedData(data);
            setError(null);
          } else {
            setError(msgError);
            setValidatedData(null);
          }
          break;

        case 'styles-result':
          setIsProcessing(false);
          if (success) {
            setResult(data);
            setError(null);
          } else {
            setError(msgError);
          }
          break;

        case 'error':
          setIsProcessing(false);
          setError(msgError);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Calculate style counts
  const getStyleCounts = () => {
    if (!validatedData) return null;

    const counts: { label: string; count: number; emoji: string }[] = [];

    if (validatedData.paintStyles?.length) {
      counts.push({ label: 'Paint', count: validatedData.paintStyles.length, emoji: '🎨' });
    }
    if (validatedData.textStyles?.length) {
      counts.push({ label: 'Text', count: validatedData.textStyles.length, emoji: '📝' });
    }
    if (validatedData.effectStyles?.length) {
      counts.push({ label: 'Effect', count: validatedData.effectStyles.length, emoji: '✨' });
    }
    if (validatedData.gridStyles?.length) {
      counts.push({ label: 'Grid', count: validatedData.gridStyles.length, emoji: '📐' });
    }

    return counts;
  };

  const styleCounts = getStyleCounts();
  const totalStyles = styleCounts?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="app">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload File
        </button>
        <button
          className={`tab ${activeTab === 'paste' ? 'active' : ''}`}
          onClick={() => setActiveTab('paste')}
        >
          Paste Data
        </button>
      </div>

      <main className="app-main">
        {/* Upload Tab */}
        <div className={`tab-content ${activeTab === 'upload' ? 'active' : ''}`}>
          <p className="description-text">
            Import your design tokens as JSON to automatically create Figma styles for colors, typography, effects, and grids.
          </p>
          <p className="helper-text">
            Need help?{' '}
            <a className="helper-link" onClick={handleCopySample}>
              Copy Sample Data
            </a>
          </p>

          <div
            className={`file-drop-zone ${isDragging ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="file-drop-content">
              <p>Drop JSON file here</p>
              <p>or click to browse files</p>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="file-input-hidden"
            />
          </div>
        </div>

        {/* Paste Tab */}
        <div className={`tab-content ${activeTab === 'paste' ? 'active' : ''}`}>
          <p className="description-text">
            Import your design tokens as JSON to automatically create Figma styles for colors, typography, effects, and grids.
          </p>
          <p className="helper-text">
            Need help?{' '}
            <a className="helper-link" onClick={handleCopySample}>
              Copy Sample Data
            </a>
          </p>

          <textarea
            className="json-textarea"
            placeholder="Paste your JSON here..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />

          <button
            className="button primary button-full"
            onClick={handleValidatePaste}
            disabled={!jsonText.trim()}
            style={{ marginTop: '12px' }}
          >
            Validate JSON
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="message message-error">
            <p className="message-text">{error}</p>
          </div>
        )}

        {/* Style Count Summary */}
        {validatedData && styleCounts && (
          <div className="style-count">
            <div className="style-count-title">
              Styles to create ({totalStyles})
            </div>
            <ul className="style-count-list">
              {styleCounts.map((item) => (
                <li key={item.label} className="style-count-item">
                  <span>{item.emoji}</span>
                  <span className="style-count-number">{item.count}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="results">
            <div className="results-title">✓ Styles Created Successfully</div>
            <div className="results-summary">
              <span>
                <span className="results-number created">{result.summary.created}</span> Created
              </span>
              <span>
                <span className="results-number updated">{result.summary.updated}</span> Updated
              </span>
              {result.summary.skipped > 0 && (
                <span>
                  <span className="results-number skipped">{result.summary.skipped}</span> Skipped
                </span>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <button
          className="button"
          onClick={() => parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')}
        >
          Cancel
        </button>
        <button
          className="button primary"
          onClick={handleGenerateStyles}
          disabled={!validatedData || isProcessing}
        >
          {isProcessing ? (
            <span className="loading">Generating...</span>
          ) : (
            'Generate Styles'
          )}
        </button>
      </footer>
    </div>
  );
};

export default App;
