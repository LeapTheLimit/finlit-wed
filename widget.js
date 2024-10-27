import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './App.css';

class FinlitWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.shadowRoot.appendChild(mountPoint);

    // Create a style element to ensure styles are applied
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Add any global widget-specific styles here to avoid conflicts */
      #finlit-widget-root {
        font-family: Arial, sans-serif;
        color: #333;
      }
      /* Custom styles from App.css and index.css */
      ${require('./index.css').toString()}
      ${require('./App.css').toString()}
    `;
    this.shadowRoot.appendChild(styleElement);

    ReactDOM.render(<App />, mountPoint);
  }
}

// Define the custom element
customElements.define('finlit-widget', FinlitWidget);
