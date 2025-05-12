// Supabase configuration
const supabaseUrl = 'https://xvxzvzzrgbsfdialxntu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2eHp2enpyZ2JzZmRpYWx4bnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDQ4ODEsImV4cCI6MjA2MjE4MDg4MX0.s_07EucARbv2GJKMo3HKatiodaqo9WNJO-k1vLkog5E';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.querySelector(".toggle-password");
  const isPassword = passwordInput.type === "password";
  
  passwordInput.type = isPassword ? "text" : "password";

  // Optional: Change icon based on state
  toggleIcon.textContent = isPassword ? "👁️" : "👁️";
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      try {
        // Query the users table to check credentials
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();
        
        if (error) {
          console.error('Error during login:', error);
          alert('Login failed: incorrect username or password');
          return;
        }
        
        if (data) {
          // Login successful
          console.log('Login successful:', data);
          
          // Store user data in localStorage
          localStorage.setItem('currentUser', JSON.stringify({
            id: data.id,
            username: data.username,
            role: data.role,
            isAdmin: data.is_admin || data.role === 'admin'
          }));
          
          // Check if the user is an admin based on role or is_admin flag
          if (data.is_admin === true || data.role === 'admin') {
            window.location.href = 'main.html'; // Redirect to admin page
          } else {
            window.location.href = 'user.html'; // Redirect to user page
          }
        } else {
          // No matching user found
          alert('Invalid username or password. Please try again.');
        }
      } catch (err) {
        console.error('Unexpected error during login:', err);
        alert('An unexpected error occurred. Please try again.');
      }
    });
  }
});