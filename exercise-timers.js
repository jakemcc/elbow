const TRANSITION_SECONDS = 2;

const clampProgress = (progress) => Math.max(0, Math.min(1, progress));

const transitionPhase = (label, cue) => ({
  label,
  cue,
  seconds: TRANSITION_SECONDS,
  kind: "transition",
});

const makeAlternatingPhases = (count, seconds, first, second) =>
  Array.from({ length: count }, (_, index) => {
    const odd = index % 2 === 0;
    const rep = Math.floor(index / 2) + 1;
    const side = odd ? first : second;
    return [
      transitionPhase(`${side.moveLabel} ${rep}`, side.moveCue),
      {
        label: `${side.label} ${rep}`,
        cue: side.cue,
        seconds,
      },
    ];
  }).flat();

const makeHoldRepPhases = (reps, seconds, first, second) =>
  Array.from({ length: reps }, (_, index) => [
    transitionPhase(`${first.moveLabel} ${index + 1}`, first.moveCue),
    {
      label: `${first.label} ${index + 1}`,
      cue: first.cue,
      seconds,
    },
    transitionPhase(`${second.moveLabel} ${index + 1}`, second.moveCue),
    {
      label: `${second.label} ${index + 1}`,
      cue: second.cue,
      seconds,
    },
  ]).flat();

const makeRepPhases = (reps, seconds, first, second) =>
  Array.from({ length: reps }, (_, index) => [
    {
      label: `${first.label} ${index + 1}`,
      cue: first.cue,
      seconds,
    },
    {
      label: `${second.label} ${index + 1}`,
      cue: second.cue,
      seconds,
    },
  ]).flat();

export const TIMER_PLANS = {
  "flexor": {
    title: "5 guided reps",
    ready: "Start bent with a mild finger pull. Move smoothly and keep symptoms at 0-2/10.",
    done: "Set complete. Rest, then repeat for 2-3 total sets if tolerated.",
    phases: makeHoldRepPhases(
      5,
      4,
      {
        moveLabel: "Move straight",
        moveCue: "Take a moment to straighten the elbow without increasing the stretch.",
        label: "Hold straight",
        cue: "Hold the elbow straight with the same gentle forearm stretch.",
      },
      {
        moveLabel: "Move bent",
        moveCue: "Bend the elbow back to the start position smoothly.",
        label: "Hold bent",
        cue: "Hold the bent position without increasing stretch intensity.",
      },
    ),
  },
  "pec-90": {
    title: "One 90/90 round",
    ready: "Set the arm at 90/90. Hold a mild stretch only.",
    done: "Round complete. Repeat 2-3 reps per arm if symptoms stay calm.",
    phases: [
      transitionPhase(
        "Move into left",
        "Lean and rotate into the left-side stretch position.",
      ),
      {
        label: "Left hold",
        cue: "Lean and rotate away. Drive gently with the back foot.",
        seconds: 30,
      },
      transitionPhase(
        "Move to right",
        "Come out of the stretch and set up the other side.",
      ),
      {
        label: "Right hold",
        cue: "Lean and rotate away. Stop early if tingling starts.",
        seconds: 30,
      },
    ],
  },
  "pec-120": {
    title: "One 120-degree round",
    ready: "Slide the hand higher than 90 degrees. Keep the stretch mild.",
    done: "Round complete. Repeat 2-3 reps per arm if symptoms stay calm.",
    phases: [
      transitionPhase(
        "Move into left",
        "Lean and rotate into the left-side stretch position.",
      ),
      {
        label: "Left hold",
        cue: "Lean forward and rotate away. Avoid pain, numbness, or sharp tingling.",
        seconds: 30,
      },
      transitionPhase(
        "Move to right",
        "Come out gently and set the other arm at about 120 degrees.",
      ),
      {
        label: "Right hold",
        cue: "Hold a mild chest or front-shoulder stretch. Stop early if needed.",
        seconds: 30,
      },
    ],
  },
  "median-low": {
    title: "8 slow side-to-side reps",
    ready: "Start with elbows flexed and fingers in loose fists.",
    done: "Set complete. Build frequency only if symptoms settle quickly.",
    phases: makeAlternatingPhases(
      8,
      4,
      {
        moveLabel: "Move left",
        moveCue: "Turn the head left and settle into a gentle range.",
        label: "Look left",
        cue: "Straighten the fingers and turn left. One arm tensions while the other flosses.",
      },
      {
        moveLabel: "Move right",
        moveCue: "Turn the head right and keep the range easy.",
        label: "Look right",
        cue: "Turn right with the same easy range. Relax fingers or elbows if intensity climbs.",
      },
    ),
  },
  "median-high": {
    title: "8 smooth head turns",
    ready: "Start elbows bent, hands relaxed by your sides.",
    done: "Set complete. Stay gentle before adding more sets or days.",
    phases: makeAlternatingPhases(
      8,
      4,
      {
        moveLabel: "Move left",
        moveCue: "Raise the fingers as tolerated and turn the head left.",
        label: "Look left",
        cue: "Straighten the elbows, raise the fingers, and turn left.",
      },
      {
        moveLabel: "Move right",
        moveCue: "Turn the head right while keeping the fingers at an easy height.",
        label: "Look right",
        cue: "Turn right smoothly. Lower the fingers if symptoms climb.",
      },
    ),
  },
  "ulnar": {
    title: "8 ulnar glides",
    ready: "Use the lowest level that creates a light stretch.",
    done: "Set complete. Reduce range next time if symptoms linger.",
    phases: makeAlternatingPhases(
      8,
      4,
      {
        moveLabel: "Move left",
        moveCue: "Move the hands left or lower them slightly into position.",
        label: "Glide left",
        cue: "Move hands left or lower them slightly. Keep the sensation light.",
      },
      {
        moveLabel: "Move right",
        moveCue: "Move the hands right or return through center into position.",
        label: "Glide right",
        cue: "Move hands right or return through center. Avoid numbness or sharp tingling.",
      },
    ),
  },
  "superset-1": {
    title: "10 + 10 controlled reps",
    ready: "Use a light load and keep about 2 reps in reserve.",
    done: "Superset round complete. Rest, then continue for 2-3 total rounds if tolerated.",
    phases: [
      ...makeRepPhases(
        10,
        2,
        {
          label: "Pronate down",
          cue: "Let the offset load rotate only through a controlled range.",
        },
        {
          label: "Pronate up",
          cue: "Return smoothly without shoulder or wrist compensation.",
        },
      ),
      {
        ...transitionPhase("Switch exercise", "Set the forearm support for wrist flexion."),
        seconds: 15,
      },
      ...makeRepPhases(
        10,
        2,
        {
          label: "Flex down",
          cue: "Lower into wrist extension under control.",
        },
        {
          label: "Flex up",
          cue: "Curl into wrist flexion evenly without rushing.",
        },
      ),
    ],
  },
  "superset-2": {
    title: "10 + 10 controlled reps",
    ready: "Choose a load that stays smooth and symptom-light.",
    done: "Superset round complete. Rest, then continue for 2-3 total rounds if tolerated.",
    phases: [
      ...makeRepPhases(
        10,
        2,
        {
          label: "Curl up",
          cue: "Curl while supinating so the palm turns inward or upward.",
        },
        {
          label: "Lower down",
          cue: "Lower with control and keep the elbow comfortable.",
        },
      ),
      {
        ...transitionPhase("Switch exercise", "Move to finger curls with dumbbells at your sides."),
        seconds: 15,
      },
      ...makeRepPhases(
        10,
        2,
        {
          label: "Open fingers",
          cue: "Let the dumbbells roll down toward the end of your finger range.",
        },
        {
          label: "Close fingers",
          cue: "Curl back into a fist without turning it into wrist flexion.",
        },
      ),
    ],
  },
};

export function formatSeconds(seconds) {
  const rounded = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(rounded / 60);
  const remainder = String(rounded % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function totalPlanSeconds(plan) {
  return plan.phases.reduce((total, phase) => total + phase.seconds, 0);
}

export function markerProgressForPhase(phase, progress) {
  const clamped = clampProgress(progress);
  return phase.kind === "transition" ? 1 - clamped : clamped;
}

class ExerciseTimer {
  constructor(panel, plan) {
    this.panel = panel;
    this.plan = plan;
    this.phaseIndex = 0;
    this.phaseElapsed = 0;
    this.totalElapsed = 0;
    this.running = false;
    this.frame = 0;
    this.lastTime = 0;
    this.totalSeconds = totalPlanSeconds(plan);
    this.bindElements();
    this.bindEvents();
    this.renderReady();
  }

  bindElements() {
    this.title = this.panel.querySelector('[data-role="coach-title"]');
    this.time = this.panel.querySelector('[data-role="coach-time"]');
    this.visual = this.panel.querySelector(".coach-visual");
    this.phase = this.panel.querySelector('[data-role="coach-phase"]');
    this.cue = this.panel.querySelector('[data-role="coach-cue"]');
    this.startButton = this.panel.querySelector('[data-action="start"]');
    this.pauseButton = this.panel.querySelector('[data-action="pause"]');
    this.resetButton = this.panel.querySelector('[data-action="reset"]');
  }

  bindEvents() {
    this.startButton.addEventListener("click", () => this.start());
    this.pauseButton.addEventListener("click", () => this.pause());
    this.resetButton.addEventListener("click", () => this.reset());
  }

  renderReady() {
    this.title.textContent = this.plan.title;
    this.time.textContent = formatSeconds(this.totalSeconds);
    this.phase.textContent = "Ready";
    this.cue.textContent = this.plan.ready;
    this.visual.style.setProperty("--phase-progress", 0);
    this.visual.style.setProperty("--total-progress", 0);
  }

  start() {
    if (this.running) return;
    if (this.totalElapsed >= this.totalSeconds) {
      this.reset();
    }
    this.running = true;
    this.lastTime = performance.now();
    this.startButton.textContent = "Running";
    this.tick(this.lastTime);
  }

  pause() {
    this.running = false;
    this.startButton.textContent = "Start";
    window.cancelAnimationFrame(this.frame);
    this.render();
  }

  reset() {
    this.pause();
    this.phaseIndex = 0;
    this.phaseElapsed = 0;
    this.totalElapsed = 0;
    this.renderReady();
  }

  tick(now) {
    if (!this.running) return;
    const delta = Math.min((now - this.lastTime) / 1000, 0.25);
    this.lastTime = now;
    this.advance(delta);
    this.render();
    if (this.running) {
      this.frame = window.requestAnimationFrame((nextTime) => this.tick(nextTime));
    }
  }

  advance(delta) {
    let remainingDelta = delta;
    while (remainingDelta > 0 && this.phaseIndex < this.plan.phases.length) {
      const phase = this.plan.phases[this.phaseIndex];
      const remainingPhase = phase.seconds - this.phaseElapsed;
      const step = Math.min(remainingDelta, remainingPhase);
      this.phaseElapsed += step;
      this.totalElapsed = Math.min(this.totalSeconds, this.totalElapsed + step);
      remainingDelta -= step;

      if (this.phaseElapsed >= phase.seconds) {
        this.phaseIndex += 1;
        this.phaseElapsed = 0;
      }
    }

    if (this.phaseIndex >= this.plan.phases.length) {
      this.running = false;
      this.startButton.textContent = "Start";
    }
  }

  render() {
    if (this.phaseIndex >= this.plan.phases.length) {
      this.time.textContent = "0:00";
      this.phase.textContent = "Done";
      this.cue.textContent = this.plan.done;
      this.visual.style.setProperty("--phase-progress", 1);
      this.visual.style.setProperty("--total-progress", 1);
      return;
    }

    const phase = this.plan.phases[this.phaseIndex];
    const remaining = this.totalSeconds - this.totalElapsed;
    const phaseProgress = phase.seconds === 0 ? 1 : this.phaseElapsed / phase.seconds;
    const totalProgress = this.totalSeconds === 0 ? 1 : this.totalElapsed / this.totalSeconds;

    this.time.textContent = formatSeconds(remaining);
    this.phase.textContent = phase.label;
    this.cue.textContent = phase.cue;
    this.visual.style.setProperty(
      "--phase-progress",
      markerProgressForPhase(phase, phaseProgress).toFixed(3),
    );
    this.visual.style.setProperty("--total-progress", totalProgress.toFixed(3));
  }
}

function cloneTemplate() {
  const template = document.querySelector("#coach-template");
  return template.content.firstElementChild.cloneNode(true);
}

export function initializeExerciseTimers(root = document) {
  root.querySelectorAll("[data-timer-id]").forEach((exercise) => {
    const plan = TIMER_PLANS[exercise.dataset.timerId];
    if (!plan || exercise.querySelector(".coach-panel")) return;

    const panel = cloneTemplate();
    const actions = exercise.querySelector(".actions");
    exercise.insertBefore(panel, actions);
    new ExerciseTimer(panel, plan);
  });
}

if (typeof document !== "undefined") {
  initializeExerciseTimers();
}
