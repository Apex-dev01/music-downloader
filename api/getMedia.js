const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default;

// This is a Vercel serverless function
module.exports = async (req, res) => {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ success: false, message: 'URL parameter is required.' });
    }

    try {
        if (ytdl.validateURL(url)) {
            // --- Process YouTube URL ---
            const info = await ytdl.getInfo(url);
            const formats = info.formats.map(format => ({
                itag: format.itag,
                qualityLabel: format.qualityLabel,
                container: format.container,
                hasVideo: format.hasVideo,
                hasAudio: format.hasAudio,
                url: format.url,
                contentLength: format.contentLength,
                audioBitrate: format.audioBitrate,
                mimeType: format.mimeType,
            }));

            res.status(200).json({
                success: true,
                source: 'YouTube',
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                formats: formats,
            });
        } else if (scdl.isValidUrl(url)) {
            // --- Process SoundCloud URL ---
            const info = await scdl.getInfo(url);
            
            // Find any progressive stream URL. This is more robust as it doesn't rely on a specific mime type.
            const progressiveStream = info.media.transcodings.find(t => t.format.protocol === 'progressive' && t.url);

            if (!progressiveStream) {
                return res.status(404).json({ success: false, message: 'Could not find a downloadable stream for this SoundCloud track.' });
            }

            res.status(200).json({
                success: true,
                source: 'SoundCloud',
                title: info.title,
                thumbnail: info.artwork_url.replace('-large.jpg', '-t500x500.jpg'), // Get larger artwork
                streamUrl: progressiveStream.url,
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid or unsupported URL. Please use a valid YouTube or SoundCloud URL.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'An internal server error occurred.' });
    }
};


