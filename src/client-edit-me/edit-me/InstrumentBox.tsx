import { type Instrument } from "../../common-leave-me";
import "./InstrumentBox.css";
import { InstrumentWithDelta } from "./InstrumentReel";

export const InstrumentBox = ({
  instrument,
}: {
  instrument: InstrumentWithDelta;
}) => {
  const priceDeltaColor = Number(instrument.delta) > 0 ? "#48897B" : "#A55358";

  return (
    <div className="instrument-box">
      <Logo instrument={instrument} />
      <span className="name">{instrument.name}</span>
      <span className="price" style={{ color: priceDeltaColor }}>
        {instrument.lastQuote}
      </span>
      <span className="delta" style={{ color: priceDeltaColor }}>
        {instrument.delta}%
      </span>
    </div>
  );
};

const Logo = ({ instrument }: { instrument: Instrument }) => {
  if (instrument.category === "forex") {
    return (
      <div className="forex-logo">
        {instrument.name.split("/").map((currency, i) => (
          <img
            key={currency + i}
            src={`/${instrument.category}/${currency}.svg`}
            alt={`${currency} logo`}
            className="logo"
          />
        ))}
      </div>
    );
  }

  return (
    <img
      src={`/${instrument.category}/${instrument.code}.svg`}
      alt={`${instrument.code} logo`}
      className="logo"
    />
  );
};
