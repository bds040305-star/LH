
document.addEventListener("DOMContentLoaded", function () {
    const footerTarget = document.getElementById("footer");
    if (!footerTarget) return;

    fetch("./footer.html")
        .then(response => response.text())
        .then(html => {
            footerTarget.innerHTML = html;

            const fileName = window.location.pathname.split("/").pop() || "index.html";
            const pageName = fileName.replace(".html", "");

            let activePage = pageName;

            if (
                pageName === "custom-conditions" ||
                pageName === "notice-detail" ||
                pageName === "document-checklist" ||
                pageName === "signature-request"
            ) {
                activePage = "custom-list";
            }

            const activeItem = footerTarget.querySelector('[data-page="' + activePage + '"]');

            if (activeItem) {
                activeItem.classList.add("active");
            }
        })
        .catch(console.error);
});
