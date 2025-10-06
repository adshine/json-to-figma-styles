import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ValidationResults = ({ isValid, error }) => {
    if (isValid) {
        return (_jsxs("div", { className: "success-message", children: [_jsx("h3", { children: "\u2705 Validation Successful" }), _jsx("p", { children: "Your JSON is valid and ready to convert to Figma styles." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "error-message", children: [_jsx("h3", { children: "\u274C Validation Failed" }), _jsx("p", { children: error })] }));
    }
    return null;
};
export default ValidationResults;
