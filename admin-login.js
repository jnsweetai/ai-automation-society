// Supabase Configuration
const SUPABASE_URL = "https://sbp9b29c3392fc7ba020eb88c5fe0ff9845beb8aa36.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicDliMjljMzM5MmZjN2JhMDIwZWI4OGM1ZmUwZmY5ODQ1YmViOGFhMzYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc0MzMyOSwiZXhwIjoyMDUzMzE5MzI5fQ.VYVJGhJOQOGKJNJvKOQJQJQJQJQJQJQJQJQJQJQJQJQ"

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// DOM Elements
const loginForm = document.getElementById("loginForm")
const loginBtn = document.getElementById("loginBtn")
const errorMessage = document.getElementById("errorMessage")
const successMessage = document.getElementById("successMessage")

// Check if already logged in
document.addEventListener("DOMContentLoaded", async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    window.location.href = "admin-dashboard.html"
  }
})

// Login Form Submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = new FormData(loginForm)
  const email = formData.get("email")
  const password = formData.get("password")

  // Clear previous messages
  hideMessages()

  // Validation
  if (!email || !password) {
    showError("Please fill in all fields.")
    return
  }

  // Show loading state
  setLoadingState(true)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      throw error
    }

    // Success
    showSuccess("Login successful! Redirecting...")

    // Store session info
    sessionStorage.setItem("adminLoggedIn", "true")
    sessionStorage.setItem("adminEmail", email)

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "admin-dashboard.html"
    }, 1000)
  } catch (error) {
    console.error("Login error:", error)
    showError(error.message || "Login failed. Please check your credentials.")
  } finally {
    setLoadingState(false)
  }
})

// Helper Functions
function setLoadingState(loading) {
  const btnText = loginBtn.querySelector(".btn-text")
  const btnLoading = loginBtn.querySelector(".btn-loading")

  if (loading) {
    btnText.style.display = "none"
    btnLoading.style.display = "inline-block"
    loginBtn.disabled = true
  } else {
    btnText.style.display = "inline-block"
    btnLoading.style.display = "none"
    loginBtn.disabled = false
  }
}

function showError(message) {
  errorMessage.textContent = message
  errorMessage.style.display = "block"
  successMessage.style.display = "none"
}

function showSuccess(message) {
  successMessage.textContent = message
  successMessage.style.display = "block"
  errorMessage.style.display = "none"
}

function hideMessages() {
  errorMessage.style.display = "none"
  successMessage.style.display = "none"
}
