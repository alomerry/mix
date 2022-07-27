"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediumZoomPlugin = void 0;
const plugin_medium_zoom_1 = require("@vuepress/plugin-medium-zoom");
const getMediumZoomPlugin = (mediumZoom) => {
    if (mediumZoom === false)
        return [];
    return (0, plugin_medium_zoom_1.mediumZoomPlugin)({
        selector: ".theme-gungnir-content > img, .theme-gungnir-content :not(a) > img",
        zoomOptions: {},
        // should greater than page transition duration
        delay: 300
    });
};
exports.getMediumZoomPlugin = getMediumZoomPlugin;
