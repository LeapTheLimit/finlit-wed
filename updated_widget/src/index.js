const widgetContainer = document.getElementById('finlit-widget-container');

if (widgetContainer) {
    const root = ReactDOM.createRoot(widgetContainer);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} 
