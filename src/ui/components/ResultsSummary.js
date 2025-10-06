import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ResultsSummary = ({ result }) => {
    const { summary, results } = result;
    return (_jsxs("div", { className: "results-summary", children: [_jsxs("div", { className: "results-header", children: [_jsx("h3", { children: "\u2705 Processing Complete" }), _jsxs("div", { className: "results-stats", children: [_jsxs("div", { className: "stat-item created", children: [_jsx("span", { className: "stat-number", children: summary.created }), _jsx("span", { className: "stat-label", children: "Created" })] }), _jsxs("div", { className: "stat-item updated", children: [_jsx("span", { className: "stat-number", children: summary.updated }), _jsx("span", { className: "stat-label", children: "Updated" })] }), _jsxs("div", { className: "stat-item skipped", children: [_jsx("span", { className: "stat-number", children: summary.skipped }), _jsx("span", { className: "stat-label", children: "Skipped" })] }), _jsxs("div", { className: "stat-item total", children: [_jsx("span", { className: "stat-number", children: summary.total }), _jsx("span", { className: "stat-label", children: "Total" })] })] })] }), results.length > 0 && (_jsxs("div", { className: "results-details", children: [_jsx("h4", { children: "Details" }), _jsx("div", { className: "results-list", children: results.map((item, index) => (_jsxs("div", { className: `result-item ${item.action}`, children: [_jsxs("span", { className: "result-icon", children: [item.action === 'created' && '✅', item.action === 'updated' && '🔄', item.action === 'skipped' && '⚠️'] }), _jsx("span", { className: "result-name", children: item.name }), _jsx("span", { className: "result-type", children: item.type }), _jsx("span", { className: "result-action", children: item.action }), item.error && (_jsx("span", { className: "result-error", children: item.error }))] }, index))) })] })), _jsx("div", { className: "results-footer", children: _jsx("button", { className: "button secondary", onClick: () => {
                        const report = `JSON to Figma Styles Report\n\n` +
                            `Created: ${summary.created}\n` +
                            `Updated: ${summary.updated}\n` +
                            `Skipped: ${summary.skipped}\n` +
                            `Total: ${summary.total}\n\n` +
                            `Details:\n` +
                            results.map((r) => `${r.action.toUpperCase()}: ${r.name} (${r.type})${r.error ? ` - ${r.error}` : ''}`).join('\n');
                        navigator.clipboard.writeText(report);
                        alert('Report copied to clipboard!');
                    }, children: "Copy Report" }) })] }));
};
export default ResultsSummary;
