// Enhanced Admin Books Management Script
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Supabase client
  const supabaseUrl = 'https://xvxzvzzrgbsfdialxntu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2eHp2enpyZ2JzZmRpYWx4bnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDQ4ODEsImV4cCI6MjA2MjE4MDg4MX0.s_07EucARbv2GJKMo3HKatiodaqo9WNJO-k1vLkog5E';
  
  // Use window.supabase to ensure it's available from the global scope
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // Check if this is the admin page
  const booksRequestedLink = document.getElementById('booksRequestedLink');
  if (!booksRequestedLink) {
    // Not admin page, exit
    console.log('Not on admin page, exiting admin-books.js');
    return;
  }

  console.log('Admin books management script initialized');

  // Function to format date nicely
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return as-is if invalid
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  // Function to update books requested table
  async function updateBooksRequestedTable() {
    try {
      const booksRequestedTableBody = document.querySelector('.books-requested-page .books-table:first-of-type tbody');
      if (!booksRequestedTableBody) {
        console.error('Books requested table body not found');
        return;
      }

      // Show loading state
      booksRequestedTableBody.innerHTML = '<tr><td colspan="6">Loading borrowed books...</td></tr>';
      
      // Fetch borrowed books that haven't been returned
      const { data: borrowedBooks, error } = await supabase
        .from('book_borrowings')
        .select('*')
        .eq('status', 'borrowed')
        .order('checkout_date', { ascending: false });
        
      if (error) {
        console.error('Error loading borrowed books:', error);
        booksRequestedTableBody.innerHTML = '<tr><td colspan="6">Error loading data: ' + error.message + '</td></tr>';
        return;
      }
      
      // Clear the table
      booksRequestedTableBody.innerHTML = '';
      
      // Check if we have any borrowed books
      if (!borrowedBooks || borrowedBooks.length === 0) {
        booksRequestedTableBody.innerHTML = '<tr><td colspan="6">No books currently borrowed</td></tr>';
        return;
      }
      
      // Update the books counter in dashboard stats
      const requestedBooksCountElement = document.querySelectorAll('.stat-value')[2];
      if (requestedBooksCountElement) {
        requestedBooksCountElement.textContent = borrowedBooks.length;
      }
      
      // Populate the table
      borrowedBooks.forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${book.book_code || 'N/A'}</td>
          <td>${book.book_name || 'N/A'}</td>
          <td>${book.username || 'N/A'}</td>
          <td>${book.full_name || 'N/A'}</td>
          <td>${formatDate(book.checkout_date)}</td>
          <td>${book.department || 'N/A'}</td>
        `;
        
        booksRequestedTableBody.appendChild(row);
      });
      
    } catch (err) {
      console.error('Unexpected error loading borrowed books:', err);
      const booksRequestedTableBody = document.querySelector('.books-requested-page .books-table:first-of-type tbody');
      if (booksRequestedTableBody) {
        booksRequestedTableBody.innerHTML = '<tr><td colspan="6">An unexpected error occurred: ' + err.message + '</td></tr>';
      }
    }
  }

  // Function to update books returned table
  async function updateBooksReturnedTable() {
    try {
      const booksReturnedTableBody = document.querySelector('.books-requested-page .books-table:last-of-type tbody');
      if (!booksReturnedTableBody) {
        console.error('Books returned table body not found');
        return;
      }

      // Show loading state
      booksReturnedTableBody.innerHTML = '<tr><td colspan="6">Loading returned books...</td></tr>';
      
      // Fetch returned books
      const { data: returnedBooks, error } = await supabase
        .from('book_borrowings')
        .select('*')
        .eq('status', 'returned')
        .order('return_date', { ascending: false });
        
      if (error) {
        console.error('Error loading returned books:', error);
        booksReturnedTableBody.innerHTML = '<tr><td colspan="6">Error loading data: ' + error.message + '</td></tr>';
        return;
      }
      
      // Clear the table
      booksReturnedTableBody.innerHTML = '';
      
      // Check if we have any returned books
      if (!returnedBooks || returnedBooks.length === 0) {
        booksReturnedTableBody.innerHTML = '<tr><td colspan="6">No books have been returned yet</td></tr>';
        return;
      }
      
      // Populate the table
      returnedBooks.forEach(book => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${book.book_code || 'N/A'}</td>
          <td>${book.book_name || 'N/A'}</td>
          <td>${book.username || 'N/A'}</td>
          <td>${book.full_name || 'N/A'}</td>
          <td>${formatDate(book.return_date)}</td>
          <td>${book.department || 'N/A'}</td>
        `;
        
        booksReturnedTableBody.appendChild(row);
      });
      
    } catch (err) {
      console.error('Unexpected error loading returned books:', err);
      const booksReturnedTableBody = document.querySelector('.books-requested-page .books-table:last-of-type tbody');
      if (booksReturnedTableBody) {
        booksReturnedTableBody.innerHTML = '<tr><td colspan="6">An unexpected error occurred: ' + err.message + '</td></tr>';
      }
    }
  }

  // Function to update all books stats
  async function updateBooksStats() {
    try {
      // Get total count of all books (both borrowed and returned)
      const { count: totalBooks, error: totalError } = await supabase
        .from('book_borrowings')
        .select('*', { count: 'exact', head: true });
        
      if (totalError === null) {
        // Update books count in dashboard
        const booksCountElement = document.querySelectorAll('.stat-value')[1];
        if (booksCountElement) {
          booksCountElement.textContent = totalBooks;
        }
      } else {
        console.error('Error fetching total books count:', totalError);
      }
      
      // Get count of currently borrowed books
      const { count: borrowedCount, error: borrowedError } = await supabase
        .from('book_borrowings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'borrowed');
        
      if (borrowedError === null) {
        // Update requested books count
        const requestedBooksCountElement = document.querySelectorAll('.stat-value')[2];
        if (requestedBooksCountElement) {
          requestedBooksCountElement.textContent = borrowedCount;
        }
      } else {
        console.error('Error fetching borrowed books count:', borrowedError);
      }
    } catch (err) {
      console.error('Error updating books stats:', err);
    }
  }

  // Function to check if we're on the books requested page
  function isOnBooksRequestedPage() {
    const booksRequestedPage = document.getElementById('booksRequestedPage');
    return booksRequestedPage && booksRequestedPage.style.display === 'block';
  }

  // Add event listener to the books requested link
  booksRequestedLink.addEventListener('click', function() {
    console.log('Books Requested link clicked, updating tables');
    // Update all tables when the page is clicked
    updateBooksRequestedTable();
    updateBooksReturnedTable();
    updateBooksStats();
  });

  // Also update when the dashboard is loaded
  const dashboardLink = document.getElementById('dashboardLink');
  if (dashboardLink) {
    dashboardLink.addEventListener('click', function() {
      console.log('Dashboard link clicked, updating stats');
      updateBooksStats();
    });
  }

  // Set up real-time subscription for all book borrowing activities
  const setupRealtimeSubscriptions = async () => {
    try {
      // Subscribe to book returns (updates where status changes to 'returned')
      const returnSubscription = supabase
        .channel('book_returns')
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'book_borrowings',
            filter: 'status=eq.returned' 
          }, 
          (payload) => {
            console.log('Book return detected:', payload);
            
            // Only update if we're on the books requested page to avoid unnecessary updates
            if (isOnBooksRequestedPage()) {
              // Update both tables and stats
              updateBooksReturnedTable();
              updateBooksRequestedTable();
            }
            
            // Always update stats on the dashboard
            updateBooksStats();
          }
        )
        .subscribe();
      
      console.log('Realtime subscription set up for book returns');
      
      // Subscribe to new book checkouts (new insertions)
      const checkoutSubscription = supabase
        .channel('book_checkouts')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'book_borrowings' 
          }, 
          (payload) => {
            console.log('New book checkout detected:', payload);
            
            // Only update if we're on the books requested page
            if (isOnBooksRequestedPage()) {
              updateBooksRequestedTable();
            }
            
            // Always update stats on the dashboard
            updateBooksStats();
          }
        )
        .subscribe();
      
      console.log('Realtime subscription set up for new book checkouts');
      
    } catch (err) {
      console.error('Error setting up realtime subscriptions:', err);
    }
  };

  // Set up polling as a fallback in case realtime doesn't work
  const setupPolling = () => {
    // Poll every 30 seconds to check for updates
    setInterval(() => {
      console.log('Polling for updates');
      
      // Only update tables if we're on the books requested page
      if (isOnBooksRequestedPage()) {
        updateBooksRequestedTable();
        updateBooksReturnedTable();
      }
      
      // Always update stats
      updateBooksStats();
    }, 30000); // 30 seconds
    
    console.log('Polling mechanism set up as fallback');
  };

  // Initialize everything when the page loads
  const initializePage = () => {
    // Set up realtime subscriptions
    setupRealtimeSubscriptions();
    
    // Set up polling as a fallback
    setupPolling();
    
    // If we're already on the books requested page, load initial data
    if (isOnBooksRequestedPage()) {
      updateBooksRequestedTable();
      updateBooksReturnedTable();
    }
    
    // Always update stats
    updateBooksStats();
  };

  // Run initialization with a slight delay to ensure DOM is fully loaded
  setTimeout(initializePage, 300);
});