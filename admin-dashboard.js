// Supabase Configuration
const SUPABASE_URL = "https://sbp9b29c3392fc7ba020eb88c5fe0ff9845beb8aa36.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicDliMjljMzM5MmZjN2JhMDIwZWI4OGM1ZmUwZmY5ODQ1YmViOGFhMzYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc0MzMyOSwiZXhwIjoyMDUzMzE5MzI5fQ.VYVJGhJOQOGKJNJvKOQJQJQJQJQJQJQJQJQJQJQJQJQ"

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Check authentication on page load
document.addEventListener("DOMContentLoaded", async () => {
  // Check session storage first
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn")
  const adminEmail = sessionStorage.getItem("adminEmail")

  if (!isLoggedIn) {
    window.location.href = "admin-login.html"
    return
  }

  // Verify with Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    sessionStorage.clear()
    window.location.href = "admin-login.html"
    return
  }

  // Display admin email
  document.getElementById("adminEmail").textContent = adminEmail || session.user.email

  // Load dashboard data
  loadDashboardData()
})

// Load all dashboard data
async function loadDashboardData() {
  try {
    await Promise.all([loadStatistics(), loadContacts()])
  } catch (error) {
    console.error("Error loading dashboard data:", error)
    showError("Failed to load dashboard data. Please refresh the page.")
  }
}

// Load statistics
async function loadStatistics() {
  try {
    // Get total contacts
    const { count: totalCount, error: totalError } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })

    if (totalError) throw totalError

    // Get today's contacts
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    const { count: todayCount, error: todayError } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO)

    if (todayError) throw todayError

    // Get this week's contacts
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const weekStartISO = weekStart.toISOString()

    const { count: weekCount, error: weekError } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekStartISO)

    if (weekError) throw weekError

    // Update UI
    document.getElementById("totalContacts").textContent = totalCount || 0
    document.getElementById("todayContacts").textContent = todayCount || 0
    document.getElementById("weekContacts").textContent = weekCount || 0
  } catch (error) {
    console.error("Error loading statistics:", error)
    document.getElementById("totalContacts").textContent = "Error"
    document.getElementById("todayContacts").textContent = "Error"
    document.getElementById("weekContacts").textContent = "Error"
  }
}

// Load contacts table
async function loadContacts() {
  const contactsContent = document.getElementById("contactsContent")

  // Show loading
  contactsContent.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading contacts...
        </div>
    `

  try {
    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error

    if (!contacts || contacts.length === 0) {
      contactsContent.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>No contacts found.</p>
                </div>
            `
      return
    }

    // Generate table HTML
    const tableHTML = `
            <table class="contacts-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${contacts
                      .map(
                        (contact) => `
                        <tr>
                            <td><strong>${escapeHtml(contact.name)}</strong></td>
                            <td>${escapeHtml(contact.email)}</td>
                            <td class="message-preview" title="${escapeHtml(contact.message)}">
                                ${escapeHtml(contact.message)}
                            </td>
                            <td class="date-cell">
                                ${formatDate(contact.created_at)}
                            </td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        `

    contactsContent.innerHTML = tableHTML
  } catch (error) {
    console.error("Error loading contacts:", error)
    contactsContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                Failed to load contacts: ${error.message}
            </div>
        `
  }
}

// Logout function
async function logout() {
  try {
    await supabase.auth.signOut()
    sessionStorage.clear()
    window.location.href = "admin-login.html"
  } catch (error) {
    console.error("Logout error:", error)
    // Force logout even if Supabase call fails
    sessionStorage.clear()
    window.location.href = "admin-login.html"
  }
}

// Helper functions
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return "Today " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffDays === 2) {
    return "Yesterday " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffDays <= 7) {
    return (
      date.toLocaleDateString([], { weekday: "short" }) +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
  } else {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
}

function showError(message) {
  const errorDiv = document.createElement("div")
  errorDiv.className = "error-message"
  errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`

  document.querySelector(".container").insertBefore(errorDiv, document.querySelector(".stats-grid"))

  setTimeout(() => {
    errorDiv.remove()
  }, 5000)
}

// Auto-refresh data every 30 seconds
setInterval(() => {
  loadStatistics()
}, 30000)
