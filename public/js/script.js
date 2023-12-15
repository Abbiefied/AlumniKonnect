$(document).ready(function () {
  // Show all events initially
  showEvents('all');

  // Handle tab clicks
  $('.tab').on('click', function () {
      const category = $(this).data('category');
      showEvents(category);
  });

  function showEvents(category) {
      // Hide all events
      $('.events-container .col-lg-3').hide();

      // Show events of the selected category
      if (category === 'all') {
          $('.events-container .col-lg-3').show();
      } else {
          $(`.events-container .col-lg-3[data-category="${category}"]`).show();
      }
  }

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const successMessage = urlParams.get('success');

  if (successMessage) {
      alert(successMessage);
  }
});
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const showSignup = urlParams.get('show') === 'signup';

    const authCard = document.getElementById('authCard');
    const checkbox = document.getElementById('reg-log');

    if (authCard && checkbox) {
      checkbox.checked = showSignup; // Set the checkbox based on the URL parameter

      checkbox.addEventListener('change', function () {
        authCard.classList.toggle('show-login', !checkbox.checked);
      });
    }
 });
});




// // document.getElementById('image').addEventListener('change', function() {
// //     const preview = document.getElementById('event-preview');
// //     const file = this.files[0];
// //     const reader = new FileReader();

// //     reader.onload = function() {
// //       const img = new Image();
// //       img.src = reader.result;
// //       img.className = 'img-fluid';
// //       preview.innerHTML = '';
// //       preview.appendChild(img);
// //     }

// //     reader.readAsDataURL(file);
// // });

//     function submitForm(event) {
//         event.preventDefault();

//         const formData = new FormData(event.target);
//         const eventId = "{{event._id}}";

//         fetch(`/events/${eventId}`, {
//             method: 'PUT',
//             body: formData
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Handle successful response
//             console.log(data);
//             // Redirect or show a success message
//         })
//         .catch(error => {
//             // Handle error
//             console.error('Error:', error);
//         });
//     }

