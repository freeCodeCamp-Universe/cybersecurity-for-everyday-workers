const STORE_KEY = "fcc-cyber-exercise";

function readStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function writeStore(data) { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
export function clearExerciseStore() { localStorage.removeItem(STORE_KEY); }
export function clearLessonExercises(lessonKey) {
  const all = readStore();
  for (const key of Object.keys(all)) {
    if (key.startsWith(`${lessonKey}:`)) delete all[key];
  }
  writeStore(all);
}
function getState(id) { return readStore()[id] || {}; }
function setState(id, value) {
  const all = readStore();
  all[id] = value;
  writeStore(all);
}

function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text != null) node.textContent = opts.text;
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  if (opts.html != null) node.innerHTML = opts.html;
  for (const c of children) if (c) node.appendChild(c);
  return node;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function mountExercises(container, lessonKey) {
  const scripts = container.querySelectorAll('script[type="application/json"][data-exercise]');
  scripts.forEach((script, i) => {
    let cfg;
    try { cfg = JSON.parse(script.textContent); } catch { return; }
    const id = `${lessonKey}:${i}`;
    const wrap = el("div", { class: "exercise-widget" });
    if (cfg.instructions) {
      wrap.appendChild(el("p", { class: "exercise-instructions", text: cfg.instructions }));
    }
    const body = el("div", { class: "exercise-body" });
    wrap.appendChild(body);
    script.replaceWith(wrap);
    switch (cfg.type) {
      case "quiz": renderQuiz(body, cfg, id); break;
      case "multiquiz": renderMultiquiz(body, cfg, id); break;
      case "sort": renderSort(body, cfg, id); break;
      case "match": renderMatch(body, cfg, id); break;
      case "order": renderOrder(body, cfg, id); break;
      case "matrix": renderMatrix(body, cfg, id); break;
      case "cloze": renderCloze(body, cfg, id); break;
      case "classify_steps": renderClassifySteps(body, cfg, id); break;
      case "checklist": renderChecklist(body, cfg, id); break;
      case "freetext": renderFreetext(body, cfg, id); break;
      default:
        body.appendChild(el("p", { class: "notice", text: `Unknown exercise type: ${cfg.type}` }));
    }
  });
}

function renderQuiz(host, cfg, id) {
  const saved = getState(id);
  const answers = saved.answers || {};
  cfg.questions.forEach((q, qi) => {
    const block = el("fieldset", { class: "quiz-question" });
    block.appendChild(el("legend", { class: "quiz-prompt", text: `${qi + 1}. ${q.prompt}` }));
    const optsList = el("div", { class: "quiz-options" });
    q.options.forEach((opt, oi) => {
      const optId = `${id}-q${qi}-o${oi}`;
      const label = el("label", { class: "quiz-option", attrs: { for: optId } });
      const input = el("input", { attrs: { type: "radio", name: `${id}-q${qi}`, id: optId, value: String(oi) } });
      if (answers[qi] === oi) input.checked = true;
      label.appendChild(input);
      label.appendChild(el("span", { text: opt.text }));
      optsList.appendChild(label);
    });
    block.appendChild(optsList);
    const fb = el("div", { class: "quiz-feedback", attrs: { "aria-live": "polite" } });
    block.appendChild(fb);
    host.appendChild(block);

    if (answers[qi] != null) showFeedback(fb, q.options[answers[qi]], q.options[answers[qi]].correct);

    optsList.addEventListener("change", (e) => {
      const choice = Number(e.target.value);
      answers[qi] = choice;
      setState(id, { answers });
      showFeedback(fb, q.options[choice], q.options[choice].correct);
    });
  });
}

function showFeedback(el, opt, correct) {
  el.className = `quiz-feedback ${correct ? "is-correct" : "is-wrong"}`;
  el.textContent = `${correct ? "✓ " : "✗ "}${opt.feedback || (correct ? "Correct." : "Not quite — try another.")}`;
}

function renderMultiquiz(host, cfg, id) {
  const saved = getState(id);
  const answers = saved.answers || {};
  cfg.questions.forEach((q, qi) => {
    const block = el("fieldset", { class: "quiz-question" });
    block.appendChild(el("legend", { class: "quiz-prompt", text: `${qi + 1}. ${q.prompt}` }));
    const optsList = el("div", { class: "quiz-options" });
    const selected = new Set(Array.isArray(answers[qi]) ? answers[qi] : []);
    q.options.forEach((opt, oi) => {
      const optId = `${id}-q${qi}-o${oi}`;
      const label = el("label", { class: "quiz-option", attrs: { for: optId } });
      const input = el("input", { attrs: { type: "checkbox", id: optId, value: String(oi) } });
      if (selected.has(oi)) input.checked = true;
      label.appendChild(input);
      label.appendChild(el("span", { text: opt.text }));
      optsList.appendChild(label);
    });
    block.appendChild(optsList);
    const fb = el("div", { class: "quiz-feedback", attrs: { "aria-live": "polite" } });
    block.appendChild(fb);
    host.appendChild(block);

    const evaluate = () => {
      const choice = [...optsList.querySelectorAll("input:checked")]
        .map((input) => Number(input.value))
        .sort((a, b) => a - b);
      answers[qi] = choice;
      setState(id, { answers });
      if (!choice.length) {
        fb.textContent = "";
        fb.className = "quiz-feedback";
        return;
      }
      const correctSet = [...(q.correct_indices || [])].sort((a, b) => a - b);
      const correct = choice.length === correctSet.length && choice.every((v, i) => v === correctSet[i]);
      fb.className = `quiz-feedback ${correct ? "is-correct" : "is-wrong"}`;
      fb.textContent = `${correct ? "✓ " : "✗ "}${correct ? (q.feedback_correct || "Correct.") : (q.feedback_incorrect || "Not quite — adjust your selections.")}`;
    };

    optsList.addEventListener("change", evaluate);
    if (selected.size) evaluate();
  });
}

function renderSort(host, cfg, id) {
  const saved = getState(id).placements || {};
  const placements = { ...saved };
  cfg.items.forEach((item, i) => {
    const row = el("div", { class: "sort-row" });
    row.appendChild(el("span", { class: "sort-text", text: item.text }));
    const select = el("select", { class: "sort-select", attrs: { "aria-label": `Category for: ${item.text}` } });
    select.appendChild(el("option", { text: "Choose…", attrs: { value: "" } }));
    cfg.categories.forEach((cat) => select.appendChild(el("option", { text: cat, attrs: { value: cat } })));
    if (placements[i]) select.value = placements[i];
    const fb = el("span", { class: "sort-feedback", attrs: { "aria-live": "polite", "aria-atomic": "true" } });
    row.appendChild(select);
    row.appendChild(fb);
    host.appendChild(row);

    const evaluate = () => {
      const choice = select.value;
      placements[i] = choice;
      setState(id, { placements });
      if (!choice) { fb.textContent = ""; fb.className = "sort-feedback"; return; }
      const correct = choice === item.category;
      fb.textContent = correct ? "✓" : `✗ ${item.explanation || `Should be: ${item.category}`}`;
      fb.className = `sort-feedback ${correct ? "is-correct" : "is-wrong"}`;
    };
    select.addEventListener("change", evaluate);
    if (placements[i]) evaluate();
  });
}

function renderMatch(host, cfg, id) {
  const saved = getState(id).pairs || {};
  const pairs = { ...saved };
  const rightOptions = Array.from(new Set(cfg.right));
  cfg.left.forEach((leftItem, i) => {
    const row = el("div", { class: "match-row" });
    row.appendChild(el("span", { class: "match-left", text: leftItem }));
    row.appendChild(el("span", { class: "match-arrow", text: "→" }));
    const select = el("select", { class: "match-select", attrs: { "aria-label": `Match for: ${leftItem}` } });
    select.appendChild(el("option", { text: "Choose…", attrs: { value: "" } }));
    rightOptions.forEach((r) => select.appendChild(el("option", { text: r, attrs: { value: r } })));
    if (pairs[leftItem]) select.value = pairs[leftItem];
    const fb = el("span", { class: "match-feedback", attrs: { "aria-live": "polite", "aria-atomic": "true" } });
    const selectWrap = el("div", { class: "match-select-wrap" });
    selectWrap.appendChild(select);
    row.appendChild(selectWrap);
    row.appendChild(fb);
    host.appendChild(row);

    const evaluate = () => {
      const choice = select.value;
      pairs[leftItem] = choice;
      setState(id, { pairs });
      if (!choice) { fb.textContent = ""; fb.className = "match-feedback"; return; }
      const correct = choice === cfg.answers[leftItem];
      fb.textContent = correct ? "✓" : `✗ Try again`;
      fb.className = `match-feedback ${correct ? "is-correct" : "is-wrong"}`;
    };
    select.addEventListener("change", evaluate);
    if (pairs[leftItem]) evaluate();
  });
}

function renderOrder(host, cfg, id) {
  const saved = getState(id).order;
  const initial = saved || shuffle(cfg.items.map((_, i) => i));
  const list = el("ol", { class: "order-list" });
  host.appendChild(list);
  const fb = el("div", { class: "order-feedback", attrs: { "aria-live": "polite" } });
  host.appendChild(fb);
  let hasMoved = !!saved;

  function render(order) {
    list.innerHTML = "";
    order.forEach((idx, pos) => {
      const li = el("li", { class: "order-item" });
      li.appendChild(el("span", { class: "order-text", text: cfg.items[idx] }));
      const ctrl = el("span", { class: "order-controls" });
      const up = el("button", { class: "order-btn", text: "▲", attrs: { type: "button", "aria-label": "Move up" } });
      const down = el("button", { class: "order-btn", text: "▼", attrs: { type: "button", "aria-label": "Move down" } });
      up.disabled = pos === 0;
      down.disabled = pos === order.length - 1;
      up.addEventListener("click", () => move(pos, pos - 1));
      down.addEventListener("click", () => move(pos, pos + 1));
      ctrl.appendChild(up);
      ctrl.appendChild(down);
      li.appendChild(ctrl);
      list.appendChild(li);
    });
    setState(id, { order });
    const correct = order.every((idx, i) => idx === i);
    if (hasMoved && correct) {
      fb.textContent = "✓ Order is correct.";
      fb.className = "order-feedback is-correct";
    } else if (hasMoved) {
      fb.textContent = "✗ Not quite yet — keep adjusting.";
      fb.className = "order-feedback is-wrong";
    } else {
      fb.textContent = "";
      fb.className = "order-feedback";
    }
  }
  function move(from, to) {
    hasMoved = true;
    const next = [...initial];
    [next[from], next[to]] = [next[to], next[from]];
    initial.length = 0;
    initial.push(...next);
    render(initial);
  }
  render(initial);
}

function renderChecklist(host, cfg, id) {
  const saved = getState(id).items || {};
  const items = { ...saved };
  cfg.items.forEach((text, i) => {
    const itemId = `${id}-item-${i}`;
    const row = el("label", { class: "checklist-item", attrs: { for: itemId } });
    const input = el("input", { attrs: { type: "checkbox", id: itemId } });
    if (items[i]) input.checked = true;
    input.addEventListener("change", () => {
      items[i] = input.checked;
      setState(id, { items });
    });
    row.appendChild(input);
    row.appendChild(el("span", { text }));
    host.appendChild(row);
  });
}

function renderMatrix(host, cfg, id) {
  const saved = getState(id).answers || {};
  const answers = { ...saved };
  const wrap = el("div", { class: "matrix-table-wrap" });
  const table = el("table", { class: "matrix-table" });
  const captionText = cfg.instructions || cfg.prompt_header || "Exercise table";
  table.appendChild(el("caption", { class: "sr-only", text: captionText }));
  const thead = el("thead");
  const headRow = el("tr");
  headRow.appendChild(el("th", { text: cfg.prompt_header || "Scenario", attrs: { scope: "col" } }));
  cfg.columns.forEach((column) => {
    headRow.appendChild(el("th", { text: column, attrs: { scope: "col" } }));
  });
  thead.appendChild(headRow);
  table.appendChild(thead);
  const tbody = el("tbody");

  cfg.rows.forEach((row, i) => {
    const tr = el("tr");
    tr.appendChild(el("th", { text: row.prompt, attrs: { scope: "row" } }));
    cfg.columns.forEach((column) => {
      const td = el("td");
      const radioId = `${id}-row-${i}-${column}`;
      const input = el("input", {
        attrs: {
          type: "radio",
          id: radioId,
          name: `${id}-row-${i}`,
          value: column,
          "aria-label": `${row.prompt} → ${column}`,
        },
      });
      if (answers[i] === column) input.checked = true;
      input.addEventListener("change", () => {
        answers[i] = column;
        setState(id, { answers });
        evaluate();
      });
      td.appendChild(input);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  host.appendChild(wrap);
  const feedback = el("div", { class: "matrix-feedback", attrs: { "aria-live": "polite" } });
  host.appendChild(feedback);

  function evaluate() {
    const rowsAnswered = cfg.rows.every((_, i) => answers[i]);
    if (!rowsAnswered) {
      feedback.textContent = "";
      feedback.className = "matrix-feedback";
      return;
    }
    const wrong = cfg.rows.filter((row, i) => answers[i] !== row.correct_column);
    if (!wrong.length) {
      feedback.innerHTML = `<div>✓ ${cfg.feedback_correct || "All rows are correct."}</div>`;
      feedback.className = "matrix-feedback is-correct";
      return;
    }
    const lines = wrong.map((row) => row.explanation || `"${row.prompt}": correct answer is ${row.correct_column}`);
    feedback.innerHTML = lines.map((line) => `<div>✗ ${line}</div>`).join("");
    feedback.className = "matrix-feedback is-wrong";
  }

  evaluate();
}

function renderCloze(host, cfg, id) {
  const saved = getState(id);
  const answers = saved.answers || {};
  const wrap = el("div", { class: "cloze" });
  const prompt = el("div", { class: "cloze-prompt" });
  (cfg.segments || []).forEach((segment, i) => {
    prompt.append(segment);
    if (i < (cfg.blanks || []).length) {
      const blank = cfg.blanks[i];
      const select = el("select", { class: "cloze-select", attrs: { "aria-label": `Fill blank ${i + 1}` } });
      select.appendChild(el("option", { text: "Choose…", attrs: { value: "" } }));
      cfg.tokens.forEach((token) => {
        select.appendChild(el("option", { text: token.label, attrs: { value: token.id } }));
      });
      if (answers[i]) select.value = answers[i];
      select.addEventListener("change", () => {
        answers[i] = select.value;
        setState(id, { answers });
        evaluate();
      });
      prompt.appendChild(select);
    }
  });
  wrap.appendChild(prompt);
  host.appendChild(wrap);
  const feedback = el("div", { class: "matrix-feedback", attrs: { "aria-live": "polite" } });
  host.appendChild(feedback);

  function evaluate() {
    const complete = (cfg.blanks || []).every((_, i) => answers[i]);
    if (!complete) {
      feedback.textContent = "";
      feedback.className = "matrix-feedback";
      return;
    }
    const wrong = (cfg.blanks || []).filter((blank, i) => answers[i] !== blank.correct);
    if (!wrong.length) {
      feedback.textContent = cfg.feedback_correct || "✓ Completed correctly.";
      feedback.className = "matrix-feedback is-correct";
      return;
    }
    feedback.textContent = `✗ ${cfg.feedback_incorrect || "One or more blanks are incorrect."}`;
    feedback.className = "matrix-feedback is-wrong";
  }

  evaluate();
}

function renderClassifySteps(host, cfg, id) {
  const rows = (cfg.steps || []).map((step) => ({
    prompt: step.text,
    correct_column: step.correct,
    explanation: step.explanation,
  }));
  renderMatrix(host, {
    prompt_header: cfg.prompt_header || "Step",
    columns: cfg.targets,
    rows,
    feedback_correct: cfg.feedback_correct,
  }, id);
}

function renderFreetext(host, cfg, id) {
  const saved = getState(id).values || {};
  const values = { ...saved };
  cfg.fields.forEach((f, i) => {
    const fieldId = `${id}-f-${i}`;
    const wrap = el("div", { class: "freetext-field" });
    wrap.appendChild(el("label", { text: f.label, attrs: { for: fieldId } }));
    const ta = el("textarea", { attrs: { id: fieldId, rows: String(f.rows || 3), placeholder: f.placeholder || "" } });
    if (values[i]) ta.value = values[i];
    let timer;
    const status = el("span", { class: "freetext-status", attrs: { "aria-live": "polite" } });
    ta.addEventListener("input", () => {
      values[i] = ta.value;
      status.textContent = "Saving…";
      clearTimeout(timer);
      timer = setTimeout(() => {
        setState(id, { values });
        status.textContent = "Saved";
        setTimeout(() => { status.textContent = ""; }, 1500);
      }, 300);
    });
    wrap.appendChild(ta);
    wrap.appendChild(status);
    host.appendChild(wrap);
  });
}
