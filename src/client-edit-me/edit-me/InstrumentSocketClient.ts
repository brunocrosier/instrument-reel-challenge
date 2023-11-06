/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import {
  Instrument,
  InstrumentSymbol,
  WebSocketClientMessageJson,
  WebSocketMessage,
  WebSocketReadyState,
  WebSocketServerMessageJson,
} from "../../common-leave-me";

/**
 * Notes:
 * 
 * To subscribe or unsubscribe to/from instrument(s), send a message to the server with the following format:
 * 
 * export type WebSocketClientMessageJson =
  | {
      type: "subscribe";
      instrumentSymbols: InstrumentSymbol[];
    }
  | {
      type: "unsubscribe";
      instrumentSymbols: InstrumentSymbol[];
    };
  *
  * The server will start responding with a message with the following format:
  * 
  * export type WebSocketServerMessageJson = {
      type: "update";
      instruments: Instrument[];
    };
 */

/**
 * ❌ Please do not edit this class name
 */
export class InstrumentSocketClient {
  /**
   * ❌ Please do not edit this private property name
   */
  private _socket: WebSocket;

  // Map of the symbol and how many times it has been subscribed to (e.g 'BTC' => 4, 'ETH' => 3)
  private _instruments: Map<InstrumentSymbol, number> = new Map();

  /**
   * ✅ You can add more properties for the class here (if you want) 👇
   */

  constructor() {
    /**
     * ❌ Please do not edit this private property assignment
     */
    this._socket = new WebSocket("ws://localhost:3000/ws");

    /**
     * ✅ You can edit from here down 👇
     */
  }

  public open(callback: () => void) {
    if (this._socket.readyState === WebSocket.CLOSED) {
      this._socket = new WebSocket("ws://localhost:3000/ws");
    }

    if (this._socket.readyState === WebSocket.OPEN) {
      this._socket.removeEventListener("open", callback);
      callback();
    }

    else {
      this._socket.addEventListener("open", callback);
    }
  }

  public listen(
    symbols: InstrumentSymbol[],
    setInstruments: (instruments: Instrument[]) => void
  ) {
    symbols.forEach((symbol) => {
      const symbolCount = this._instruments.get(symbol)

      if (typeof symbolCount === 'undefined') {
        this._instruments.set(symbol, 1);
      } else {
        this._instruments.set(symbol, symbolCount + 1);
      }
    });

    const callback = (ev: MessageEvent<any>) => {

      const parsed = JSON.parse(ev.data) as WebSocketServerMessageJson // TODO: validate this with a schema validation lib instead of using type assertion

      const filtered = parsed.instruments.filter(instrument => symbols.includes(instrument.code)) as Instrument[]

      setInstruments(filtered)
    };

    this._socket.send(JSON.stringify({
      type: "subscribe",
      instrumentSymbols: symbols,
    }));

    this._socket.addEventListener("message", callback);

    return {
      unsubscribe: () => {
        const instrumentsToRemove: InstrumentSymbol[] = [];

        symbols.forEach((symbol) => {
          const symbolCount = this._instruments.get(symbol);

          if (typeof symbolCount === 'undefined') {
            throw new Error(`Cannot unsubscribe symbol ${symbol} as it is not currently subscribed`)
          } else {
            if (symbolCount === 1) {
              instrumentsToRemove.push(symbol)

              this._instruments.delete(symbol)
            } else {
              this._instruments.set(symbol, symbolCount - 1)
            }
          }
        });

        this._socket.send(JSON.stringify({
          type: "unsubscribe",
          instrumentSymbols: instrumentsToRemove,
        }));

        this._socket.removeEventListener("message", callback);
      },
    };
  }
}