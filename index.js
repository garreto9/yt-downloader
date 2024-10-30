const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    const format = req.query.format || 'video';
    const quality = req.query.quality || 'highest';
    
    console.log(`URL recebida: ${videoURL}, Formato: ${format}, Qualidade: ${quality}`);

    if (!ytdl.validateURL(videoURL)) {
        console.log('URL inválida:', videoURL);
        return res.status(400).send('URL inválida!');
    }

    try {
        console.log('Obtendo informações do vídeo...');
        const videoInfo = await ytdl.getInfo(videoURL);

        let title = videoInfo.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '_').replace(/[^\x20-\x7E]/g, '');
        console.log(`Iniciando download: ${title}`);

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(title)}.${format === 'audio' ? 'mp3' : 'mp4'}"`
        );

        const videoStream = ytdl(videoURL, {
            filter: format === 'audio' ? 'audioonly' : 'audioandvideo',
            quality: quality,
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': '*/*',
                    'Referer': 'https://www.youtube.com/',
                    'Origin': 'https://www.youtube.com',
                    'Connection': 'keep-alive',
                }
            }
        });

        videoStream.on('response', () => console.log('Streaming iniciado...'));
        videoStream.on('data', chunk => console.log(`Chunk recebido: ${chunk.length} bytes`));
        videoStream.on('end', () => {
            console.log('Streaming finalizado.');
            res.end();
        });

        videoStream.on('error', (err) => {
            console.error('Erro no streaming:', err);
            res.status(500).send('Erro durante o download.');
        });

        videoStream.pipe(res);
    } catch (error) {
        console.error('Erro ao baixar o vídeo:', error);
        res.status(500).send('Erro ao processar o vídeo.');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});



