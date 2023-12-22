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

  // Handle search button click
  $('#searchButton').on('click', function () {
    const searchTerm = $('#searchInput').val().toLowerCase();
    searchEvents(searchTerm);
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

  function searchEvents(searchTerm) {
    // Hide all events
    $('.events-container .col-lg-3').hide();

    // Show events that match the search term
    $('.events-container .col-lg-3').filter(function() {
      return $(this).text().toLowerCase().includes(searchTerm);
    }).show();
  }
});

(function() {
  const form = document.querySelector('#contact-form');

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.elements['first-name'].value,
          lastName: form.elements['last-name'].value,
          email: form.elements['email'].value,
          phone: form.elements['phone'].value,
          message: form.elements['message'].value,
        })
      });

      // Check for success or error status
      if (response.ok) {
        window.location.reload()
        form.reset();
      } else {
        const errorData = await response.json();
        console.log(errorData);
      }
    } catch (error) {
      console.error(error);
    }
  });
})();
