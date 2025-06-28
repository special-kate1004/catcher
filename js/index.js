const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("js/data.json")
    .then((response) => response.json())
    .then((data) => {
      renderHighlights(data.highlights);
      renderCoverageDetails(data.coverageDetails);
    });
});

function renderHighlights(highlights) {
  const highlightsGrid = document.querySelector(".highlights-grid");
  const cardsContainer = highlightsGrid.querySelector(
    ".highlights-cards-container"
  );
  if (!cardsContainer) return;

  const leftBtn = highlightsGrid.querySelector(".highlights-nav-left");
  const rightBtn = highlightsGrid.querySelector(".highlights-nav-right");

  let startIdx = 0;

  function getVisibleCount() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function updateNavVisibility() {
    if (window.innerWidth <= 768) {
      leftBtn.style.display = "none";
      rightBtn.style.display = "none";
    } else {
      leftBtn.style.display = "flex";
      rightBtn.style.display = "flex";
    }
  }

  function render() {
    const visibleCount = getVisibleCount();
    cardsContainer.innerHTML = "";
    for (
      let i = startIdx;
      i < Math.min(startIdx + visibleCount, highlights.length);
      i++
    ) {
      const item = highlights[i];
      const card = document.createElement("div");
      card.className = "highlight-card";
      card.innerHTML = `
        <div class="highlight-image" style="background-image:url('${item.image}')">
          <div class='highlight-star'>
            <img src='assets/svgs/star.svg' alt='star' class='star-icon' />
          </div>
        </div>
        <div class="highlight-content">
        <div class='highlight-content-d'>
        <div class="highlight-source">${item.source}</div>
        <h3 class="highlight-title">${item.title}</h3>
        </div>
          <div class="highlight-stats">
            <div class="stat">👥 ${item.audience}</div>
            <div class="stat">📊 ${item.strength}</div>
          </div>
        </div>
      `;
      cardsContainer.appendChild(card);
    }
    leftBtn.disabled = startIdx === 0;
    rightBtn.disabled = startIdx + visibleCount >= highlights.length;
    updateNavVisibility();
  }

  leftBtn.onclick = function () {
    if (startIdx > 0) {
      startIdx--;
      render();
    }
  };
  rightBtn.onclick = function () {
    const visibleCount = getVisibleCount();
    if (startIdx + visibleCount < highlights.length) {
      startIdx++;
      render();
    }
  };

  let touchStartX = null;
  let touchEndX = null;

  cardsContainer.addEventListener("touchstart", function (e) {
    if (window.innerWidth > 768) return;
    touchStartX = e.changedTouches[0].screenX;
  });
  cardsContainer.addEventListener("touchmove", function (e) {
    if (window.innerWidth > 768) return;
    touchEndX = e.changedTouches[0].screenX;
  });
  cardsContainer.addEventListener("touchend", function (e) {
    if (window.innerWidth > 768) return;
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && startIdx + 1 < highlights.length) {
          startIdx++;
          render();
        } else if (diff < 0 && startIdx > 0) {
          startIdx--;
          render();
        }
      }
    }
    touchStartX = null;
    touchEndX = null;
  });

  window.addEventListener("resize", function () {
    const visibleCount = getVisibleCount();
    if (startIdx + visibleCount > highlights.length) {
      startIdx = Math.max(0, highlights.length - visibleCount);
    }
    render();
  });
  render();
}

function renderCoverageDetails(details) {
  const coverageSection = document.querySelector(".coverage-details");
  if (!coverageSection) return;
  const header = coverageSection.querySelector(".coverage-header");
  coverageSection.innerHTML = "";
  if (header) coverageSection.appendChild(header);

  function attachEditHandler(btn) {
    btn.addEventListener("click", function editHandler() {
      const noteId = btn.getAttribute("data-note-id");
      const noteDiv = document.getElementById(noteId);
      const noteText = noteDiv.querySelector(".note-text").textContent;
      noteDiv.innerHTML = `
        <div class='notes-header'>
          <span class='notes-title'><img src='assets/svgs/pen-line.svg' style='width:1em;height:1em;margin-right:0.3em;vertical-align:middle;'/> NOTES</span>
          <div class='save-cancle-btn-d'>
            <button class='edit-note-save-btn' title='Save'><img src='assets/svgs/save.svg' class='edit-note-save-icon'/>Save</button>
            <button class='edit-note-cancle-btn' title='Cancel'><img src='assets/svgs/cancle.svg' class='edit-note-cancle-icon'/>Cancel</button>
          </div>
        </div>
        <textarea class='note-edit-area'>${noteText || ""}</textarea>
      `;
      const textarea = noteDiv.querySelector(".note-edit-area");
      textarea.addEventListener("focus", function () {
        textarea.style.outline = "2px solid #000";
        textarea.style.borderColor = "#000";
      });
      textarea.addEventListener("blur", function () {
        textarea.style.outline = "none";
        textarea.style.borderColor = "#e5e7eb";
      });
      noteDiv
        .querySelector(".edit-note-save-btn")
        .addEventListener("click", function () {
          const newText = textarea.value;
          noteDiv.innerHTML = `
          <div class='notes-header'>
            <span class='notes-title'><img src='assets/svgs/pen-line.svg' style='width:1em;height:1em;margin-right:0.3em;vertical-align:middle;'/> NOTES</span>
            <button class='edit-btn' data-note-id='${noteId}'>Edit</button>
          </div>
          <p class='note-text'>${newText}</p>
        `;
          attachEditHandler(noteDiv.querySelector(".edit-btn"));
        });
      noteDiv
        .querySelector(".edit-note-cancle-btn")
        .addEventListener("click", function () {
          noteDiv.innerHTML = `
          <div class='notes-header'>
            <span class='notes-title'><img src='assets/svgs/pen-line.svg' style='width:1em;height:1em;margin-right:0.3em;vertical-align:middle;'/> NOTES</span>
            <button class='edit-btn' data-note-id='${noteId}'>Edit</button>
          </div>
          <p class='note-text'>${noteText}</p>
        `;
          attachEditHandler(noteDiv.querySelector(".edit-btn"));
        });
    });
  }

  details.forEach((item, idx) => {
    const card = document.createElement("div");
    card.className = "coverage-item";

    const strength = parseFloat(item.strength);
    let strengthBg = "rgb(254 242 242)";
    let strengthBorder = "rgb(254 202 202)";
    let strengthColor = "rgb(220 38 38)";
    if (strength >= 40) {
      strengthBg = "rgb(240 253 244)";
      strengthBorder = "rgb(187 247 208)";
      strengthColor = "rgb(22 163 74)";
    } else if (strength >= 20) {
      strengthBg = "rgb(255 247 237)";
      strengthBorder = "rgb(255 247 237)";
      strengthColor = "rgb(234 88 12)";
    }

    const noteId = `coverage-note-${idx}`;

    card.innerHTML = `
      <div class='coverage-image-bg'>
        <div class='coverage-date-badge'>
          <div class='coverage-date-icon'>
            <img src='assets/svgs/calander.svg' alt='calendar'/>
          </div>
          <div class='coverage-date-d'>
            <p class='coverage-date-p'>Discovered on </p>
            <p class='coverage-date-sp'>${item.date}</p></div>
        </div>
        <img src='${
          item.image
        }' alt='Coverage image' class='coverage-image-bg-img' />
      </div>
      <div class='coverage-item-content'>
        <div class='coverage-source'>${item.source}</div>
        <h3 class='coverage-headline'>${item.headline}</h3>
        <div class='coverage-link-d'>
          <div class='coverage-link-p'>ARTICLE LINK</div>
          <a href='${item.link}' class='coverage-link' target='_blank'>
             ${
               item.link
             }<img src='assets/svgs/tolink.svg' alt='link' class='coverage-link-tolink-icon'/>
          </a>
        </div>
        <div class='coverage-stats'>
          <div class='coverage-stat reach'>
            <div class='coverage-stat-icon-d'><img src='assets/svgs/eye.svg' alt='eye' class='coverage-stat-eye-icon'/></div>
            <div class='coverage-stat-value reach'>${item.audience}</div>
            <div class='coverage-stat-label'>Lifetime Coverage Reach</div>
          </div>
          <div class='coverage-stat strength' style='background:${strengthBg};border:1px solid ${strengthBorder};color:${strengthColor};'>
            <div class='coverage-stat-icon-d'><img src='assets/svgs/trending-up.svg' alt='up' class='coverage-stat-up-icon'/></div>
            <div class='coverage-stat-value'>${item.strength}</div>
            <div class='coverage-stat-label'>Link Strength</div>
          </div>
        </div>
        <div class='coverage-notes' id='${noteId}'>
          <div class='notes-header'>
            <span class='notes-title'><img src='assets/svgs/pen-line.svg' class='notes-pen-icon'/><p class='notes-p'>NOTES</p></span>
            <button class='edit-btn' data-note-id='${noteId}'>Edit</button>
          </div>
          <p class='note-text'>${item.notes || ""}</p>
        </div>
      </div>
    `;
    coverageSection.appendChild(card);
  });

  document.querySelectorAll(".edit-btn").forEach(attachEditHandler);
}
