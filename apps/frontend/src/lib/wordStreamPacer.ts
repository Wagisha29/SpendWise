/**
 * Turns bursty stream deltas into a paced word-by-word reveal.
 * Incomplete trailing fragments stay buffered until a word boundary or finish().
 */
export function createWordStreamPacer(
  onWord: (word: string) => void,
  delayMs = 42,
) {
  let buffer = "";
  const queue: string[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;
  let finished = false;
  let settle: (() => void) | null = null;

  function notifyIdle() {
    if (finished && queue.length === 0 && timer == null && settle) {
      const done = settle;
      settle = null;
      done();
    }
  }

  function schedule() {
    if (timer != null || queue.length === 0) {
      notifyIdle();
      return;
    }
    timer = setTimeout(() => {
      timer = null;
      const word = queue.shift();
      if (word != null) onWord(word);
      schedule();
    }, delayMs);
  }

  function enqueueCompleteWords() {
    // Emit "word" + following whitespace; keep a trailing incomplete word in buffer.
    const pattern = /^(\S+\s+)/;
    let match = buffer.match(pattern);
    while (match) {
      queue.push(match[1]);
      buffer = buffer.slice(match[1].length);
      match = buffer.match(pattern);
    }
    schedule();
  }

  return {
    push(delta: string) {
      if (!delta) return;
      buffer += delta;
      enqueueCompleteWords();
    },
    finish(): Promise<void> {
      finished = true;
      if (buffer) {
        queue.push(buffer);
        buffer = "";
      }
      schedule();
      if (queue.length === 0 && timer == null) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        settle = resolve;
        notifyIdle();
      });
    },
  };
}
