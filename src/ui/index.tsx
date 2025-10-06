import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('React index.tsx loaded');

const container = document.getElementById('root');
if (container) {
  console.log('Root container found, creating React root');
  const root = createRoot(container);
  console.log('Rendering App component');
  root.render(<App />);
} else {
  console.error('Root container not found');
}
