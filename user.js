document.addEventListener('DOMContentLoaded', function() {
  // Get all page elements
  const dashboard = document.getElementById('dashboard');
  const borrowingPage = document.getElementById('borrowingPage');
  const settingsPage = document.getElementById('settingsPage');
  
  // Get header elements
  const dashboardHeader = document.getElementById('dashboardHeader');
  const otherHeader = document.getElementById('otherHeader');
  
  // Get all navigation links
  const dashboardLink = document.getElementById('dashboardLink');
  const borrowingLink = document.getElementById('borrowingLink');
  const settingsLink = document.getElementById('settingsLink');
  const logoutLink = document.getElementById('logoutLink');
  
  // Get logout modal elements
  const logoutModal = document.getElementById('logoutModal');
  const cancelLogout = document.getElementById('cancelLogout');
  const confirmLogout = document.getElementById('confirmLogout');
  
  // Get back buttons (now there are two, one in each header)
  const backBtns = document.querySelectorAll('.back-btn');
  
  // Get sidebar and overlay
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  
  // Function to hide all pages
  function hideAllPages() {
      dashboard.style.display = 'none';
      borrowingPage.style.display = 'none';
      settingsPage.style.display = 'none';
      dashboardHeader.style.display = 'none';
      otherHeader.style.display = 'none';
  }
  
  // Function to update active link
  function updateActiveLink(activeLink) {
      // Remove active class from all nav items
      document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active');
      });
      // Add active class to clicked link
      activeLink.classList.add('active');
  }
  
  // Function to manage back button visibility
  function manageBackButton(currentPage) {
      backBtns.forEach(backBtn => {
          if (currentPage === 'dashboard') {
              backBtn.style.display = 'none';
          } else {
              backBtn.style.display = 'block';
          }
      });
  }
  
  // Function to close sidebar
  function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
  }
  
  // Dashboard navigation
  dashboardLink.addEventListener('click', function(e) {
      e.preventDefault();
      hideAllPages();
      dashboard.style.display = 'block';
      dashboardHeader.style.display = 'flex'; // Show dashboard header with search
      updateActiveLink(dashboardLink);
      manageBackButton('dashboard');
      closeSidebar(); // Close sidebar after navigation
  });
  
  // Borrowing navigation
  borrowingLink.addEventListener('click', function(e) {
      e.preventDefault();
      hideAllPages();
      borrowingPage.style.display = 'block';
      otherHeader.style.display = 'flex'; // Show header without search
      updateActiveLink(borrowingLink);
      manageBackButton('borrowing');
      closeSidebar(); // Close sidebar after navigation
  });
  
  // Settings navigation
  settingsLink.addEventListener('click', function(e) {
      e.preventDefault();
      hideAllPages();
      settingsPage.style.display = 'block';
      otherHeader.style.display = 'flex'; // Show header without search
      updateActiveLink(settingsLink);
      manageBackButton('settings');
      closeSidebar(); // Close sidebar after navigation
  });
  
  // Back button functionality - updated to work with both back buttons
  backBtns.forEach(backBtn => {
      backBtn.addEventListener('click', function() {
          hideAllPages();
          dashboard.style.display = 'block';
          dashboardHeader.style.display = 'flex'; // Show dashboard header with search
          updateActiveLink(dashboardLink);
          manageBackButton('dashboard');
      });
  });
  
  // Logout button click
  logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      logoutModal.style.display = 'flex';
      closeSidebar(); // Close sidebar when opening modal
  });
  
  // Cancel logout
  cancelLogout.addEventListener('click', function() {
      logoutModal.style.display = 'none';
  });
  
  // Confirm logout
  confirmLogout.addEventListener('click', function() {
      // Here you would typically redirect to login page
      alert('Logging out...');
      window.location.href = 'home.html'; // Redirect to login page
  });
  
  // Close modal if clicked outside of content
  logoutModal.addEventListener('click', function(e) {
      if (e.target === logoutModal) {
          logoutModal.style.display = 'none';
      }
  });
  
  // Initialize the UI - fix initial visibility bug
  hideAllPages();
  dashboard.style.display = 'block';
  dashboardHeader.style.display = 'flex'; // Show dashboard header initially
  updateActiveLink(dashboardLink);
  manageBackButton('dashboard');
  
  // Set current date as default for date input
  const checkoutDateInput = document.getElementById('checkoutTime');
  if (checkoutDateInput) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      checkoutDateInput.value = `${year}-${month}-${day}`;
  }
  
  // Set current time as default for time input
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  
  const returnTimeInput = document.getElementById('returnTime');
  if (returnTimeInput) returnTimeInput.value = currentTime;
  
  // Book selection functionality
  const bookCovers = document.querySelectorAll('.book-cover');
  const bookCodeInput = document.getElementById('bookCodeInput');
  const checkoutBookImage = document.getElementById('checkoutBookImage');
  
  // Create a new element for book title display
  const bookTitleInput = document.createElement('input');
  bookTitleInput.type = 'text';
  bookTitleInput.className = 'input-field';
  bookTitleInput.id = 'bookTitleInput';
  bookTitleInput.placeholder = 'Book Title';
  bookTitleInput.readOnly = true;
  
  // Insert bookTitleInput after bookCodeInput
  if (bookCodeInput) {
    bookCodeInput.parentNode.insertBefore(bookTitleInput, bookCodeInput.nextSibling);
  }
  
  bookCovers.forEach(bookCover => {
      bookCover.addEventListener('click', function() {
          // Get book code from data attribute
          const bookCode = this.getAttribute('data-book-code');
          const bookImgSrc = this.querySelector('img').getAttribute('data-book-src');
          
          // Get book title from parent book-card's book-title element
          const parentCard = this.closest('.book-card');
          const bookTitle = parentCard.querySelector('.book-title').textContent;
          
          // Switch to borrowing page
          hideAllPages();
          borrowingPage.style.display = 'block';
          otherHeader.style.display = 'flex'; // Show header without search
          updateActiveLink(borrowingLink);
          manageBackButton('borrowing');
          
          // Update book code input
          if (bookCodeInput) bookCodeInput.value = bookCode;
          
          // Update book title input
          const bookTitleInput = document.getElementById('bookTitleInput');
          if (bookTitleInput) bookTitleInput.value = bookTitle;
          
          // Update book image in checkout section
          if (checkoutBookImage) checkoutBookImage.src = bookImgSrc;
          
          // Visual feedback - add selected class to all book covers
          bookCovers.forEach(cover => {
              cover.classList.remove('selected');
          });
          this.classList.add('selected');
      });
  });
  
  // Preserve existing functionality for security section and photo upload
  // [Keep all the existing security section and photo upload code here]
  
  // Security section - Proceed button functionality
  const proceedBtn = document.querySelector('.proceed-btn');
  if (proceedBtn) {
      proceedBtn.addEventListener('click', function() {
          const securityContent = this.closest('.security-content');
          const passwordQuestion = securityContent.querySelector('.password-question');
          
          // Create password change form
          const passwordForm = document.createElement('div');
          passwordForm.className = 'password-form';
          passwordForm.innerHTML = `
              <div class="profile-field">
                  <label class="profile-label">Current Password</label>
                  <input type="password" class="profile-input" placeholder="Enter current password">
              </div>
              <div class="profile-field">
                  <label class="profile-label">New Password</label>
                  <input type="password" class="profile-input" placeholder="Enter new password">
              </div>
              <div class="profile-field">
                  <label class="profile-label">Confirm New Password</label>
                  <input type="password" class="profile-input" placeholder="Confirm new password">
              </div>
              <div class="password-buttons">
                  <button class="cancel-password-btn">Cancel</button>
                  <button class="save-password-btn">Save Changes</button>
              </div>
          `;
          
          // Hide question and proceed button
          passwordQuestion.style.display = 'none';
          this.style.display = 'none';
          
          // Add form to security content
          securityContent.appendChild(passwordForm);
          
          // Add cancel button functionality
          const cancelPasswordBtn = passwordForm.querySelector('.cancel-password-btn');
          cancelPasswordBtn.addEventListener('click', function() {
              passwordForm.remove();
              passwordQuestion.style.display = 'block';
              proceedBtn.style.display = 'block';
          });
          
          // Add save button functionality
          const savePasswordBtn = passwordForm.querySelector('.save-password-btn');
          savePasswordBtn.addEventListener('click', function() {
              // Here you would typically validate and save the new password
              alert('Password changed successfully!');
              passwordForm.remove();
              passwordQuestion.style.display = 'block';
              proceedBtn.style.display = 'block';
          });
      });
  }
  
  // Profile photo upload functionality
  const photoUploadBtn = document.querySelector('.photo-upload-btn');
  if (photoUploadBtn) {
      // Create hidden file input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      fileInput.id = 'profile-photo-input';
      document.body.appendChild(fileInput);
      
      // Trigger file input when photo upload button is clicked
      photoUploadBtn.addEventListener('click', function() {
          fileInput.click();
      });
      
      // Update profile photo when file is selected
      fileInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
              const reader = new FileReader();
              const profileAvatar = document.querySelector('.profile-avatar img');
              
              reader.onload = function(e) {
                  profileAvatar.src = e.target.result;
                  // Save the image to localStorage (in a real app, you would upload to server)
                  localStorage.setItem('profileImage', e.target.result);
              };
              
              reader.readAsDataURL(this.files[0]);
              alert('Profile photo updated successfully!');
          }
      });
      
      // Load profile image from localStorage if exists
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage) {
          const profileAvatar = document.querySelector('.profile-avatar img');
          profileAvatar.src = savedImage;
      }
  }
});

// Search functionality for the library system - only applies to dashboard now
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-input');
  const bookCards = document.querySelectorAll('.book-card');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      // If search is empty, show all books
      if (searchTerm === '') {
        bookCards.forEach(card => {
          card.style.display = 'flex';
          card.classList.remove('highlight');
        });
        return;
      }
      
      let foundMatch = false;
      
      // Loop through all book cards
      bookCards.forEach(card => {
        const bookTitle = card.querySelector('.book-title').textContent.toLowerCase();
        
        if (bookTitle.includes(searchTerm)) {
          // Show and highlight matching books
          card.style.display = 'flex';
          card.classList.add('highlight');
          foundMatch = true;
          
          // Scroll to the first matching book
          if (!window.hasScrolled && foundMatch) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.hasScrolled = true;
          }
        } else {
          // Hide non-matching books
          card.style.display = 'none';
          card.classList.remove('highlight');
        }
      });
      
      // Reset scroll flag when search is cleared
      if (searchTerm === '') {
        window.hasScrolled = false;
      }
    });
    
    // Clear search when clicking the search icon
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
      searchIcon.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      });
    }
  }
  
  // Add styles for highlighted books
  const style = document.createElement('style');
  style.textContent = `
    .book-card.highlight {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(144, 28, 28, 0.4);
      border: 2px solid #901C1C;
      position: relative;
      z-index: 10;
    }
    
    .search-input:focus {
      outline: none;
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    .search-icon {
      cursor: pointer;
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 5px 20px rgba(144, 28, 28, 0.4); }
      50% { box-shadow: 0 5px 25px rgba(144, 28, 28, 0.7); }
      100% { box-shadow: 0 5px 20px rgba(144, 28, 28, 0.4); }
    }
    
    .book-card.highlight {
      animation: pulse 2s infinite;
    }
  `;
  document.head.appendChild(style);
});

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}