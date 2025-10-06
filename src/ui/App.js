import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useCallback } from 'react';
import FileInput from './components/FileInput';
import ValidationResults from './components/ValidationResults';
import PreviewTable from './components/PreviewTable';
import ResultsSummary from './components/ResultsSummary';
import SampleData from './components/SampleData';
import './App.css';
const App = () => {
    const [validation, setValidation] = useState({
        isValid: false,
        data: null,
        error: null,
    });
    const [processing, setProcessing] = useState({
        isProcessing: false,
        result: null,
        error: null,
    });
    const [showSample, setShowSample] = useState(false);
    const handleFileUpload = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            try {
                const jsonData = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                // Send to plugin for validation
                parent.postMessage({
                    pluginMessage: {
                        type: 'validate-json',
                        data: jsonData,
                    },
                }, '*');
            }
            catch (error) {
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
            setProcessing(prev => (Object.assign(Object.assign({}, prev), { isProcessing: true })));
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
        const handleMessage = (event) => {
            const { type, success, data, error } = event.data.pluginMessage || {};
            switch (type) {
                case 'validation-result':
                    if (success) {
                        setValidation({
                            isValid: true,
                            data,
                            error: null,
                        });
                    }
                    else {
                        setValidation({
                            isValid: false,
                            data: null,
                            error,
                        });
                    }
                    break;
                case 'styles-result':
                    setProcessing(prev => (Object.assign(Object.assign({}, prev), { isProcessing: false })));
                    if (success) {
                        setProcessing(prev => (Object.assign(Object.assign({}, prev), { result: data, error: null })));
                    }
                    else {
                        setProcessing(prev => (Object.assign(Object.assign({}, prev), { result: null, error })));
                    }
                    break;
                case 'error':
                    setProcessing(prev => (Object.assign(Object.assign({}, prev), { isProcessing: false, error })));
                    break;
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "app-header", children: [_jsx("h1", { children: "JSON to Figma Styles" }), _jsx("p", { children: "Convert your design tokens to Figma styles" })] }), _jsxs("main", { className: "app-main", children: [_jsxs("div", { className: "section", children: [_jsx("h2", { children: "Import JSON" }), _jsx(FileInput, { onFileUpload: handleFileUpload }), _jsxs("div", { className: "button-group", children: [_jsx("button", { onClick: handleLoadSample, className: "button secondary", children: "Load Sample Data" }), _jsx("button", { onClick: handleValidate, disabled: !validation.data, className: "button secondary", children: "Validate JSON" })] })] }), validation.error && (_jsx("div", { className: "section", children: _jsx(ValidationResults, { isValid: false, error: validation.error }) })), validation.isValid && validation.data && (_jsxs("div", { className: "section", children: [_jsx("h2", { children: "Preview" }), _jsx(PreviewTable, { data: validation.data }), _jsx("div", { className: "button-group", children: _jsx("button", { onClick: handleCreateStyles, disabled: processing.isProcessing, className: "button primary", children: processing.isProcessing ? 'Creating Styles...' : 'Create/Update Styles' }) })] })), processing.result && (_jsxs("div", { className: "section", children: [_jsx("h2", { children: "Results" }), _jsx(ResultsSummary, { result: processing.result })] })), processing.error && (_jsx("div", { className: "section", children: _jsxs("div", { className: "error-message", children: [_jsx("h3", { children: "Error" }), _jsx("p", { children: processing.error })] }) })), showSample && (_jsx("div", { className: "section", children: _jsx(SampleData, { onClose: () => setShowSample(false) }) }))] }), _jsx("footer", { className: "app-footer", children: _jsx("button", { onClick: handleCancel, className: "button secondary", children: "Cancel" }) })] }));
};
export default App;
