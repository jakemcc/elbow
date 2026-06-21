import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import * as timers from "./exercise-timers.js";

const { TIMER_PLANS, totalPlanSeconds } = timers;

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

const exerciseIds = [
  "flexor",
  "pec-90",
  "pec-120",
  "median-low",
  "median-high",
  "ulnar",
  "superset-1",
  "superset-2",
];

test("every movement embeds a guided timer panel", () => {
  for (const id of exerciseIds) {
    const articlePattern = new RegExp(
      `<article[^>]+id="${id}"[^>]+data-timer-id="${id}"`,
    );
    assert.match(html, articlePattern, `${id} is missing a timer data hook`);
  }

  assert.match(html, /class="coach-panel"/);
  assert.match(html, /class="coach-button"[^>]*data-action="start"/);
  assert.match(html, /class="coach-button"[^>]*data-action="reset"/);
  assert.match(html, /type="module" src="\.\/exercise-timers\.js\?v=transitions-1"/);
});

test("position-changing movements include short transition phases before holds", () => {
  const pec90 = TIMER_PLANS["pec-90"];
  assert.deepEqual(
    pec90.phases.slice(0, 3).map((phase) => ({
      label: phase.label,
      seconds: phase.seconds,
      kind: phase.kind,
    })),
    [
      { label: "Move into left", seconds: 2, kind: "transition" },
      { label: "Left hold", seconds: 30, kind: undefined },
      { label: "Move to right", seconds: 2, kind: "transition" },
    ],
  );

  const medianLow = TIMER_PLANS["median-low"];
  assert.deepEqual(
    medianLow.phases.slice(0, 4).map((phase) => ({
      label: phase.label,
      seconds: phase.seconds,
      kind: phase.kind,
    })),
    [
      { label: "Move left 1", seconds: 3, kind: "transition" },
      { label: "Look left 1", seconds: 4, kind: undefined },
      { label: "Move right 1", seconds: 3, kind: "transition" },
      { label: "Look right 1", seconds: 4, kind: undefined },
    ],
  );

  const medianHigh = TIMER_PLANS["median-high"];
  assert.deepEqual(
    medianHigh.phases.slice(0, 4).map((phase) => ({
      label: phase.label,
      seconds: phase.seconds,
      kind: phase.kind,
    })),
    [
      { label: "Move left 1", seconds: 3, kind: "transition" },
      { label: "Look left 1", seconds: 4, kind: undefined },
      { label: "Move right 1", seconds: 3, kind: "transition" },
      { label: "Look right 1", seconds: 4, kind: undefined },
    ],
  );

  assert.equal(totalPlanSeconds(medianLow), 56);
  assert.equal(totalPlanSeconds(medianHigh), 56);
});

test("transition phases move the marker opposite the normal hold direction", () => {
  assert.equal(typeof timers.markerProgressForPhase, "function");
  const { markerProgressForPhase } = timers;

  assert.equal(markerProgressForPhase({ kind: "transition" }, 0), 1);
  assert.equal(markerProgressForPhase({ kind: "transition" }, 0.25), 0.75);
  assert.equal(markerProgressForPhase({ kind: "hold" }, 0.25), 0.25);
  assert.equal(markerProgressForPhase({}, 1), 1);
});
