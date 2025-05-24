// Supabase Configuration
const SUPABASE_URL = "https://sbp9b29c3392fc7ba020eb88c5fe0ff9845beb8aa36.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicDliMjljMzM5MmZjN2JhMDIwZWI4OGM1ZmUwZmY5ODQ1YmViOGFhMzYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzc0MzMyOSwiZXhwIjoyMDUzMzE5MzI5fQ.VYVJGhJOQOGKJNJvKOQJQJQJQJQJQJQJQJQJQJQJQJQ"

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const contactForm = document.getElementById("contactForm")
const submitBtn = document.getElementById("submitBtn")
const successModal = document.getElementById("successModal")
const closeModal = document.querySelector(".close")

// Mobile Navigation
hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("active")
    navMenu?.classList.remove("active")
  })
})

// Smooth Scrolling
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Update navigation links for smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const targetId = this.getAttribute("href").substring(1)
    scrollToSection(targetId)
  })
})

// Contact Form Submission
contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  // Validation
  if (!name || !email || !message) {
    showNotification("Please fill in all required fields.", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address.", "error")
    return
  }

  // Show loading state
  setLoadingState(true)

  try {
    // Insert data into Supabase
    const { data, error } = await supabase.from("contacts").insert([
      {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      throw error
    }

    // Success
    showSuccessModal()
    contactForm.reset()
  } catch (error) {
    console.error("Error submitting form:", error)
    showNotification("Failed to send message. Please try again.", "error")
  } finally {
    setLoadingState(false)
  }
})

// Helper Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function setLoadingState(loading) {
  const btnText = submitBtn.querySelector(".btn-text")
  const btnLoading = submitBtn.querySelector(".btn-loading")

  if (loading) {
    btnText.style.display = "none"
    btnLoading.style.display = "inline-block"
    submitBtn.disabled = true
    submitBtn.classList.add("loading")
  } else {
    btnText.style.display = "inline-block"
    btnLoading.style.display = "none"
    submitBtn.disabled = false
    submitBtn.classList.remove("loading")
  }
}

function showSuccessModal() {
  successModal.style.display = "block"
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <i class="fas fa-${type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        <span>${message}</span>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "error" ? "#dc3545" : "#007bff"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
}

// Modal Event Listeners
closeModal?.addEventListener("click", () => {
  successModal.style.display = "none"
})

window.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.style.display = "none"
  }
})

// Chatbot Integration
function openChatbot() {
  // Dify 챗봇 URL로 업데이트
  const chatbotUrl = "https://udify.app/chatbot/xi9u52axJgSFaMT1"
  window.open(chatbotUrl, "_blank", "width=400,height=600,scrollbars=yes,resizable=yes")
}

// Scroll Animations
function handleScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible")
    }
  })
}

// Add fade-in class to elements
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".case-card, .contact-content, .about-content")
  animatedElements.forEach((el) => el.classList.add("fade-in"))
})

// Event Listeners
window.addEventListener("scroll", handleScrollAnimations)
window.addEventListener("load", handleScrollAnimations)

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("AI Automation Society website loaded successfully!")
})
