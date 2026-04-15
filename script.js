// Firebase Configuration (v8.10.1 - ES5 compatible)
var firebaseConfig = {

    apiKey: "AIzaSyCRIOhlw3kVcr2FQ6W-Y4MKqY39v_M6zHk",
    authDomain: "my-hackathon-ac83e.firebaseapp.com",
    databaseURL: "https://my-hackathon-ac83e-default-rtdb.firebaseio.com",
    projectId: "my-hackathon-ac83e",
    storageBucket: "my-hackathon-ac83e.firebasestorage.app",
    messagingSenderId: "58528648961",
    appId: "1:58528648961:web:42db255040bfdbe0ad5500",
    measurementId: "G-5S9W5N4CHS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Set active navigation link based on current page
function setActiveNav() {
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.nav-links a');
  
  for (var i = 0; i < navLinks.length; i++) {
    var href = navLinks[i].getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      navLinks[i].classList.add('active');
    }
  }
}

// Handle floor selection from URL parameter (for booking page)
function handleFloorParam() {
  var urlParams = new URLSearchParams(window.location.search);
  var floor = urlParams.get('floor');
  var houseSelect = document.getElementById('bookHouse');
  
  if (houseSelect && floor) {
    if (floor === '1st') houseSelect.value = '1st Floor (2 bed, 1 bath) · PKR 25k';
    else if (floor === '2nd') houseSelect.value = '2nd Floor (2 bed, 1 bath) · PKR 24k';
    else if (floor === '3rd') houseSelect.value = '3rd Floor (3 bed, 2 bath) · PKR 32k';
    else if (floor === '4th') houseSelect.value = '4th Floor (1 bed, 1 bath) · PKR 18k';
  }
}

// Booking Form Handler
function initBookingForm() {
  var bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;
  
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    var name = document.getElementById('bookName').value.trim();
    var email = document.getElementById('bookEmail').value.trim();
    var phone = document.getElementById('bookPhone').value.trim();
    var house = document.getElementById('bookHouse').value;
    var movein = document.getElementById('bookMovein').value;
    var notes = document.getElementById('bookNotes').value;
    var feedback = document.getElementById('bookingFeedback');
    
    if (!name || !email || !phone || !house || !movein) {
      feedback.innerHTML = '<span style="color:#b34e4e;">⚠️ Please fill all required fields.</span>';
      return;
    }
    
    var bookingData = {
      fullName: name,
      email: email,
      phone: phone,
      house: house,
      moveinDate: movein,
      message: notes || '',
    //   timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    var bookingIds = Math.floor(Math.random() * 1000000) + 1; // Generate random booking ID
    var newBookingRef = database.ref('bookings/' + bookingIds);
    newBookingRef.set(bookingData, function(error) {
      if (error) {
        feedback.innerHTML = '<span style="color:#b34e4e;">❌ Error. Please try again.</span>';
      } else {
        feedback.innerHTML = '<span style="color:#1b6b6b;">✅ Booking sent! We\'ll contact you soon.</span>';
        bookingForm.reset();
      }
    });
  });
}

// Contact Form Handler
function initContactForm() {
  var contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    var cName = document.getElementById('contactName').value.trim();
    var cEmail = document.getElementById('contactEmail').value.trim();
    var cPhone = document.getElementById('contactPhone').value.trim();
    var cMsg = document.getElementById('contactMessage').value.trim();
    var fbDiv = document.getElementById('contactFeedback');
    
    if (!cName || !cEmail || !cMsg) {
      fbDiv.innerHTML = '<span style="color:#b34e4e;">⚠️ Name, email & message required.</span>';
      return;
    }
    
    var contactData = {
      name: cName,
      email: cEmail,
      phone: cPhone || 'not provided',
      message: cMsg,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    database.ref('contacts').push(contactData, function(error) {
      if (error) {
        fbDiv.innerHTML = '<span style="color:#b34e4e;">❌ Error sending message.</span>';
      } else {
        fbDiv.innerHTML = '<span style="color:#1b6b6b;">✅ Message sent! We\'ll reply shortly.</span>';
        contactForm.reset();
      }
    });
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setActiveNav();
  handleFloorParam();
  initBookingForm();
  initContactForm();
});