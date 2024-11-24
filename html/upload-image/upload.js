
document.addEventListener("DOMContentLoaded", () => {
    const userKey = "user";
    const userString = localStorage.getItem(userKey);

    if (!userString) {
        console.error("User not found in localStorage.");
        return;
    }

    try {
        const user = JSON.parse(userString);

        // Prikaz korisničkih informacija u DOM-u
        const headerContainer = document.getElementById("container");
        headerContainer.innerHTML += `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>User ID:</strong> ${user.id}</p>
            <p><strong>Created At:</strong> ${new Date(user.createdAtUtc).toLocaleString()}</p>
        `;
    } catch (error) {
        console.error("Failed to parse user JSON:", error);
    }
});


function showUploadButton() {
    // Prikazuje dugme za upload nakon odabira fajla
    const uploadButton = document.getElementById("uploadButton");
    const fileInput = document.getElementById("uploadFile");

    if (fileInput.files.length > 0) {
        uploadButton.style.display = "block";
    }
}

function triggerFileInput() {
    // Otvara prozor za biranje fajla
    document.getElementById("uploadFile").click();
}

function previewImage(event) {
    const fileInput = event.target;
    const uploadButton = document.getElementById("uploadButton");
    const previewImage = document.getElementById("previewImage");
    const uploadPlus = document.getElementById("uploadPlus");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Postavlja učitanu sliku kao sadržaj kruga
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
            uploadPlus.style.display = "none"; // Sakriva plus znak
        };

        reader.readAsDataURL(fileInput.files[0]);

        // Prikazuje dugme za upload
        uploadButton.style.display = "block";
    }
}

function uploadFile() {
    const fileInput = document.getElementById("uploadFile").files[0];
    const formData = new FormData();
    formData.append("file", fileInput);

    fetch("http://burp.local:5291/api/File/upload", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("File upload failed");
        }
        return response.text(); // Pretpostavljamo da server vraća poruku o uspehu
    })
    .then(data => {
        document.getElementById("result").innerHTML = `<p>${data}</p>`;

        // Automatski poziv funkcije downloadImage sa imenom uploadovanog fajla
        const fileName = fileInput.name; // Koristi naziv fajla iz input-a
        downloadImage(fileName);
    })
    .catch(error => {
        document.getElementById("result").innerHTML = `<p style="color:red;">${error}</p>`;
    });
}

function downloadImage(fileName = null) {
    fileName = fileName || document.getElementById("fileName").value;
    const resultDiv = document.getElementById("previewImage");

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
            // const img = document.createElement("img");
            // img.src = URL.createObjectURL(blob);
            // img.alt = "Downloaded Image";
            // img.style.width = "100px";
            // img.style.marginTop = "20px";

            // Očisti prethodni rezultat i prikaži sliku
            resultDiv.src = URL.createObjectURL(blob);
            resultDiv.alt = "Downloaded image"
            // resultDiv.appendChild(img);
        })
        .catch(error => {
            // Prikaz greške
            resultDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
}





