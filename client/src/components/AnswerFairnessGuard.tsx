import { useEffect } from "react";

const GRID_SELECTOR = ".am-answer-grid, .bp-bubble-arena, .shapes-answer-grid";
const QUESTION_SELECTOR = ".am-question h1, .bp-question-card h1, .shapes-question-panel h3";

const shuffle = <T,>(items: readonly T[]) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
};

const answerKey = (grid: Element, buttons: readonly HTMLButtonElement[]) => {
  const question = grid.parentElement?.querySelector(QUESTION_SELECTOR)?.textContent ?? "";
  const answers = buttons
    .map(button => button.textContent?.replace(/^\s*\d+\s*/, "").trim() ?? "")
    .sort()
    .join("|");
  return `${question}|${answers}`;
};

const relabel = (button: HTMLButtonElement, position: number) => {
  const label = button.firstElementChild;
  if (label?.tagName === "I" || label?.tagName === "SPAN") {
    label.textContent = String(position);
  }
  button.dataset.mosyAnswerPosition = String(position);
};

/**
 * A presentation-only guard for the shared arcade answer grids.
 * Teacher questions and answer values stay untouched; only tile placement changes.
 */
export default function AnswerFairnessGuard() {
  useEffect(() => {
    const randomizeGrid = (grid: Element) => {
      const buttons = Array.from(grid.querySelectorAll(":scope > button")) as HTMLButtonElement[];
      if (buttons.length < 3 || buttons.some(button => button.disabled)) return;
      const key = answerKey(grid, buttons);
      if (grid.getAttribute("data-mosy-answer-key") === key) return;
      grid.setAttribute("data-mosy-answer-key", key);
      shuffle(buttons).forEach((button, index) => {
        grid.append(button);
        relabel(button, index + 1);
      });
    };

    const randomizeAll = () => {
      document.querySelectorAll(GRID_SELECTOR).forEach(randomizeGrid);
    };
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(randomizeAll);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    randomizeAll();

    const chooseVisibleTile = (event: KeyboardEvent) => {
      const position = Number(event.key) - 1;
      if (position < 0 || position > 3) return;
      const grid = Array.from(document.querySelectorAll(GRID_SELECTOR)).find(candidate => {
        const styles = window.getComputedStyle(candidate);
        return styles.display !== "none" && styles.visibility !== "hidden";
      });
      const button = grid?.querySelectorAll<HTMLButtonElement>(":scope > button")[position];
      if (!button || button.disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      button.click();
    };
    document.addEventListener("keydown", chooseVisibleTile, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", chooseVisibleTile, true);
    };
  }, []);

  return null;
}
