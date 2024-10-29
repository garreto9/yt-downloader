async function downloadVideo() {
    const url = document.getElementById('videoUrl').value;

    if (!url) {
        alert('Por favor, insira uma URL!');
        return;
    }

    console.log('URL do vídeo:', url); // Log da URL inserida

    try {
        // Faz uma chamada ao backend na rota /download
        const response = await fetch(`http://localhost:3000/download?url=${encodeURIComponent(url)}`);
        
        console.log('Resposta do servidor:', response); // Log da resposta do servidor

        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'video.mp4';
            link.click();

            URL.revokeObjectURL(link.href); // Libera a memória usada
        } else {
            alert('Falha ao baixar o vídeo.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao tentar baixar o vídeo.');
    }
}


