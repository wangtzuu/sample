// User Profile Data Management Script
document.addEventListener('DOMContentLoaded', function() {
  // Function to get current user data from localStorage
  function getCurrentUser() {
    const userDataString = localStorage.getItem('currentUser');
    if (!userDataString) {
      console.warn('No user data found in localStorage');
      // Redirect to login page if no user is logged in
      window.location.href = 'index.html';
      return null;
    }
    
    try {
      return JSON.parse(userDataString);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Function to fetch complete user data from Supabase
  async function fetchUserData(userId, username) {
    // Supabase configuration - using the same config as your login/register scripts
    const supabaseUrl = 'https://xvxzvzzrgbsfdialxntu.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2eHp2enpyZ2JzZmRpYWx4bnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDQ4ODEsImV4cCI6MjA2MjE4MDg4MX0.s_07EucARbv2GJKMo3HKatiodaqo9WNJO-k1vLkog5E';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Query parameter - use userId if available, otherwise use username
    const queryParam = userId ? { field: 'id', value: userId } : { field: 'username', value: username };
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq(queryParam.field, queryParam.value)
        .single();
        
      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Unexpected error fetching user data:', err);
      return null;
    }
  }

  // Function to populate user profile data in settings
  function populateSettingsProfile(userData) {
    if (!userData) return;
    
    // Update first name and last name fields in settings
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    
    if (firstNameInput && userData.first_name) {
      firstNameInput.value = userData.first_name;
    }
    
    if (lastNameInput && userData.last_name) {
      lastNameInput.value = userData.last_name;
    }
    
    // Update admin role display
    const adminRoleElement = document.getElementById('adminRole');
    if (adminRoleElement) {
      adminRoleElement.textContent = userData.role || 'User';
    }
  }

  // Function to populate username in borrowing sections
  function populateBorrowingUsername(userData) {
    if (!userData) return;
    
    // Find all student username inputs in borrowing page
    const usernameInputs = document.querySelectorAll('.borrowing-page .input-field[placeholder="Student Username"]');
    
    usernameInputs.forEach(input => {
      input.value = userData.username || '';
    });
  }

  // Main initialization function
  async function initializeUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Fetch complete user data from Supabase
    const userData = await fetchUserData(currentUser.id, currentUser.username);
    if (!userData) {
      console.warn('Could not fetch complete user data');
      return;
    }
    
    // Store complete user data in localStorage for easy access
    localStorage.setItem('completeUserData', JSON.stringify(userData));
    
    // Populate user data in different sections
    populateSettingsProfile(userData);
    populateBorrowingUsername(userData);
    
    console.log('User data successfully loaded and populated');
  }

  // Initialize user data when page loads
  initializeUserData();
  
  // Also update borrowing form when a book is selected
  const bookCovers = document.querySelectorAll('.book-cover');
  bookCovers.forEach(cover => {
    cover.addEventListener('click', function() {
      // Get complete user data from localStorage
      const userDataString = localStorage.getItem('completeUserData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          populateBorrowingUsername(userData);
        } catch (error) {
          console.error('Error parsing complete user data:', error);
        }
      }
    });
  });
});