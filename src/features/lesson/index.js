import {
  COURSE_TITLE,
  MODULES,
  getAdjacentUnit,
  getModule,
  getUnit,
  contentPath,
} from "../../data/course.js";
import { isUnitDone, setUnitDone } from "../progress/storage.js";
import { launchConfetti } from "../confetti.js";
import { mountExercises, clearLessonExercises } from "../exercises/index.js";

const titleEl = document.getElementById("lesson-title");
const objEl = document.getElementById("lesson-objective");
const bodyEl = document.getElementById("lesson-body");
const crumbEl = document.getElementById("breadcrumb");
const btn = document.getElementById("complete-btn");
const resetLessonBtn = document.getElementById("reset-lesson-btn");
const prevLink = document.getElementById("prev-link");
const nextLink = document.getElementById("next-link");
const lessonShell = document.getElementById("lesson");
const objectiveEl = document.querySelector(".lesson-objective");
const footerEl = document.querySelector(".lesson-footer");
const lessonLayout = document.querySelector(".lesson-layout");

const contentCache = new Map();

const SKELETON_HTML = `<div class="lesson-skeleton">
  <div class="lesson-skeleton-line"></div>
  <div class="lesson-skeleton-line"></div>
  <div class="lesson-skeleton-line"></div>
</div>`;

let currentLesson = null;
let requestSerial = 0;
let hasNavigated = false;
let sidebarFocusTrap = null;

resetLessonBtn.addEventListener("click", () => {
  if (!currentLesson) return;
  setUnitDone(currentLesson.moduleId, currentLesson.unitId, false);
  clearLessonExercises(lessonKey(currentLesson.moduleId, currentLesson.unitId));
  updateSidebarDone(currentLesson.moduleId, currentLesson.unitId, false);
  navigateTo(currentLesson, "replace");
});

btn.addEventListener("click", () => {
  if (!currentLesson) return;
  const nowDone = !isUnitDone(currentLesson.moduleId, currentLesson.unitId);
  setUnitDone(currentLesson.moduleId, currentLesson.unitId, nowDone);
  renderButton();
  updateSidebarDone(currentLesson.moduleId, currentLesson.unitId, nowDone);
  if (nowDone && isCourseDone()) {
    showCongrats();
  } else if (nowDone && isModuleDone(currentLesson.moduleId)) {
    showModuleComplete(currentLesson.moduleId);
  }
});

function isCourseDone() {
  return MODULES.every((m) => m.units.every((u) => isUnitDone(m.id, u.id)));
}

function isModuleDone(moduleId) {
  const mod = getModule(moduleId);
  return mod ? mod.units.every((u) => isUnitDone(moduleId, u.id)) : false;
}

function showCongrats() {
  const dialog = document.getElementById("congrats-dialog");
  dialog.showModal();
  launchConfetti(dialog);
  document.getElementById("congrats-close").onclick = () => dialog.close();
}

function showModuleComplete(moduleId) {
  const mod = getModule(moduleId);
  if (!mod) return;
  const dialog = document.getElementById("module-dialog");
  document.getElementById("module-dialog-title").textContent = `Module ${moduleId} complete`;
  document.getElementById("module-dialog-body").textContent = `You've finished all units in "${mod.title}".`;
  dialog.showModal();
  document.getElementById("module-dialog-next").onclick = () => {
    dialog.close();
    const next = getAdjacentUnit(currentLesson.moduleId, currentLesson.unitId, 1);
    if (next) navigateTo(next, "push");
  };
}

[prevLink, nextLink].forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || link.classList.contains("nav-empty")) return;
    if (!href.startsWith("?")) return;
    event.preventDefault();
    const url = new URL(href, window.location.href);
    navigateTo(parseLessonUrl(url), "push");
  });
});

window.addEventListener("popstate", () => {
  navigateTo(parseLessonUrl(new URL(window.location.href)), "pop");
});

const initialLesson = parseLessonUrl(new URL(window.location.href));
if (hasFiniteIds(initialLesson)) {
  window.history.replaceState(initialLesson, "", buildLessonUrl(initialLesson));
}
renderSidebar();
initSidebarToggle();
navigateTo(initialLesson, hasFiniteIds(initialLesson) ? "replace" : "pop");

async function navigateTo(target, historyMode) {
  const requestId = ++requestSerial;
  const mod = getModule(target.moduleId);
  const unit = getUnit(target.moduleId, target.unitId);

  lessonShell.classList.add("is-loading");
  footerEl.classList.add("is-loading");
  btn.disabled = true;
  bodyEl.innerHTML = SKELETON_HTML;

  if (!mod || !unit) {
    if (requestId !== requestSerial) return;
    applyHistory(target, historyMode);
    renderMissing(target);
    lessonShell.classList.remove("is-loading");
    footerEl.classList.remove("is-loading");
    btn.disabled = true;
    if (hasNavigated) titleEl.focus();
    hasNavigated = true;
    return;
  }

  const lessonHtml = await loadContent(target.moduleId, target.unitId);
  if (requestId !== requestSerial) return;

  const applyLesson = () => {
    currentLesson = { moduleId: mod.id, unitId: unit.id };
    document.title = `${unit.title} · ${mod.title}`;
    crumbEl.innerHTML = `Module ${mod.id} <span class="sep">›</span> Unit ${unit.id}`;
    titleEl.textContent = unit.title;
    objEl.textContent = unit.objective || `Complete this unit of "${mod.title}".`;
    bodyEl.innerHTML = lessonHtml;
    objectiveEl.hidden = false;
    footerEl.hidden = false;
    mountExercises(bodyEl, lessonKey(mod.id, unit.id));
    renderButton();
    renderNav();
  };

  applyHistory(target, historyMode);
  applyLesson();
  updateSidebarActive();
  window.scrollTo(0, 0);

  lessonShell.classList.remove("is-loading");
  footerEl.classList.remove("is-loading");
  btn.disabled = false;
  if (hasNavigated) titleEl.focus();
  hasNavigated = true;
  prefetchAdjacent(target.moduleId, target.unitId);
}

async function loadContent(moduleId, unitId) {
  const key = lessonKey(moduleId, unitId);
  if (!contentCache.has(key)) {
    contentCache.set(
      key,
      fetch(contentPath(moduleId, unitId))
        .then((response) => {
          if (!response.ok) throw new Error("missing");
          return response.text();
        })
        .catch(
          () =>
            `<p class="notice">Lesson content for Module ${moduleId}, Unit ${unitId} hasn't been written yet. You can still mark this unit as complete.</p>`
        )
    );
  }
  return contentCache.get(key);
}

function renderButton() {
  if (!currentLesson) return;
  const done = isUnitDone(currentLesson.moduleId, currentLesson.unitId);
  btn.className = done ? "btn btn--ghost" : "btn";
  btn.innerHTML = done
    ? `<span class="check">✓</span> Completed: click to undo`
    : `Mark as complete`;
}

function renderNav() {
  if (!currentLesson) return;
  const prev = getAdjacentUnit(currentLesson.moduleId, currentLesson.unitId, -1);
  const next = getAdjacentUnit(currentLesson.moduleId, currentLesson.unitId, 1);
  setNavLink(prevLink, prev, "← Previous");
  if (!next) {
    nextLink.textContent = "Finish course →";
    nextLink.href = "../";
    nextLink.classList.remove("nav-empty");
    nextLink.removeAttribute("aria-disabled");
    nextLink.tabIndex = 0;
  } else {
    setNavLink(nextLink, next, "Next →");
  }
}

function setNavLink(link, target, label) {
  link.textContent = label;
  if (!target) {
    link.href = "#";
    link.classList.add("nav-empty");
    link.setAttribute("aria-disabled", "true");
    link.tabIndex = -1;
    return;
  }

  link.href = buildLessonUrl(target);
  link.classList.remove("nav-empty");
  link.removeAttribute("aria-disabled");
  link.tabIndex = 0;
}

function renderMissing(target) {
  currentLesson = null;
  document.title = `Lesson not found · ${COURSE_TITLE}`;
  crumbEl.textContent = "";
  titleEl.textContent = "Lesson not found";
  bodyEl.innerHTML = `<p class="notice">That module or unit doesn't exist. <a href="../">Return to all modules</a>.</p>`;
  objectiveEl.hidden = true;
  footerEl.hidden = true;
}

function parseLessonUrl(url) {
  const params = url.searchParams;
  return {
    moduleId: Number(params.get("m")),
    unitId: Number(params.get("u")),
  };
}

function buildLessonUrl({ moduleId, unitId }) {
  return `?m=${moduleId}&u=${unitId}`;
}

function lessonKey(moduleId, unitId) {
  return `m${moduleId}u${unitId}`;
}

function hasFiniteIds({ moduleId, unitId }) {
  return Number.isFinite(moduleId) && Number.isFinite(unitId);
}

function renderSidebar() {
  const content = document.getElementById("sidebar-content");
  if (!content) return;

  content.innerHTML = MODULES.map(
    (mod) => `
    <div class="sidebar-module">
      <div class="sidebar-module-label">
        <span class="sidebar-module-num">M${mod.id}</span>
        <span>${mod.title}</span>
      </div>
      <ul class="sidebar-unit-list">
        ${mod.units
          .map((unit) => {
            const done = isUnitDone(mod.id, unit.id);
            return `
          <li>
            <a href="${buildLessonUrl({ moduleId: mod.id, unitId: unit.id })}"
               class="sidebar-unit-link${done ? " is-done" : ""}"
               id="sidebar-unit-${mod.id}-${unit.id}">
              <span class="unit-check${done ? " is-done" : ""}" aria-hidden="true"><span class="check-icon">${done ? "✓" : ""}</span></span>
              <span>Unit ${unit.id}: ${unit.title}</span>
            </a>
          </li>`;
          })
          .join("")}
      </ul>
    </div>`
  ).join("");

  document.getElementById("lesson-sidebar").addEventListener("click", (e) => {
    const link = e.target.closest(".sidebar-unit-link");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("?")) return;
    e.preventDefault();
    closeMobileSidebar();
    navigateTo(parseLessonUrl(new URL(href, window.location.href)), "push");
  });
}

function updateSidebarActive() {
  if (!currentLesson) return;
  document.querySelectorAll(".sidebar-unit-link").forEach((l) => l.classList.remove("is-active"));
  const activeLink = document.getElementById(
    `sidebar-unit-${currentLesson.moduleId}-${currentLesson.unitId}`
  );
  if (activeLink) {
    activeLink.classList.add("is-active");
    activeLink.scrollIntoView({ block: "nearest" });
  }
}

function updateSidebarDone(moduleId, unitId, isDone) {
  const link = document.getElementById(`sidebar-unit-${moduleId}-${unitId}`);
  if (!link) return;
  link.classList.toggle("is-done", isDone);
  const check = link.querySelector(".unit-check");
  if (check) {
    check.classList.toggle("is-done", isDone);
    const icon = check.querySelector(".check-icon");
    if (icon) icon.textContent = isDone ? "✓" : "";
  }
}

function initSidebarToggle() {
  const collapseBtn = document.getElementById("sidebar-collapse-btn");
  const menuBtn = document.getElementById("sidebar-menu-btn");
  const backdrop = document.getElementById("sidebar-backdrop");

  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      const isCollapsed = lessonLayout.classList.toggle("sidebar-collapsed");
      collapseBtn.textContent = isCollapsed ? "›" : "‹";
      collapseBtn.setAttribute("aria-expanded", String(!isCollapsed));
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openMobileSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => closeMobileSidebar({ returnFocus: true }));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileSidebar({ returnFocus: true });
  });
}

function openMobileSidebar() {
  lessonLayout.classList.add("sidebar-open");
  const backdrop = document.getElementById("sidebar-backdrop");
  const menuBtn = document.getElementById("sidebar-menu-btn");
  if (backdrop) backdrop.hidden = false;
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");

  const sidebar = document.getElementById("lesson-sidebar");
  const focusable = [...sidebar.querySelectorAll("a, button")].filter(
    (el) => el.offsetParent !== null
  );
  if (focusable.length) focusable[0].focus();

  sidebarFocusTrap = (e) => {
    if (e.key !== "Tab") return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", sidebarFocusTrap);
}

function closeMobileSidebar({ returnFocus = false } = {}) {
  lessonLayout.classList.remove("sidebar-open");
  const backdrop = document.getElementById("sidebar-backdrop");
  const menuBtn = document.getElementById("sidebar-menu-btn");
  if (backdrop) backdrop.hidden = true;
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");

  if (sidebarFocusTrap) {
    document.removeEventListener("keydown", sidebarFocusTrap);
    sidebarFocusTrap = null;
  }
  if (returnFocus && menuBtn) menuBtn.focus();
}

function applyHistory(target, historyMode) {
  const url = buildLessonUrl(target);
  if (historyMode === "push") {
    window.history.pushState(target, "", url);
    return;
  }
  if (historyMode === "replace") {
    window.history.replaceState(target, "", url);
  }
}

function prefetchAdjacent(moduleId, unitId) {
  const prev = getAdjacentUnit(moduleId, unitId, -1);
  const next = getAdjacentUnit(moduleId, unitId, 1);

  [prev, next]
    .filter(Boolean)
    .forEach((target) => {
      loadContent(target.moduleId, target.unitId);
    });
}
