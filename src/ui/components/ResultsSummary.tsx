import React from 'react';

interface ResultsSummaryProps {
  result: any;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result }) => {
  const { summary, results } = result;

  return (
    <div className="results-summary">
      <div className="results-header">
        <h3>✅ Processing Complete</h3>
        <div className="results-stats">
          <div className="stat-item created">
            <span className="stat-number">{summary.created}</span>
            <span className="stat-label">Created</span>
          </div>
          <div className="stat-item updated">
            <span className="stat-number">{summary.updated}</span>
            <span className="stat-label">Updated</span>
          </div>
          <div className="stat-item skipped">
            <span className="stat-number">{summary.skipped}</span>
            <span className="stat-label">Skipped</span>
          </div>
          <div className="stat-item total">
            <span className="stat-number">{summary.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="results-details">
          <h4>Details</h4>
          <div className="results-list">
            {results.map((item: any, index: number) => (
              <div key={index} className={`result-item ${item.action}`}>
                <span className="result-icon">
                  {item.action === 'created' && '✅'}
                  {item.action === 'updated' && '🔄'}
                  {item.action === 'skipped' && '⚠️'}
                </span>
                <span className="result-name">{item.name}</span>
                <span className="result-type">{item.type}</span>
                <span className="result-action">{item.action}</span>
                {item.error && (
                  <span className="result-error">{item.error}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="results-footer">
        <button 
          className="button secondary"
          onClick={() => {
            const report = `JSON to Figma Styles Report\n\n` +
              `Created: ${summary.created}\n` +
              `Updated: ${summary.updated}\n` +
              `Skipped: ${summary.skipped}\n` +
              `Total: ${summary.total}\n\n` +
              `Details:\n` +
              results.map((r: any) => `${r.action.toUpperCase()}: ${r.name} (${r.type})${r.error ? ` - ${r.error}` : ''}`).join('\n');
            
            navigator.clipboard.writeText(report);
            alert('Report copied to clipboard!');
          }}
        >
          Copy Report
        </button>
      </div>
    </div>
  );
};

export default ResultsSummary;
