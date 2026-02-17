const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const statusText = document.getElementById("status");
const previewImage = document.getElementById("previewImage");
const imageUrlInput = document.getElementById("imageUrl");
const urlContainer = document.getElementById("urlContainer");
const copyBtn = document.getElementById("copyBtn");

const cloudName = "dy0homfkz";
const uploadPreset = "Christian_present";
fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Solo se permiten imágenes.");
    fileInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
  };
  reader.readAsDataURL(file);
});
uploadBtn.addEventListener("click", function () {
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona una imagen.");
    return;
  }

  uploadBtn.disabled = true;
  statusText.textContent = "Subiendo...";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la subida");
      }
      return response.json();
    })
    .then(data => {
  statusText.textContent = "Subida exitosa 🎉";
  const jpgUrl = data.secure_url.replace(
    "/upload/",
    "/upload/f_jpg/"
  );

  previewImage.src = jpgUrl;
  imageUrlInput.value = jpgUrl;
  urlContainer.style.display = "block";
})
    .catch(error => {
      console.error(error);
      statusText.textContent = "Error al subir la imagen ❌";
    })
    .finally(() => {
      uploadBtn.disabled = false;
    });
});
copyBtn.addEventListener("click", function () {
  imageUrlInput.select();
  document.execCommand("copy");
  alert("URL copiada al portapapeles ✅");
});