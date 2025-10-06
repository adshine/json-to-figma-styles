import React from 'react';

interface ValidationResultsProps {
  isValid: boolean;
  error?: string | null;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ isValid, error }) => {
  if (isValid) {
    return (
      <div className="success-message">
        <h3>✅ Validation Successful</h3>
        <p>Your JSON is valid and ready to convert to Figma styles.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>❌ Validation Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  return null;
};

export default ValidationResults;
