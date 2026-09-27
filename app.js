const perPage = 4;
let currentPage = 1;
let searchTerm = "";

const storyList = document.getElementById("storyList");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const dialog = document.getElementById("storyDialog");
const dialogContent = document.getElementById("dialogContent");

function getFilteredStories() {
  const query = searchTerm.trim().toLocaleLowerCase();
  if (!query) return stories;
  return stories.filter(story =>
    `${story.title} ${story.category} ${story.excerpt}`.toLocaleLowerCase().includes(query)
  );
}

function renderStories() {
  const filtered = getFilteredStories();
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  currentPage = Math.min(currentPage, pageCount);

  const start = (currentPage - 1) * perPage;
  const pageStories = filtered.slice(start, start + perPage);

  storyList.innerHTML = pageStories.length
    ? pageStories.map(story => `
      <article class="story-card">
        <div>
          <span class="story-category">${escapeHTML(story.category)}</span>
          <h3>${escapeHTML(story.title)}</h3>
          <p>${escapeHTML(story.excerpt)}</p>
          <a class="read-link" href="#story-${story.id}" data-story-id="${story.id}">पूरा कथा पढ्नुहोस् →</a>
        </div>
        <span class="story-meta">${escapeHTML(story.date)}</span>
      </article>
    `).join("")
    : `<p>यो खोजसँग मिल्ने कथा भेटिएन। अर्को शब्द प्रयोग गरेर खोज्नुहोस्।</p>`;

  renderPagination(pageCount);
}

function renderPagination(pageCount) {
  if (pageCount <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let buttons = `
    <button class="page-button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>←</button>
  `;

  for (let page = 1; page <= pageCount; page++) {
    buttons += `
      <button class="page-button ${page === currentPage ? "active" : ""}"
        data-page="${page}" ${page === currentPage ? 'aria-current="page"' : ""}>${page}</button>
    `;
  }

  buttons += `
    <button class="page-button" data-page="${currentPage + 1}" ${currentPage === pageCount ? "disabled" : ""}>→</button>
  `;
  pagination.innerHTML = buttons;
}

function openStory(id) {
  const story = stories.find(item => item.id === Number(id));
  if (!story) return;

  dialogContent.innerHTML = `
    <span class="dialog-category">${escapeHTML(story.category)} · ${escapeHTML(story.date)}</span>
    <h2 class="dialog-title">${escapeHTML(story.title)}</h2>
    <div class="dialog-body">${escapeHTML(story.content)}</div>
  `;
  dialog.showModal();
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

pagination.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  currentPage = Number(button.dataset.page);
  renderStories();
  document.getElementById("stories").scrollIntoView({ behavior: "smooth" });
});

storyList.addEventListener("click", event => {
  const link = event.target.closest("[data-story-id]");
  if (!link) return;
  event.preventDefault();
  openStory(link.dataset.storyId);
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  currentPage = 1;
  renderStories();
});

document.getElementById("closeDialog").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

renderStories();
