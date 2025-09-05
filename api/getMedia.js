const play = require('play-dl');

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
        const sourceType = await play.validate(url);

        if (sourceType === 'yt_video') {
            // --- Process YouTube URL ---
            // Set User-Agent and a consent cookie inside the YouTube block to avoid conflicts
            await play.setToken({
                youtube: {
                    // Using a generic consent cookie
                    cookie: 'CONSENT=YES+;' 
                },
                useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            });

            const info = await play.video_info(url);
            const formats = info.format.map(format => ({
                qualityLabel: format.qualityLabel,
                container: format.mimeType ? format.mimeType.split(';')[0].split('/')[1] : 'unknown',
                hasVideo: !!format.qualityLabel,
                hasAudio: !!format.audioBitrate,
                url: format.url,
                contentLength: format.contentLength,
            }));

            res.status(200).json({
                success: true,
                source: 'YouTube',
                title: info.video_details.title,
                thumbnail: info.video_details.thumbnails[info.video_details.thumbnails.length - 1].url,
                formats: formats,
            });
        } else if (sourceType === 'so_track') {
            // --- Process SoundCloud URL ---
            // Get a new client ID for SoundCloud and validate it
            const soundCloudClientId = await play.getFreeClientID();
            if (!soundCloudClientId) {
                throw new Error("Failed to get a SoundCloud client ID. The service may be temporarily unavailable.");
            }
            // Set the token specifically for SoundCloud
            await play.setToken({
              soundcloud : {
                client_id : soundCloudClientId
              }
            });
            
            const so_info = await play.soundcloud(url);
            const stream = await play.stream_from_info(so_info);

            res.status(200).json({
                success: true,
                source: 'SoundCloud',
                title: so_info.name,
                thumbnail: so_info.thumbnail.replace('-large.jpg', '-t500x500.jpg'),
                streamUrl: stream.url,
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid or unsupported URL. Please use a valid YouTube or SoundCloud URL.' });
        }
    } catch (error) {
        // Log the full error for better debugging on the server side
        console.error("Full error object:", error);
        res.status(500).json({ success: false, message: error.message || 'An internal server error occurred.' });
    }
};

