import {
  animationFrameScheduler,
  delayWhen,
  observeOn,
  switchAll,
  timer,
} from 'rxjs';
import { Index, createMemo, from } from 'solid-js';
import { input$$, word$$ } from '../service/words';

function Word() {
  const word = from(
    word$$.pipe(switchAll(), observeOn(animationFrameScheduler, 300))
  );

  const input = from(
    input$$.pipe(delayWhen((v) => timer(v ? 0 : 200, animationFrameScheduler)))
  );

  const chars = createMemo(() => word()?.word?.split(''));

  return (
    <h2
      class="flex max-w-prose flex-col justify-center text-center font-mono"
      style="text-rendering: optimizeLegibility"
    >
      <dfn class="not-italic">
        <ruby>
          <span class="text-primary text-[5vw]">
            <Index each={chars()}>
              {(char, i) => {
                const inputChar = () => input()?.[i];
                const isCorrect = () => char() === inputChar();
                return (
                  <span
                    class={
                      (inputChar() ?? '') &&
                      (isCorrect() ? 'text-success' : 'text-error')
                    }
                  >
                    {char()}
                  </span>
                );
              }}
            </Index>
          </span>
          <rp>(</rp>
          <rt class="text-accent text-[1vw]">{word()?.pronunciation}</rt>
          <rp>)</rp>
        </ruby>
      </dfn>
      <span class="text-secondary text-[2vw]">
        {word()?.meanings.join(', ')}
      </span>
    </h2>
  );
}

export default Word;
