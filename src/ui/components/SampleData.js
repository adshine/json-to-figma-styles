import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SampleData = ({ onClose }) => {
    const sampleJson = {
        "paintStyles": [
            {
                "name": "Brand/Primary/Blue 500",
                "description": "Main brand blue",
                "paints": [
                    { "type": "solid", "hex": "#1E40AF", "opacity": 1 }
                ]
            },
            {
                "name": "Brand/Gradients/Hero Sky",
                "description": "Landing hero gradient",
                "paints": [
                    {
                        "type": "gradient-linear",
                        "stops": [
                            { "position": 0, "hex": "#60A5FA", "opacity": 1 },
                            { "position": 1, "hex": "#3B82F6", "opacity": 1 }
                        ],
                        "handles": [
                            { "x": 0, "y": 0 },
                            { "x": 1, "y": 1 },
                            { "x": 0, "y": 1 }
                        ]
                    }
                ]
            }
        ],
        "textStyles": [
            {
                "name": "Text/Heading/H1",
                "description": "Desktop H1",
                "font": { "family": "Inter", "style": "Bold" },
                "fontSize": 48,
                "lineHeight": { "unit": "PIXELS", "value": 56 },
                "letterSpacing": { "unit": "PERCENT", "value": 0 },
                "paragraphSpacing": 0,
                "textCase": "ORIGINAL",
                "textDecoration": "NONE"
            }
        ],
        "effectStyles": [
            {
                "name": "Effects/Shadows/Soft Elevation",
                "description": "Soft drop shadow",
                "effects": [
                    {
                        "type": "DROP_SHADOW",
                        "color": { "hex": "#000000", "opacity": 0.15 },
                        "offset": { "x": 0, "y": 8 },
                        "radius": 24,
                        "spread": 0,
                        "visible": true,
                        "blendMode": "NORMAL"
                    }
                ]
            }
        ],
        "gridStyles": [
            {
                "name": "Grids/Desktop/12 Col",
                "description": "12-col desktop grid",
                "gridType": "COLUMNS",
                "count": 12,
                "gutterSize": 24,
                "margin": 120,
                "alignment": "STRETCH",
                "color": { "r": 0.0, "g": 0.36, "b": 1.0, "a": 0.1 }
            }
        ]
    };
    const handleLoadSample = () => {
        parent.postMessage({
            pluginMessage: {
                type: 'validate-json',
                data: sampleJson,
            },
        }, '*');
        onClose();
    };
    return (_jsxs("div", { className: "sample-data", children: [_jsxs("div", { className: "sample-header", children: [_jsx("h3", { children: "Sample JSON Data" }), _jsx("button", { onClick: onClose, className: "button secondary", children: "\u00D7" })] }), _jsxs("div", { className: "sample-content", children: [_jsx("p", { children: "This sample includes examples of all supported style types:" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83C\uDFA8 Paint Styles (solid colors and gradients)" }), _jsx("li", { children: "\uD83D\uDCDD Text Styles (typography)" }), _jsx("li", { children: "\u2728 Effect Styles (shadows and blur)" }), _jsx("li", { children: "\uD83D\uDCD0 Grid Styles (layout grids)" })] }), _jsx("div", { className: "sample-json", children: _jsx("pre", { children: JSON.stringify(sampleJson, null, 2) }) }), _jsxs("div", { className: "button-group", children: [_jsx("button", { onClick: handleLoadSample, className: "button primary", children: "Load Sample Data" }), _jsx("button", { onClick: () => {
                                    navigator.clipboard.writeText(JSON.stringify(sampleJson, null, 2));
                                    alert('Sample JSON copied to clipboard!');
                                }, className: "button secondary", children: "Copy JSON" })] })] })] }));
};
export default SampleData;
