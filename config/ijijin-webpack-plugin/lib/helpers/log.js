function errorLog(message) {
    let color = '\x1B[32m%s\x1B[0m';
    console.log(color, '==========================================================');
    console.log(color, message);
    console.log(color, '==========================================================');
}

function warnLog(message) {
    let color = '\x1B[33m%s\x1B[0m';
    console.log(color, '==========================================================');
    console.log(color, message);
    console.log(color, '==========================================================');
}

module.exports = {
    errorLog,
    warnLog
};