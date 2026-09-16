
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("[data-modal-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            const modal = this.closest(".modal-overlay");
            if (modal) {
                modal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(function (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
    });

    document.querySelectorAll(".check-button").forEach(function (button) {
        button.addEventListener("click", function () {
            this.classList.toggle("checked");
            this.textContent = this.classList.contains("checked") ? "✓" : "";
        });
    });

    const regionSelect = document.getElementById("region-select");
    const regionModal = document.getElementById("region-modal");
    const selectedRegion = document.getElementById("selected-region");

    if (regionSelect && regionModal) {
        regionSelect.addEventListener("click", function () {
            regionModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    }

    document.querySelectorAll(".region-option").forEach(function (option) {
        option.addEventListener("click", function () {
            if (selectedRegion) {
                selectedRegion.textContent = this.dataset.region;
            }

            if (regionModal) {
                regionModal.classList.remove("show");
            }

            document.body.style.overflow = "";
            updateConditionProgress();
        });
    });

    document.querySelectorAll(".chip-group").forEach(function (group) {
        const chips = group.querySelectorAll(".chip");

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(item => item.classList.remove("active"));
                this.classList.add("active");
                updateConditionProgress();
            });
        });
    });

    const incomeToggle = document.getElementById("income-toggle");

    if (incomeToggle) {
        incomeToggle.addEventListener("click", function () {
            this.classList.toggle("active");
            this.setAttribute("aria-pressed", this.classList.contains("active") ? "true" : "false");
            updateConditionProgress();
        });
    }

    function updateConditionProgress() {
        const fill = document.getElementById("condition-progress-fill");
        const number = document.getElementById("progress-number");
        const description = document.getElementById("progress-description");

        if (!fill || !number || !description) return;

        let count = 0;

        if (selectedRegion && selectedRegion.textContent.trim() !== "지역을 선택해 주세요") count++;
        if (document.querySelector("#rent-type-group .chip.active")) count++;
        if (document.querySelector("#household-group .chip.active")) count++;
        if (incomeToggle && incomeToggle.classList.contains("active")) count++;

        fill.style.width = (count / 4) * 100 + "%";
        number.textContent = count + " / 4";
        description.textContent = "조건 4개 중 " + count + "개 설정";
    }

    updateConditionProgress();

    const resetButton = document.getElementById("reset-button");

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            if (selectedRegion) selectedRegion.textContent = "지역을 선택해 주세요";
            document.querySelectorAll(".chip").forEach(chip => chip.classList.remove("active"));

            if (incomeToggle) {
                incomeToggle.classList.remove("active");
                incomeToggle.setAttribute("aria-pressed", "false");
            }

            updateConditionProgress();
        });
    }

    const conditionSave = document.querySelector(".conditions-content .primary-button");

    if (conditionSave) {
        conditionSave.addEventListener("click", function () {
            const selectedRent = document.querySelector("#rent-type-group .chip.active");
            const selectedHousehold = document.querySelector("#household-group .chip.active");

            localStorage.setItem("lhConditions", JSON.stringify({
                region: selectedRegion ? selectedRegion.textContent.trim() : "",
                rent: selectedRent ? selectedRent.textContent.trim() : "",
                household: selectedHousehold ? selectedHousehold.textContent.trim() : "",
                incomeAuto: Boolean(incomeToggle && incomeToggle.classList.contains("active"))
            }));
        });
    }

    document.querySelectorAll(".bookmark-button").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.classList.toggle("active");
            this.setAttribute("aria-pressed", this.classList.contains("active") ? "true" : "false");
        });
    });

    const documentChecks = document.querySelectorAll(".document-check-button");
    const documentProgressFill = document.getElementById("document-progress-fill");
    const documentProgressText = document.getElementById("document-progress-text");

    function updateDocumentProgress() {
        if (!documentProgressFill || !documentProgressText || documentChecks.length === 0) return;

        const checkedCount = document.querySelectorAll(".document-check-button.checked").length;
        const total = documentChecks.length;

        documentProgressFill.style.width = (checkedCount / total) * 100 + "%";
        documentProgressText.textContent = checkedCount + " / " + total;
    }

    documentChecks.forEach(function (button) {
        button.addEventListener("click", updateDocumentProgress);
    });

    const shareOpen = document.getElementById("share-open");
    const shareModal = document.getElementById("share-modal");

    if (shareOpen && shareModal) {
        shareOpen.addEventListener("click", function () {
            shareModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    }

    const signaturePad = document.getElementById("signature-pad");

    if (signaturePad) {
        const canvas = document.createElement("canvas");
        signaturePad.appendChild(canvas);
        const context = canvas.getContext("2d");

        let drawing = false;
        let hasSignature = false;

        function resizeCanvas() {
            const rect = signaturePad.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;

            canvas.width = rect.width * ratio;
            canvas.height = rect.height * ratio;
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";

            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.lineWidth = 2;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.strokeStyle = "#171717";
        }

        resizeCanvas();

        function getPoint(event) {
            const rect = canvas.getBoundingClientRect();
            const point = event.touches ? event.touches[0] : event;

            return {
                x: point.clientX - rect.left,
                y: point.clientY - rect.top
            };
        }

        function startDrawing(event) {
            drawing = true;
            hasSignature = true;
            const point = getPoint(event);
            context.beginPath();
            context.moveTo(point.x, point.y);
            event.preventDefault();
        }

        function draw(event) {
            if (!drawing) return;
            const point = getPoint(event);
            context.lineTo(point.x, point.y);
            context.stroke();
            event.preventDefault();
        }

        function stopDrawing() {
            drawing = false;
        }

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        window.addEventListener("mouseup", stopDrawing);

        canvas.addEventListener("touchstart", startDrawing, { passive: false });
        canvas.addEventListener("touchmove", draw, { passive: false });
        canvas.addEventListener("touchend", stopDrawing);

        const clearButton = document.getElementById("signature-clear");
        const completeButton = document.getElementById("signature-complete");
        const feedback = document.getElementById("signature-feedback");

        if (clearButton) {
            clearButton.addEventListener("click", function () {
                context.clearRect(0, 0, canvas.width, canvas.height);
                hasSignature = false;
                if (feedback) feedback.textContent = "";
            });
        }

        if (completeButton) {
            completeButton.addEventListener("click", function () {
                if (!hasSignature) {
                    if (feedback) feedback.textContent = "서명란에 서명해 주세요.";
                    return;
                }

                localStorage.setItem("lhSignatureComplete", "true");
                completeButton.textContent = "서명이 완료됐어요";
                completeButton.classList.add("is-complete");
                if (feedback) feedback.textContent = "신청 현황에서 완료 상태를 확인할 수 있어요.";

                window.setTimeout(function () {
                    window.location.href = "application-status.html";
                }, 700);
            });
        }
    }

    const calendarDays = document.getElementById("calendar-days");
    const calendarTitle = document.getElementById("calendar-title");
    const scheduleDate = document.getElementById("schedule-date");
    const scheduleList = document.getElementById("schedule-list");
    const calendarPrev = document.getElementById("calendar-prev");
    const calendarNext = document.getElementById("calendar-next");

    if (calendarDays && calendarTitle && scheduleDate && scheduleList) {
        const weeks = [
            { month: 9, days: [7, 8, 9, 10, 11, 12, 13] },
            { month: 9, days: [14, 15, 16, 17, 18, 19, 20] },
            { month: 9, days: [21, 22, 23, 24, 25, 26, 27] }
        ];
        const events = {
            16: [
                { title: "가족관계증명서 서명", sub: "가족 서명 요청 확인" },
                { title: "주민등록등본 준비", sub: "본인 제출" },
                { title: "접수 마감 D-2", sub: "서울 강서구 행복주택", warning: true }
            ],
            18: [
                { title: "접수 마감", sub: "서울 강서구 행복주택", warning: true }
            ]
        };
        let weekIndex = 1;
        let selectedDate = 16;

        function renderEvents(date) {
            scheduleDate.textContent = "9월 " + date + "일 일정";
            const dayEvents = events[date] || [];

            if (dayEvents.length === 0) {
                scheduleList.innerHTML = '<div class="schedule-empty">등록된 일정이 없어요.</div>';
                return;
            }

            scheduleList.innerHTML = dayEvents.map(function (event) {
                return '<article class="schedule-card' + (event.warning ? ' warning' : '') + '">' +
                    '<span class="schedule-dot" aria-hidden="true"></span>' +
                    '<div><strong' + (event.warning ? ' class="warning-text"' : '') + '>' + event.title + '</strong>' +
                    '<p>' + event.sub + '</p></div></article>';
            }).join("");
        }

        function renderWeek() {
            const week = weeks[weekIndex];
            calendarTitle.textContent = "2026년 " + week.month + "월";
            calendarDays.innerHTML = week.days.map(function (date) {
                const classes = [];
                if (date === 16) classes.push("calendar-today");
                if (date === selectedDate) classes.push("selected");
                return '<button type="button" class="' + classes.join(" ") + '" data-date="' + date + '">' + date + '</button>';
            }).join("");

            calendarDays.querySelectorAll("button").forEach(function (button) {
                button.addEventListener("click", function () {
                    selectedDate = Number(this.dataset.date);
                    calendarDays.querySelectorAll("button").forEach(item => item.classList.remove("selected"));
                    this.classList.add("selected");
                    renderEvents(selectedDate);
                });
            });

            if (!week.days.includes(selectedDate)) {
                selectedDate = week.days[0];
                calendarDays.querySelector("button").classList.add("selected");
            }
            renderEvents(selectedDate);
            calendarPrev.disabled = weekIndex === 0;
            calendarNext.disabled = weekIndex === weeks.length - 1;
        }

        calendarPrev.addEventListener("click", function () {
            if (weekIndex > 0) {
                weekIndex--;
                selectedDate = weeks[weekIndex].days[0];
                renderWeek();
            }
        });

        calendarNext.addEventListener("click", function () {
            if (weekIndex < weeks.length - 1) {
                weekIndex++;
                selectedDate = weeks[weekIndex].days[0];
                renderWeek();
            }
        });

        renderWeek();
    }

    const mapFilters = document.querySelectorAll(".map-filter-button");
    const mapCards = document.querySelectorAll(".map-card[data-match]");

    mapFilters.forEach(function (button) {
        button.addEventListener("click", function () {
            mapFilters.forEach(function (item) {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });
            this.classList.add("active");
            this.setAttribute("aria-pressed", "true");

            const showAll = this.dataset.filter === "all";
            mapCards.forEach(function (card) {
                card.classList.toggle("is-hidden", !showAll && card.dataset.match !== "true");
            });
        });
    });

    const conditionTags = document.querySelectorAll("[data-condition]");
    if (conditionTags.length) {
        try {
            const savedConditions = JSON.parse(localStorage.getItem("lhConditions") || "null");
            if (savedConditions) {
                conditionTags.forEach(function (tag) {
                    const value = savedConditions[tag.dataset.condition];
                    if (value) tag.textContent = value;
                });
            }
        } catch (error) {
            console.warn("저장된 맞춤 조건을 불러오지 못했습니다.", error);
        }
    }

    const signatureStatusLink = document.getElementById("signature-status-link");
    if (signatureStatusLink && localStorage.getItem("lhSignatureComplete") === "true") {
        signatureStatusLink.textContent = "서명 완료 · 요청서 보기";
        signatureStatusLink.classList.add("is-complete");
    }

    const homeHelp = document.getElementById("home-help");
    if (homeHelp) {
        homeHelp.addEventListener("click", function () {
            document.getElementById("quick-menu")?.classList.remove("show");
            document.getElementById("consult-open")?.click();
        });
    }
});
