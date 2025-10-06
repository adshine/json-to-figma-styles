import React from 'react';

interface PreviewTableProps {
  data: any;
}

const PreviewTable: React.FC<PreviewTableProps> = ({ data }) => {
  const totalStyles = 
    (data.paintStyles?.length || 0) +
    (data.textStyles?.length || 0) +
    (data.effectStyles?.length || 0) +
    (data.gridStyles?.length || 0);

  return (
    <div className="preview-table">
      <div className="preview-summary">
        <h3>Styles to be processed: {totalStyles}</h3>
        <div className="preview-counts">
          {data.paintStyles && data.paintStyles.length > 0 && (
            <span className="count-item">
              🎨 {data.paintStyles.length} Paint Styles
            </span>
          )}
          {data.textStyles && data.textStyles.length > 0 && (
            <span className="count-item">
              📝 {data.textStyles.length} Text Styles
            </span>
          )}
          {data.effectStyles && data.effectStyles.length > 0 && (
            <span className="count-item">
              ✨ {data.effectStyles.length} Effect Styles
            </span>
          )}
          {data.gridStyles && data.gridStyles.length > 0 && (
            <span className="count-item">
              📐 {data.gridStyles.length} Grid Styles
            </span>
          )}
        </div>
      </div>

      <div className="preview-details">
        {data.paintStyles && data.paintStyles.length > 0 && (
          <div className="preview-section">
            <h4>Paint Styles</h4>
            <div className="preview-list">
              {data.paintStyles.map((style: any, index: number) => (
                <div key={index} className="preview-item">
                  <span className="item-name">{style.name}</span>
                  <span className="item-type">Paint</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.textStyles && data.textStyles.length > 0 && (
          <div className="preview-section">
            <h4>Text Styles</h4>
            <div className="preview-list">
              {data.textStyles.map((style: any, index: number) => (
                <div key={index} className="preview-item">
                  <span className="item-name">{style.name}</span>
                  <span className="item-type">Text</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.effectStyles && data.effectStyles.length > 0 && (
          <div className="preview-section">
            <h4>Effect Styles</h4>
            <div className="preview-list">
              {data.effectStyles.map((style: any, index: number) => (
                <div key={index} className="preview-item">
                  <span className="item-name">{style.name}</span>
                  <span className="item-type">Effect</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.gridStyles && data.gridStyles.length > 0 && (
          <div className="preview-section">
            <h4>Grid Styles</h4>
            <div className="preview-list">
              {data.gridStyles.map((style: any, index: number) => (
                <div key={index} className="preview-item">
                  <span className="item-name">{style.name}</span>
                  <span className="item-type">Grid</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewTable;
