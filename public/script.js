document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    const responseText = document.getElementById('response');

    responseText.textContent = 'Downloading...';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();
        if (response.ok) {
            responseText.textContent = data.message;
        } else {
            responseText.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        responseText.textContent = 'An error occurred while processing your request.';
        console.error(error);
    }
});
