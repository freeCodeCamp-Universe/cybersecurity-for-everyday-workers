const KEY = "fcc-cyber-progress";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function unitKey(moduleId, unitId) {
  return `${moduleId}-${unitId}`;
}

export function isUnitDone(moduleId, unitId) {
  return Boolean(read()[unitKey(moduleId, unitId)]);
}

export function setUnitDone(moduleId, unitId, done) {
  const state = read();
  if (done) state[unitKey(moduleId, unitId)] = true;
  else delete state[unitKey(moduleId, unitId)];
  write(state);
}

export function moduleProgress(module) {
  const state = read();
  const done = module.units.filter((u) => state[unitKey(module.id, u.id)]).length;
  return { done, total: module.units.length, complete: done === module.units.length };
}

export function clearAll() {
  localStorage.removeItem(KEY);
}
