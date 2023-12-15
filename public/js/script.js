$(document).ready(function () {
  // Show all events initially
  showEvents('all');

  // Handle tab clicks
  $('.tab').on('click', function () {
    const category = $(this).data('category');
    showEvents(category);

    // Remove active class from all tabs
    $('.tab').removeClass('active');

    // Add active class to the clicked tab
    $(this).addClass('active');
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
