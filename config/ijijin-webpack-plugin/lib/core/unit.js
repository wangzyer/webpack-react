/**
 * px转vw
 */
function px2vw(px, viewportUnit = 375) {
    return `${(px / viewportUnit).toFixed(3)}vw`
}

module.exports = {
    px2vw
};