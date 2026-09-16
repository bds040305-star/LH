
document.addEventListener("DOMContentLoaded", function () {
    const headerTarget = document.getElementById("header");
    if (!headerTarget) return;

    fetch("./header.html")
        .then(response => response.text())
        .then(html => {
            headerTarget.innerHTML = html;

            const openButton = document.getElementById("quick-menu-open");
            const quickMenu = document.getElementById("quick-menu");

            if (openButton && quickMenu) {
                openButton.addEventListener("click", function () {
                    quickMenu.classList.add("show");
                    document.body.style.overflow = "hidden";
                });
            }

            const actionModal = document.createElement("div");
            actionModal.className = "modal-overlay";
            actionModal.id = "header-action-modal";
            document.querySelector(".mobile-app").appendChild(actionModal);

            function closeActionModal() {
                actionModal.classList.remove("show");
                document.body.style.overflow = "";
            }

            function openActionModal(type) {
                const isSearch = type === "search";
                actionModal.innerHTML = `
                    <div class="bottom-sheet header-action-sheet">
                        <div class="drag-handle"></div>
                        <div class="sheet-header">
                            <div>
                                <span class="eyebrow">${isSearch ? "공고 검색" : "LH 상담"}</span>
                                <h2>${isSearch ? "어떤 공고를 찾고 있나요?" : "무엇을 도와드릴까요?"}</h2>
                            </div>
                            <button type="button" class="sheet-close" aria-label="닫기">×</button>
                        </div>
                        ${isSearch ? `
                            <label class="header-search-box">
                                <span class="sr-only">검색어</span>
                                <input type="search" id="header-search-input" placeholder="지역·임대 유형으로 검색">
                            </label>
                            <button type="button" class="primary-button" id="header-search-submit">공고 검색하기</button>
                        ` : `
                            <div class="consult-card">
                                <strong>LH 콜센터 1600-1004</strong>
                                <p>평일 09:00–18:00<br>청약 자격과 신청 절차를 상담할 수 있어요.</p>
                            </div>
                            <button type="button" class="primary-button" id="consult-close">확인</button>
                        `}
                    </div>`;
                actionModal.classList.add("show");
                document.body.style.overflow = "hidden";

                actionModal.querySelector(".sheet-close").addEventListener("click", closeActionModal);
                actionModal.querySelector("#consult-close")?.addEventListener("click", closeActionModal);
                actionModal.querySelector("#header-search-submit")?.addEventListener("click", function () {
                    const input = actionModal.querySelector("#header-search-input");
                    if (input && input.value.trim()) window.location.href = "custom-list.html";
                    else input?.focus();
                });
            }

            document.getElementById("search-open")?.addEventListener("click", function () {
                openActionModal("search");
            });
            document.getElementById("consult-open")?.addEventListener("click", function () {
                openActionModal("consult");
            });
            actionModal.addEventListener("click", function (event) {
                if (event.target === actionModal) closeActionModal();
            });
        })
        .catch(console.error);
});
