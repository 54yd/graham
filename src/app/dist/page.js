"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
function HomePage() {
    var _this = this;
    var _a = react_1.useState(null), file = _a[0], setFile = _a[1];
    var _b = react_1.useState(""), timestamps = _b[0], setTimestamps = _b[1];
    var handleFileChange = function (e) {
        if (e.target.files)
            setFile(e.target.files[0]);
    };
    var handleSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var formData, response, data, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!file || !timestamps) {
                        alert("Please upload a file and provide timestamps.");
                        return [2 /*return*/];
                    }
                    formData = new FormData();
                    formData.append("video", file);
                    formData.append("input", timestamps);
                    return [4 /*yield*/, fetch("/api/fixture", {
                            method: "POST",
                            body: formData
                        })];
                case 1:
                    response = _d.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _d.sent();
                    console.log("Segments:", data.segments);
                    return [3 /*break*/, 5];
                case 3:
                    _b = (_a = console).error;
                    _c = ["Error:"];
                    return [4 /*yield*/, response.json()];
                case 4:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    _d.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "container p-4 mx-auto" },
        React.createElement(card_1.Card, { className: "w-full max-w-2xl mx-auto" },
            React.createElement(card_1.CardHeader, null,
                React.createElement(card_1.CardTitle, null, "Movie Auto Cutter"),
                React.createElement(card_1.CardDescription, null, "Upload a video and provide timestamps to cut it automatically.")),
            React.createElement(card_1.CardContent, { className: "space-y-4" },
                React.createElement("div", { className: "grid w-full max-w-sm items-center gap-1.5" },
                    React.createElement(input_1.Input, { id: "video", type: "file", accept: "video/mp4", onChange: handleFileChange })),
                React.createElement("div", { className: "grid w-full gap-1.5" },
                    React.createElement(textarea_1.Textarea, { placeholder: "Enter timestamps (one per line, e.g., 00:00:03)", value: timestamps, onChange: function (e) { return setTimestamps(e.target.value); }, rows: 4 })),
                React.createElement(button_1.Button, { onClick: handleSubmit, className: "w-full" },
                    React.createElement(lucide_react_1.Send, { className: "w-4 h-4 mr-2" }),
                    " Send")))));
}
exports["default"] = HomePage;
