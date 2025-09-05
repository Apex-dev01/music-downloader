const fetch = require('node-fetch');

// This is a Vercel serverless function to proxy SoundCloud audio streams and bypass CORS
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL parameter is required.');
    }

    try {
        const response = await fetch(url, {
            headers: {
                // Forward the Range header if it exists, for audio seeking
                'Range': req.headers.range || ''
            }
        });
        
        if (!response.ok) {
            return res.status(response.status).send(response.statusText);
        }

        // Forward headers from the SoundCloud response to our client
        res.setHeader('Content-Type', response.headers.get('Content-Type'));
        res.setHeader('Content-Length', response.headers.get('Content-Length'));
        if (response.headers.get('Content-Range')) {
             res.setHeader('Content-Range', response.headers.get('Content-Range'));
        }

        // Vercel handles streaming the body automatically
        res.status(response.status);
        response.body.pipe(res);

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send('Error fetching the requested resource.');
    }
};
