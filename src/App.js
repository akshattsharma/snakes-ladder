import React, { useState } from "react";
import { LADDERS, SNAKES, cellNumber, move } from "./game";

// Every visible string lives here so it can be matched to the design images in one place.
const TEXT = {
  title: "Snakes & Ladders",
  rule: "Exact 100 is required to win. Land on a ladder to climb up, a snake to slide down.",
  turn: (name) => `${name}'s turn`,
  roll: "Roll Dice",
  rolled: (name, d) => `${name} rolled a ${d}`,
  start: "Start",
  winner: (name) => `${name} wins!`,
  playAgain: "Play Again",
  needExact: (name, d, need) => `${name} rolled ${d} but needs exactly ${need} to reach 100`,
  moved: (name, d, pos) => `${name} rolled ${d} and moved to ${pos}`,
  ladder: (name, d, from, to) => `${name} rolled ${d}, climbed a ladder from ${from} to ${to}`,
  snake: (name, d, from, to) => `${name} rolled ${d}, was bitten by a snake at ${from} and slid to ${to}`,
};

const PLAYERS = ["Player 1", "Player 2"];
const ROWS = Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => cellNumber(r, c)));

export default function App() {
  const [positions, setPositions] = useState([0, 0]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(null);
  const [message, setMessage] = useState("");
  const [winner, setWinner] = useState(null);

  const roll = () => {
    if (winner !== null) return;
    const d = 1 + Math.floor(Math.random() * 6);
    const name = PLAYERS[turn];
    const result = move(positions[turn], d);

    let text;
    if (result.blocked) text = TEXT.needExact(name, d, 100 - positions[turn]);
    else if (result.kind === "ladder") text = TEXT.ladder(name, d, result.landed, result.pos);
    else if (result.kind === "snake") text = TEXT.snake(name, d, result.landed, result.pos);
    else text = TEXT.moved(name, d, result.pos);

    setPositions((p) => p.map((v, i) => (i === turn ? result.pos : v)));
    setDice(d);
    setMessage(text);
    if (result.pos === 100) setWinner(turn);
    else setTurn((turn + 1) % 2);
  };

  const reset = () => {
    setPositions([0, 0]);
    setTurn(0);
    setDice(null);
    setMessage("");
    setWinner(null);
  };

  return (
    <main className="app">
      <h1>{TEXT.title}</h1>
      <p className="rule">{TEXT.rule}</p>

      <div className="players">
        {PLAYERS.map((name, i) => (
          <div key={name} className={`player p${i}${winner === null && turn === i ? " active" : ""}`}>
            <span className="dot" aria-hidden="true" />
            <strong>{name}</strong>
            <span>{positions[i] === 0 ? TEXT.start : positions[i]}</span>
          </div>
        ))}
      </div>

      <div className="board" role="grid" aria-label="Snakes and ladders board">
        {ROWS.flat().map((n) => (
          <div key={n} className={`sq${LADDERS[n] ? " ladder" : ""}${SNAKES[n] ? " snake" : ""}`}>
            <span className="num">{n}</span>
            {LADDERS[n] && <span className="jump">{`↑ ${LADDERS[n]}`}</span>}
            {SNAKES[n] && <span className="jump">{`↓ ${SNAKES[n]}`}</span>}
            <span className="tokens">
              {positions.map((p, i) => p === n && <span key={i} className={`token p${i}`} title={PLAYERS[i]} />)}
            </span>
          </div>
        ))}
      </div>

      <div className="panel">
        {winner !== null ? (
          <>
            <p className="winner" role="status">{TEXT.winner(PLAYERS[winner])}</p>
            <button type="button" className="btn" onClick={reset}>{TEXT.playAgain}</button>
          </>
        ) : (
          <>
            <p className="turn">{TEXT.turn(PLAYERS[turn])}</p>
            <button type="button" className="btn" onClick={roll}>{TEXT.roll}</button>
          </>
        )}
        {dice !== null && <p className="dice" aria-label={`Dice ${dice}`}>{dice}</p>}
        {message && <p className="message" role="status">{message}</p>}
      </div>
    </main>
  );
}
