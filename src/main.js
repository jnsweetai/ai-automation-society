function openChatbot() {
  const chatbotUrl = "https://udify.app/chatbot/xi9u52axJgSFaMT1";
  window.open(chatbotUrl, "_blank", "width=400,height=600,scrollbars=yes,resizable=yes");
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.chatbot-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      openChatbot();
    });
  });

  // 스크롤 버튼 이벤트 바인딩
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('data-scroll');
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});

// Supabase 환경변수 사용
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 문의하기 폼 이벤트 바인딩
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const successModal = document.getElementById("successModal");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  if (!name || !email || !message) {
    alert("모든 필수 항목을 입력해주세요.");
    return;
  }

  submitBtn.disabled = true;

  try {
    const { data, error } = await supabaseClient.from("contacts").insert([
      { name, email, message, created_at: new Date().toISOString() }
    ]);
    if (error) throw error;
    successModal.style.display = "block";
    contactForm.reset();
  } catch (error) {
    alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
  } finally {
    submitBtn.disabled = false;
  }
});

// 닫기(X) 버튼 이벤트 바인딩
const closeModalBtn = document.querySelector("#successModal .close");
closeModalBtn?.addEventListener("click", () => {
  successModal.style.display = "none";
});

// 모달 바깥 클릭 시 닫기
window.addEventListener("click", (e) => {
  if (e.target === successModal) {
    successModal.style.display = "none";
  }
});
