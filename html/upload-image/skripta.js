function downloadImage() {
    const fileName = document.getElementById("fileName").value;
    const resultDiv = document.getElementById("result");

    // Kreiraj URL za zahtev
    const url = `http://burp.local:5291/api/File/download?fileName=${encodeURIComponent(fileName)}`;

    // Pošalji GET zahtev
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Image not found or an error occurred");
            }
            return response.blob(); // Konvertuj odgovor u binarni podatak
        })
        .then(blob => {
            // Prikaz slike na ekranu
            const img = document.createElement("img");
            img.src = URL.createObjectURL(blob);
            img.alt = "Downloaded Image";
            img.style.maxWidth = "100%";
            img.style.marginTop = "20px";

            // Očisti prethodni rezultat i prikaži sliku
            resultDiv.innerHTML = "";
            resultDiv.appendChild(img);
        })
        .catch(error => {
            // Prikaz greške
            resultDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
}

function uploadFile() {
    const fileInput = document.getElementById("uploadFile").files[0];
    const formData = new FormData();
    formData.append("file", fileInput);

    fetch("http://burp.local:5291/api/File/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("result").innerHTML = `<p>${data}</p>`;
    })
    .catch(error => {
        document.getElementById("result").innerHTML = `<p style="color:red;">${error}</p>`;
    });
}

