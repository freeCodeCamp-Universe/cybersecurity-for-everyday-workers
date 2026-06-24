import { MODULES, lessonHref } from "../../data/course.js";
import { isUnitDone, moduleProgress, clearAll } from "../progress/storage.js";
import { clearExerciseStore } from "../exercises/index.js";

const list = document.getElementById("module-list");

function statusBadge(progress) {
  const text = progress.complete ? "✓" : `${progress.done}/${progress.total}`;
  const cls = progress.complete ? "module-status is-complete" : "module-status";
  const aria = progress.complete
    ? "All units complete"
    : `${progress.done} of ${progress.total} units complete`;
  return `<span class="${cls}" aria-label="${aria}">${text}</span>`;
}

function unitItem(moduleId, unit) {
  const done = isUnitDone(moduleId, unit.id);
  const check = done ? "✓" : "";
  const label = done ? "Completed. " : "";
  const circleClass = done ? "unit-check is-done" : "unit-check";
  return `
    <li class="${done ? "is-done" : ""}">
      <a href="${lessonHref(moduleId, unit.id)}">
        <span class="${circleClass}" aria-hidden="true"><span class="check-icon">${check}</span></span>
        <span><span class="sr-only">${label}</span>Unit ${unit.id}: ${unit.title}</span>
      </a>
    </li>
  `;
}

function moduleCard(mod) {
  const progress = moduleProgress(mod);
  const units = mod.units.map((u) => unitItem(mod.id, u)).join("");
  return `
    <li>
      <details class="module-card" data-module-id="${mod.id}">
        <summary>
          ${statusBadge(progress)}
          <span>
            <span class="module-title">Module ${mod.id}: ${mod.title}</span>
            <span class="module-summary-text">${mod.summary}</span>
          </span>
          <span class="chevron" aria-hidden="true">▸</span>
        </summary>
        <ol class="unit-list">${units}</ol>
      </details>
    </li>
  `;
}

function findNextUnit() {
  for (const mod of MODULES) {
    for (const unit of mod.units) {
      if (!isUnitDone(mod.id, unit.id)) return { mod, unit };
    }
  }
  return null;
}

function renderContinue() {
  const el = document.getElementById("continue-bar");
  const next = findNextUnit();
  if (!next) {
    el.hidden = false;
    el.innerHTML = `<span class="continue-complete">✓ all lessons complete</span>`;
    return;
  }
  const anyDone = MODULES.some((m) => moduleProgress(m).done > 0);
  if (!anyDone) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.innerHTML = `
    <span class="continue-label">continue →</span>
    <a href="${lessonHref(next.mod.id, next.unit.id)}" class="continue-link">
      M${next.mod.id} · U${next.unit.id}: ${next.unit.title}
    </a>
  `;
}


function renderProgress() {
  const total = MODULES.reduce((sum, m) => sum + m.units.length, 0);
  const done = MODULES.reduce((sum, m) => sum + moduleProgress(m).done, 0);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById("course-progress").innerHTML = `
    <div class="progress-label">
      <span class="progress-count"><span class="progress-done">${done}</span> / ${total} lessons complete</span>
      <span class="progress-pct">${pct}%</span>
    </div>
    <div class="progress-track" role="progressbar" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${total}" aria-label="${done} of ${total} lessons complete">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>
  `;
}

function render() {
  renderProgress();
  renderContinue();
  list.innerHTML = MODULES.map(moduleCard).join("");
}

const resetDialog = document.getElementById("reset-dialog");

document.getElementById("reset-progress").addEventListener("click", () => {
  resetDialog.showModal();
});

document.getElementById("reset-dialog-cancel").addEventListener("click", () => {
  resetDialog.close();
});

document.getElementById("reset-dialog-confirm").addEventListener("click", () => {
  clearAll();
  clearExerciseStore();
  render();
  resetDialog.close();
});

resetDialog.addEventListener("click", (e) => {
  if (e.target === resetDialog) resetDialog.close();
});

render();
