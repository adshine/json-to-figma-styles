import React, { useCallback, useState } from 'react';

interface FileInputProps {
  onFileUpload: (file: File) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File): boolean => {
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

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="file-input">
      <div
        className={`file-drop-zone ${isDragOver ? 'drag-over' : ''} ${error ? 'error' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        aria-label="File drop zone"
      >
        <div className="file-drop-content">
          <div className="file-icon">📄</div>
          <p>Drop your JSON file here</p>
          <p className="file-hint">or click to browse</p>
          {error && <p className="error-message">{error}</p>}
        </div>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="file-input-hidden"
          aria-label="Select JSON file"
          tabIndex={-1}
        />
      </div>
    </div>
  );
};

export default FileInput;
