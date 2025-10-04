// src/components/Calculator/Calculator.tsx
import { useReducer } from "react"
import "./Calculator.css"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
} as const

export type Action =
  | { type: typeof ACTIONS.ADD_DIGIT; payload: { digit: string } }
  | { type: typeof ACTIONS.CHOOSE_OPERATION; payload: { operation: Operation } }
  | { type: typeof ACTIONS.CLEAR }
  | { type: typeof ACTIONS.DELETE_DIGIT }
  | { type: typeof ACTIONS.EVALUATE }


type Operation = "+" | "-" | "*" | "÷"

type State = {
  currentOperand: string | null
  previousOperand: string | null
  operation: Operation | null
  overwrite: boolean
}

const initialState: State = {
  currentOperand: null,
  previousOperand: null,
  operation: null,
  overwrite: false,
}


function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT: {
      const { digit } = action.payload;
      if (state.overwrite) return { ...state, currentOperand: digit, overwrite: false };
      if (digit === "0" && state.currentOperand === "0") return state;
      if (digit === "." && state.currentOperand?.includes(".")) return state;
      return { ...state, currentOperand: `${state.currentOperand ?? ""}${digit}` };
    }
    case ACTIONS.CHOOSE_OPERATION: {
      const { operation } = action.payload;
      if (state.currentOperand == null && state.previousOperand == null) return state;
      if (state.currentOperand == null) return { ...state, operation };
      if (state.previousOperand == null)
        return { ...state, operation, previousOperand: state.currentOperand, currentOperand: null };
      return { ...state, previousOperand: evaluate(state), operation, currentOperand: null };
    }
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.EVALUATE: {
      if (!state.operation || !state.currentOperand || !state.previousOperand) return state;
      return { ...state, overwrite: true, previousOperand: null, operation: null, currentOperand: evaluate(state) };
    }
    case ACTIONS.DELETE_DIGIT: {
      if (state.overwrite) return { ...state, overwrite: false, currentOperand: null };
      if (!state.currentOperand) return state;
      if (state.currentOperand.length === 1) return { ...state, currentOperand: null };
      return { ...state, currentOperand: state.currentOperand.slice(0, -1) };
    }
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatOperand(operand: string | null | undefined): string | undefined {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(Number(integer));
  return `${INTEGER_FORMATTER.format(Number(integer))}.${decimal}`;
}

function evaluate({ currentOperand, previousOperand, operation }: State): string {
  const prev = parseFloat(previousOperand ?? "");
  const current = parseFloat(currentOperand ?? "");
  if (Number.isNaN(prev) || Number.isNaN(current)) return "";
  let computation: number;
  switch (operation) {
    case "+": computation = prev + current; break;
    case "-": computation = prev - current; break;
    case "*": computation = prev * current; break;
    case "÷": computation = prev / current; break;
    default: return "";
  }
  return computation.toString();
}

export default function Calculator() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, initialState);
  console.log("render calc", currentOperand, previousOperand, operation)
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>

      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}
