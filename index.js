const readline = require('readline');

// Function to adjust the color
function adjustColor(hexColor, maxNumber, reqNumber) {
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    };
    const rgbToHex = (r, g, b) => {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };
    const adjustBrightness = (rgb, ratio) => {
        return rgb.map(color => Math.min(255, Math.round(color + (255 - color) * ratio)));
    };
    const rgb = hexToRgb(hexColor);
    const ratio = 1 - (reqNumber / maxNumber); // Invert the ratio for lightening
    const adjustedRgb = adjustBrightness(rgb, ratio);
    return rgbToHex(...adjustedRgb);
}

// Set up readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Validate if the input is a valid HEX color
function isValidHex(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
}

// Validate if the input is an integer
function isValidInteger(input) {
    return /^\d+$/.test(input);
}

// Synchronously capture user input
function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    try {
        const hexColor = await askQuestion('Enter HEX color value (e.g., #FF5733): ');
        if (!isValidHex(hexColor)) {
            throw new Error('This is not a valid HEX color.');
        }

        const maxNumber = await askQuestion('Enter max number: ');
        if (!isValidInteger(maxNumber)) {
            throw new Error('Input number should be an integer.');
        }

        const reqNumber = await askQuestion('Enter required number: ');
        if (!isValidInteger(reqNumber)) {
            throw new Error('Input number should be an integer.');
        }

        const adjustedColor = adjustColor(hexColor, parseInt(maxNumber), parseInt(reqNumber));
        console.log(`The adjusted HEX color is: ${adjustedColor}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        rl.close();
    }
}

main();
