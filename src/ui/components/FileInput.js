import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
const FileInput = ({ onFileUpload }) => {
    const [error, setError] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const validateFile = (file) => {
        // More robust file validation
        const isValidType = file.type === 'application/json' ||
            file.name.toLowerCase().endsWith('.json');
        if (!isValidType) {
            setError('Please select a JSON file');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size must be less than 10MB');
            return false;
        }
        setError(null);
        return true;
    };
    const handleFileChange = useCallback((event) => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file && validateFile(file)) {
            onFileUpload(file);
        }
    }, [onFileUpload]);
    const handleDrop = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file && validateFile(file)) {
            onFileUpload(file);
        }
    }, [onFileUpload]);
    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(true);
    }, []);
    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(false);
    }, []);
    return (_jsx("div", { className: "file-input", children: _jsxs("div", { className: `file-drop-zone ${isDragOver ? 'drag-over' : ''} ${error ? 'error' : ''}`, onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, role: "button", tabIndex: 0, "aria-label": "File drop zone", children: [_jsxs("div", { className: "file-drop-content", children: [_jsx("div", { className: "file-icon", children: "\uD83D\uDCC4" }), _jsx("p", { children: "Drop your JSON file here" }), _jsx("p", { className: "file-hint", children: "or click to browse" }), error && _jsx("p", { className: "error-message", children: error })] }), _jsx("input", { type: "file", accept: ".json", onChange: handleFileChange, className: "file-input-hidden", "aria-label": "Select JSON file", tabIndex: -1 })] }) }));
};
export default FileInput;
