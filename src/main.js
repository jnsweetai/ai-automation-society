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
});
