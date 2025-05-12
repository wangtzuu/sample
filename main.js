
    // Initialize Supabase
    const supabaseUrl = 'https://xvxzvzzrgbsfdialxntu.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2eHp2enpyZ2JzZmRpYWx4bnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDQ4ODEsImV4cCI6MjA2MjE4MDg4MX0.s_07EucARbv2GJKMo3HKatiodaqo9WNJO-k1vLkog5E';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);



document.addEventListener('DOMContentLoaded', function() {
    // Get all page elements
    const dashboard = document.getElementById('dashboard');
    const borrowingPage = document.getElementById('borrowingPage');
    const usersPage = document.getElementById('usersPage');
    const booksRequestedPage = document.getElementById('booksRequestedPage');
    const settingsPage = document.getElementById('settingsPage');
    
    // Get all navigation links
    const dashboardLink = document.getElementById('dashboardLink');
    const borrowingLink = document.getElementById('borrowingLink');
    const usersLink = document.getElementById('usersLink');
    const booksRequestedLink = document.getElementById('booksRequestedLink');
    const settingsLink = document.getElementById('settingsLink');
    const logoutLink = document.getElementById('logoutLink');
    
    // Get logout modal elements
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');
    
    // Function to hide all pages
    function hideAllPages() {
        dashboard.style.display = 'none';
        borrowingPage.style.display = 'none';
        usersPage.style.display = 'none';
        booksRequestedPage.style.display = 'none';
        settingsPage.style.display = 'none';
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
    
    // Dashboard navigation
    dashboardLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        dashboard.style.display = 'block';
        updateActiveLink(dashboardLink);
    });
    
    // Borrowing navigation
    borrowingLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        borrowingPage.style.display = 'block';
        updateActiveLink(borrowingLink);
    });
    
    // Users navigation
    usersLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        usersPage.style.display = 'block';
        updateActiveLink(usersLink);
    });
    
    // Books Requested navigation
    booksRequestedLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        booksRequestedPage.style.display = 'block';
        updateActiveLink(booksRequestedLink);
    });
    
    // Settings navigation
    settingsLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        settingsPage.style.display = 'block';
        updateActiveLink(settingsLink);
    });
    
    // Logout button click
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logoutModal.style.display = 'flex';
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
    
    // Set dashboard as active by default
    dashboardLink.classList.add('active');
});
 // Set current date as default for date input
 const checkoutDateInput = document.getElementById('checkoutTime');
    if (checkoutDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        checkoutDateInput.value = `${year}-${month}-${day}`; // Fixed template literal syntax
    }
    
    // Set current time as default for time input
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`; // Fixed template literal syntax
    
    const returnTimeInput = document.getElementById('returnTime');
    if (returnTimeInput) returnTimeInput.value = currentTime;
    
    // Book selection functionality
    const bookCovers = document.querySelectorAll('.book-cover');
    const bookCodeInput = document.getElementById('bookCodeInput');
    const checkoutBookImage = document.getElementById('checkoutBookImage');
    
    bookCovers.forEach(bookCover => {
        bookCover.addEventListener('click', function() {
            // Get book code from data attribute
            const bookCode = this.getAttribute('data-book-code');
            const bookImgSrc = this.querySelector('img').getAttribute('data-book-src');
            
            // Switch to borrowing page
            dashboard.style.display = 'none';
            borrowingPage.style.display = 'block';
            usersPage.style.display = 'none'; // Also hide users page when selecting a book
            updateActiveLink(borrowingLink);
            
            // Update book code input
            bookCodeInput.value = bookCode;
            
            // Update book image in checkout section
            checkoutBookImage.src = bookImgSrc;
            
            // Visual feedback - add selected class to all book covers
            bookCovers.forEach(cover => {
                cover.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    async function loadUsers() {
        try {
            // Show loading state
            const userTableBody = document.getElementById('userTableBody');
            userTableBody.innerHTML = '<tr><td colspan="6">Loading users...</td></tr>';
            
            // Fetch users from Supabase
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .order('id', { ascending: true });
                
            if (error) {
                console.error('Error fetching users:', error);
                userTableBody.innerHTML = '<tr><td colspan="6">Error loading users. Please try again.</td></tr>';
                return;
            }
            
            // Clear the table body
            userTableBody.innerHTML = '';
            
            // Check if we have users
            if (!users || users.length === 0) {
                userTableBody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
                return;
            }
            
            // Update the stats counter
            const usersCountElement = document.querySelectorAll('.stat-value')[0];
            if (usersCountElement) {
                usersCountElement.textContent = users.length;
            }
            
            // Populate the table with user data
            users.forEach(user => {
                const row = document.createElement('tr');
                
                // Create full name by combining first and last name
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                
                // Determine if user is active (you might have a field for this)
                const isActive = user.is_active !== false; // Assuming users are active by default
                
                // Format role (capitalize first letter)
                const role = user.is_admin ? 'Admin' : 'User';
                
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${fullName}</td>
                    <td>${user.email}</td>
                    <td>${role}</td>
                    <td><span class="status ${isActive ? 'active' : 'inactive'}">${isActive ? 'Active' : 'Inactive'}</span></td>
                `;
                
                userTableBody.appendChild(row);
            });
            
        } catch (err) {
            console.error('Unexpected error loading users:', err);
            document.getElementById('userTableBody').innerHTML = 
                '<tr><td colspan="6">An unexpected error occurred. Please try again.</td></tr>';
        }
    }
    
    // Update the navigation event listeners to load users when the Users page is clicked
    document.addEventListener('DOMContentLoaded', function() {
        // Get all page elements and navigation links (keeping your existing code)
        const dashboard = document.getElementById('dashboard');
        const usersPage = document.getElementById('usersPage');
        const booksRequestedPage = document.getElementById('booksRequestedPage');
        
        // Get all navigation links
        const dashboardLink = document.getElementById('dashboardLink');
        const usersLink = document.getElementById('usersLink');
        const booksRequestedLink = document.getElementById('booksRequestedLink');
        const logoutLink = document.getElementById('logoutLink');
        
        // Get logout modal elements
        const logoutModal = document.getElementById('logoutModal');
        const cancelLogout = document.getElementById('cancelLogout');
        const confirmLogout = document.getElementById('confirmLogout');
        
        // Function to hide all pages
        function hideAllPages() {
            dashboard.style.display = 'none';
            usersPage.style.display = 'none';
            booksRequestedPage.style.display = 'none';
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
        
        // Dashboard navigation
        dashboardLink.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllPages();
            dashboard.style.display = 'block';
            updateActiveLink(dashboardLink);
        });
        
        // Users navigation - modified to load users when clicked
        usersLink.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllPages();
            usersPage.style.display = 'block';
            updateActiveLink(usersLink);
            
            // Load users when the page is displayed
            loadUsers();
        });
        
        // Books Requested navigation
        booksRequestedLink.addEventListener('click', function(e) {
            e.preventDefault();
            hideAllPages();
            booksRequestedPage.style.display = 'block';
            updateActiveLink(booksRequestedLink);
        });
        
        // Logout button click
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutModal.style.display = 'flex';
        });
        
        // Cancel logout
        cancelLogout.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
        
        // Confirm logout
        confirmLogout.addEventListener('click', function() {
            // Log out from Supabase
            supabase.auth.signOut().then(() => {
                window.location.href = 'index.html'; // Redirect to login page
            });
        });
        
        // Close modal if clicked outside of content
        logoutModal.addEventListener('click', function(e) {
            if (e.target === logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
        
        // Set dashboard as active by default
        dashboardLink.classList.add('active');
        
        // Initialize Supabase if it's not already initialized
        if (typeof supabase === 'undefined') {
            const supabaseUrl = 'https://xvxzvzzrgbsfdialxntu.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2eHp2enpyZ2JzZmRpYWx4bnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDQ4ODEsImV4cCI6MjA2MjE4MDg4MX0.s_07EucARbv2GJKMo3HKatiodaqo9WNJO-k1vLkog5E';
            window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        }
        
        // Load users initially if starting on the users page
        if (window.location.hash === '#users') {
            hideAllPages();
            usersPage.style.display = 'block';
            updateActiveLink(usersLink);
            loadUsers();
        }
    });

    // Function to load users from Supabase when the Users page is opened
async function loadUsers() {
    try {
        // Show loading state
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = '<tr><td colspan="6">Loading users...</td></tr>';
        
        // Fetch users from Supabase
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .order('id', { ascending: true });
            
        if (error) {
            console.error('Error fetching users:', error);
            userTableBody.innerHTML = '<tr><td colspan="6">Error loading users. Please try again.</td></tr>';
            return;
        }
        
        // Clear the table body
        userTableBody.innerHTML = '';
        
        // Check if we have users
        if (!users || users.length === 0) {
            userTableBody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
            return;
        }
        
        // Update the stats counter
        const usersCountElement = document.querySelectorAll('.stat-value')[0];
        if (usersCountElement) {
            usersCountElement.textContent = users.length;
        }
        
        // Populate the table with user data
        users.forEach(user => {
            const row = document.createElement('tr');
            
            // Create full name by combining first and last name
            const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
            
            // Determine if user is active (you might have a field for this)
            const isActive = user.is_active !== false; // Assuming users are active by default
            
            // Format role (capitalize first letter)
            const role = user.is_admin ? 'Admin' : 'User';
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${fullName}</td>
                <td>${user.email}</td>
                <td>${role}</td>
                <td><span class="status ${isActive ? 'active' : 'inactive'}">${isActive ? 'Active' : 'Inactive'}</span></td>
            `;
            
            userTableBody.appendChild(row);
        });
        
    } catch (err) {
        console.error('Unexpected error loading users:', err);
        document.getElementById('userTableBody').innerHTML = 
            '<tr><td colspan="6">An unexpected error occurred. Please try again.</td></tr>';
    }
}

// Update the navigation event listeners to load users when the Users page is clicked
document.addEventListener('DOMContentLoaded', function() {
    // Get all page elements and navigation links (keeping your existing code)
    const dashboard = document.getElementById('dashboard');
    const usersPage = document.getElementById('usersPage');
    const booksRequestedPage = document.getElementById('booksRequestedPage');
    
    // Get all navigation links
    const dashboardLink = document.getElementById('dashboardLink');
    const usersLink = document.getElementById('usersLink');
    const booksRequestedLink = document.getElementById('booksRequestedLink');
    const logoutLink = document.getElementById('logoutLink');
    
    // Get logout modal elements
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');
    
    // Function to hide all pages
    function hideAllPages() {
        dashboard.style.display = 'none';
        usersPage.style.display = 'none';
        booksRequestedPage.style.display = 'none';
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
    
    // Dashboard navigation
    dashboardLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        dashboard.style.display = 'block';
        updateActiveLink(dashboardLink);
    });
    
    // Users navigation - modified to load users when clicked
    usersLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        usersPage.style.display = 'block';
        updateActiveLink(usersLink);
        
        // Load users when the page is displayed
        loadUsers();
    });
    
    // Books Requested navigation
    booksRequestedLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        booksRequestedPage.style.display = 'block';
        updateActiveLink(booksRequestedLink);
    });
    
    // Logout button click
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logoutModal.style.display = 'flex';
    });
    
    // Cancel logout
    cancelLogout.addEventListener('click', function() {
        logoutModal.style.display = 'none';
    });
    
    // Confirm logout
    confirmLogout.addEventListener('click', function() {
        // Log out from Supabase
        supabase.auth.signOut().then(() => {
            window.location.href = 'index.html'; // Redirect to login page
        });
    });
    
    // Close modal if clicked outside of content
    logoutModal.addEventListener('click', function(e) {
        if (e.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });
    
    // Set dashboard as active by default
    dashboardLink.classList.add('active');
    
    // Initialize Supabase if it's not already initialized
    if (typeof supabase === 'undefined') {
        const supabaseUrl = 'https://xvxzvzzrgbsfdialxntu.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2eHp2enpyZ2JzZmRpYWx4bnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDQ4ODEsImV4cCI6MjA2MjE4MDg4MX0.s_07EucARbv2GJKMo3HKatiodaqo9WNJO-k1vLkog5E';
        window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    }
    
    // Load users initially if starting on the users page
    if (window.location.hash === '#users') {
        hideAllPages();
        usersPage.style.display = 'block';
        updateActiveLink(usersLink);
        loadUsers();
    }
});