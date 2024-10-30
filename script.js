async function download() {
    const url = document.getElementById('videoUrl').value;
    const format = document.getElementById('format').value;
    const quality = document.getElementById('quality').value;

    if (!url) {
        alert('Por favor, insira uma URL!');
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`
        );

        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = format === 'audio' ? 'audio.mp3' : 'video.mp4';
            link.click();
            URL.revokeObjectURL(link.href);
        } else {
            alert('Erro ao baixar o arquivo.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao tentar baixar o arquivo.');
    }
}
