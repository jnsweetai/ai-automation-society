// Supabase Configuration - Vite 환경변수 사용
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize Supabase client
const { createClient } = supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
    showNotification("모든 필수 항목을 입력해주세요.", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("올바른 이메일 주소를 입력해주세요.", "error")
    return
  }

  // Show loading state
  setLoadingState(true)

  try {
    console.log("📝 문의하기 데이터 전송 시작...")
    console.log("전송 데이터:", { name: name.trim(), email: email.trim(), message: message.trim().substring(0, 50) + "..." })
    
    // Insert data into Supabase
    const { data, error } = await supabaseClient.from("contacts").insert([
      {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("❌ Supabase 삽입 오류:", error)
      throw error
    }

    console.log("✅ 데이터 저장 성공:", data)
    
    // Success
    showSuccessModal()
    contactForm.reset()
  } catch (error) {
    console.error("❌ 문의하기 폼 전송 오류:", error)
    showNotification("메시지 전송에 실패했습니다. 다시 시도해주세요.", "error")
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

// Supabase 연결 테스트 함수
async function testSupabaseConnection() {
  try {
    console.log("🔄 Supabase 연결 테스트 시작...")
    console.log("URL:", SUPABASE_URL)
    console.log("Key (처음 20자):", SUPABASE_ANON_KEY.substring(0, 20) + "...")
    
    const { data, error } = await supabaseClient
      .from("contacts")
      .select("count", { count: "exact", head: true })
    
    if (error) {
      console.error("❌ Supabase 연결 오류:", error)
      return false
    }
    
    console.log("✅ Supabase 연결 성공!")
    return true
  } catch (error) {
    console.error("❌ Supabase 연결 테스트 실패:", error)
    return false
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  console.log("AI 자동화 소사이어티 웹사이트가 성공적으로 로드되었습니다!")
  
  // Supabase 연결 테스트
  await testSupabaseConnection()
})

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.chatbot-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      openChatbot();
    });
  });
});
