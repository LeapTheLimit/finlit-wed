import React from 'react';
import ReactDOM from 'react-dom';
import ReactToWebComponent from 'react-to-webcomponent';
import App from './App';
import './index.css';
import './App.css';
import { defineCustomElements } from '@webcomponents/custom-elements';

// Define the custom element
const FinlitWidget = ReactToWebComponent(App, React, ReactDOM);
customElements.define('finlit-widget', FinlitWidget);

// Ensure the polyfill is included for older browsers
defineCustomElements();
