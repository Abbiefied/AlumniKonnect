document.getElementById('image').addEventListener('change', function() {
    const preview = document.getElementById('event-preview');
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function() {
      const img = new Image();
      img.src = reader.result;
      img.className = 'img-fluid';
      preview.innerHTML = '';
      preview.appendChild(img);
    }

    reader.readAsDataURL(file);
});
