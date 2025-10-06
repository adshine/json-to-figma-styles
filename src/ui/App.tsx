import React, { useState, useCallback } from 'react';
import FileInput from './components/FileInput';
import ValidationResults from './components/ValidationResults';
import PreviewTable from './components/PreviewTable';
import ResultsSummary from './components/ResultsSummary';
import SampleData from './components/SampleData';
import './App.css';

interface ValidationState {
  isValid: boolean;
  data: any | null;
  error: string | null;
}

interface ProcessingState {
  isProcessing: boolean;
  result: any | null;
  error: string | null;
}

const App: React.FC = () => {
  const [validation, setValidation] = useState<ValidationState>({
    isValid: false,
    data: null,
    error: null,
  });

  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    result: null,
    error: null,
  });

  const [showSample, setShowSample] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Send to plugin for validation
        parent.postMessage({
          pluginMessage: {
            type: 'validate-json',
            data: jsonData,
          },
        }, '*');
      } catch (error) {
        setValidation({
          isValid: false,
          data: null,
          error: 'Invalid JSON format',
        });
      }
    };
    reader.readAsText(file);
  }, []);

  const handleValidate = useCallback(() => {
    if (validation.data) {
      parent.postMessage({
        pluginMessage: {
          type: 'validate-json',
          data: validation.data,
        },
      }, '*');
    }
  }, [validation.data]);

  const handleCreateStyles = useCallback(() => {
    if (validation.data && validation.isValid) {
      setProcessing(prev => ({ ...prev, isProcessing: true }));
      
      parent.postMessage({
        pluginMessage: {
          type: 'create-styles',
          data: validation.data,
        },
      }, '*');
    }
  }, [validation.data, validation.isValid]);

  const handleLoadSample = useCallback(() => {
    setShowSample(true);
  }, []);

  const handleCancel = useCallback(() => {
    parent.postMessage({
      pluginMessage: {
        type: 'cancel',
      },
    }, '*');
  }, []);

  // Listen for messages from the plugin
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, success, data, error } = event.data.pluginMessage || {};

      switch (type) {
        case 'validation-result':
          if (success) {
            setValidation({
              isValid: true,
              data,
              error: null,
            });
          } else {
            setValidation({
              isValid: false,
              data: null,
              error,
            });
          }
          break;

        case 'styles-result':
          setProcessing(prev => ({ ...prev, isProcessing: false }));
          if (success) {
            setProcessing(prev => ({ ...prev, result: data, error: null }));
          } else {
            setProcessing(prev => ({ ...prev, result: null, error }));
          }
          break;

        case 'error':
          setProcessing(prev => ({ ...prev, isProcessing: false, error }));
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>JSON to Figma Styles</h1>
        <p>Convert your design tokens to Figma styles</p>
      </header>

      <main className="app-main">
        <div className="section">
          <h2>Import JSON</h2>
          <FileInput onFileUpload={handleFileUpload} />
          <div className="button-group">
            <button onClick={handleLoadSample} className="button secondary">
              Load Sample Data
            </button>
            <button 
              onClick={handleValidate} 
              disabled={!validation.data}
              className="button secondary"
            >
              Validate JSON
            </button>
          </div>
        </div>

        {validation.error && (
          <div className="section">
            <ValidationResults 
              isValid={false} 
              error={validation.error} 
            />
          </div>
        )}

        {validation.isValid && validation.data && (
          <div className="section">
            <h2>Preview</h2>
            <PreviewTable data={validation.data} />
            <div className="button-group">
              <button 
                onClick={handleCreateStyles}
                disabled={processing.isProcessing}
                className="button primary"
              >
                {processing.isProcessing ? 'Creating Styles...' : 'Create/Update Styles'}
              </button>
            </div>
          </div>
        )}

        {processing.result && (
          <div className="section">
            <h2>Results</h2>
            <ResultsSummary result={processing.result} />
          </div>
        )}

        {processing.error && (
          <div className="section">
            <div className="error-message">
              <h3>Error</h3>
              <p>{processing.error}</p>
            </div>
          </div>
        )}

        {showSample && (
          <div className="section">
            <SampleData onClose={() => setShowSample(false)} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <button onClick={handleCancel} className="button secondary">
          Cancel
        </button>
      </footer>
    </div>
  );
};

export default App;
