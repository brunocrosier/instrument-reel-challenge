import { InstrumentBox } from "../InstrumentBox";
import { type InstrumentWithDelta } from "../InstrumentReel";
import { useTicker } from "./useTicker";

function BaseTicker({ instruments }: { instruments: InstrumentWithDelta[] }) {
  const { contentRef, onMouseEnter, onMouseLeave } = useTicker();

  return (
    <div
      ref={contentRef}
      className="content"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {instruments.map((instrument) => (
        <InstrumentBox key={instrument.code} instrument={instrument} />
      ))}
    </div>
  );
}

export function Ticker({
  instruments,
}: {
  instruments: InstrumentWithDelta[];
}) {
  return (
    <>
      {/* This repetition is intentional - it allows the ticker to "loop" back around via CSS animation */}
      <BaseTicker instruments={instruments} />
      <BaseTicker instruments={instruments} />
      <BaseTicker instruments={instruments} />
      <BaseTicker instruments={instruments} />
      <BaseTicker instruments={instruments} />
    </>
  );
}
