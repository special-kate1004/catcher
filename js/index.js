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
  // Attach edit handlers to existing edit buttons
  attachEditHandlers();
});

function attachEditHandlers() {
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

  document.querySelectorAll(".edit-btn").forEach(attachEditHandler);
}
