/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import { type Instrument, type InstrumentSymbol } from "../../common-leave-me";
import { InstrumentSocketClient } from "./InstrumentSocketClient";
import "./InstrumentReel.css";
import { useEffect, useRef, useState } from "react";
import { Ticker } from "./Ticker/Ticker";
import { calculateDelta } from "./calculateDelta";

/**
 * ❌ Please do not edit this
 */
const client = new InstrumentSocketClient();

/**
 * ❌ Please do not edit this hook name & args
 */
function useInstruments(instrumentSymbols: InstrumentSymbol[]) {
  /**
   * ✅ You can edit inside the body of this hook
   */

  const prevInstruments = useRef<Instrument[]>([]);
  const [latestInstruments, setLatestInstruments] = useState<Instrument[]>([]);
  const [instruments, setInstruments] = useState<InstrumentWithDelta[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    client.open(() => setIsOpen(true));

    if (isOpen) {
      const { unsubscribe } = client.listen(
        instrumentSymbols,
        setLatestInstruments
      );
      return () => unsubscribe();
    }
  }, [isOpen]);

  useEffect(() => {
    const instrumentsWithDelta: InstrumentWithDelta[] = latestInstruments.map(
      (instrument) => {
        return {
          ...instrument,
          delta: calculateDelta({
            prevQuote: prevInstruments.current.find(
              (n) => n.code === instrument.code
            )?.lastQuote,
            latestQuote: instrument.lastQuote,
          }),
        };
      }
    );

    setInstruments(instrumentsWithDelta);

    prevInstruments.current = latestInstruments;
  }, [latestInstruments]);

  return instruments;
}

export interface InstrumentReelProps {
  instrumentSymbols: InstrumentSymbol[];
}
export type InstrumentWithDelta = Instrument & { delta: string };

export interface InstrumentReelProps {
  instrumentSymbols: InstrumentSymbol[];
}

function InstrumentReel({ instrumentSymbols }: InstrumentReelProps) {
  /**
   * ❌ Please do not edit this
   */
  const instruments = useInstruments(instrumentSymbols);

  const loading = !(
    instruments.length && instruments.every((n) => n.delta !== "loading")
  );

  /**
   * ✅ You can edit from here down in this component.
   * Please feel free to add more components to this file or other files if you want to.
   */

  return (
    <div className="instrument-reel">
      {loading ? (
        <span className="loading">Loading instruments...</span>
      ) : (
        <div className="wrapper">
          <Ticker instruments={instruments} />
        </div>
      )}
    </div>
  );
}

export default InstrumentReel;
