const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001; // Use Replit's port or default to 3001

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// API route to calculate ratio from hex color
app.post("/calculate-ratio", (req, res) => {
    try {
        const { hexColor, minVal, maxVal } = req.body;

        if (!hexColor || minVal === undefined || maxVal === undefined) {
            return res.status(400).json({
                error: "Missing required parameters: hexColor, minVal, and maxVal are required.",
            });
        }

        // Validate the hex color
        if (!/^#?[0-9A-Fa-f]{6}$/.test(hexColor)) {
            return res.status(400).json({
                error: "Invalid hex color. Please provide a valid 6-character hex color code.",
            });
        }

        // Validate minVal and maxVal
        if (isNaN(minVal) || isNaN(maxVal) || minVal < 0 || maxVal > 255) {
            return res.status(400).json({
                error: "minVal and maxVal should be numbers between 0 and 255.",
            });
        }

        const ratio = calculateRatioFromHex(hexColor, minVal, maxVal);
        res.json({ originalColor: hexColor, ratio });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Function to calculate ratio from hex color
function calculateRatioFromHex(hexColor, minVal, maxVal) {
    hexColor = hexColor.replace("#", "");
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);

    // Calculate the ratio using all RGB components
    const avgColor = (r + g + b) / 3;
    const ratio = ((avgColor - minVal) / (maxVal - minVal)) * 100;

    return ratio;
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
