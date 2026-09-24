document.addEventListener("DOMContentLoaded", function () {
  const target = document.getElementById("footer");
  if (!target) return;
  fetch("./footer.html")
    .then(response => { if (!response.ok) throw new Error("footer.html not found"); return response.text(); })
    .then(html => {
      target.innerHTML = html;
      const page = (window.location.pathname.split("/").pop() || "index.html").replace(".html", "");
      const activePage = ["custom-conditions", "notice-detail", "document-checklist", "signature-request"].includes(page) ? "custom-list" : page;
      const activeItem = target.querySelector('[data-page="' + activePage + '"]');
      if (activeItem) activeItem.classList.add("active");
    })
    .catch(error => console.warn("푸터를 불러오지 못했습니다.", error));
});
