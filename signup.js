// Supabase configuration
const supabaseUrl = 'https://xvxzvzzrgbsfdialxntu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2eHp2enpyZ2JzZmRpYWx4bnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDQ4ODEsImV4cCI6MjA2MjE4MDg4MX0.s_07EucARbv2GJKMo3HKatiodaqo9WNJO-k1vLkog5E';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Toggle password visibility
function toggleVisibility(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const uname = document.getElementById("uname").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const confirm = document.getElementById("confirm").value;

    // Validate password matching
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', uname)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking username:', checkError);
        alert("Error checking username availability. Please try again.");
        return;
      }

      if (existingUser) {
        alert("Username already taken. Please choose another one.");
        return;
      }

      // Insert user data into users table
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          first_name: fname, 
          last_name: lname, 
          username: uname, 
          email: email,
          password: password, // Note: In a production app, you should hash passwords
          role: 'user',     // Set default role to 'user'
          is_admin: false   // Set is_admin to false for regular users
        }]);

      if (error) {
        console.error('Error inserting data:', error);
        alert("Error: " + error.message);
      } else {
        alert("Account created successfully!");
        document.getElementById("registerForm").reset();
        // Redirect to login page
        window.location.href = "index.html";
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert("An unexpected error occurred. Please try again.");
    }
  });
});