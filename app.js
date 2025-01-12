const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Define the destination directory
const destinationDir = "/sdcard/Download/termux/";

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to download the video
app.post('/download', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }

    const filename = `${url.split('v=')[1]}.mp4`;  // Simple way to create a filename
    const outputPath = path.join(destinationDir, filename);

    // Ensure destination directory exists
    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
    }

    // Construct the yt-dlp command to download the video
    const command = `yt-dlp -f bestvideo+bestaudio/best -o "${outputPath}" ${url}`;

    // Execute yt-dlp command
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error('Error downloading video:', err);
            return res.status(500).json({ error: 'Error downloading the video.' });
        }

        if (stderr) {
            console.error('yt-dlp stderr:', stderr);
            return res.status(500).json({ error: 'Error processing the video.' });
        }

        console.log(stdout);
        res.status(200).json({ message: `Downloaded and saved to ${outputPath}` });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
