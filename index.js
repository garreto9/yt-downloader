const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;

    if (!ytdl.validateURL(videoURL)) {
        console.log('URL inválida:', videoURL);
        return res.status(400).send('URL inválida!');
    }

    try {
        console.log('Obtendo informações do vídeo...');
        const videoInfo = await ytdl.getInfo(videoURL);

        let title = videoInfo.videoDetails.title;
        // Remove caracteres inválidos e não ASCII
        title = title
            .replace(/[\/\\?%*:|"<> ]/g, '_')
            .replace(/[^\x20-\x7E]/g, '');

        console.log(`Iniciando o download do vídeo: ${title}`);

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(title)}.mp4"`
        );

        const videoStream = ytdl(videoURL, { format: 'mp4' });

        // Logs para verificar o progresso
        videoStream.on('response', () => console.log('Download iniciado...'));
        videoStream.on('end', () => console.log('Download finalizado.'));

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
