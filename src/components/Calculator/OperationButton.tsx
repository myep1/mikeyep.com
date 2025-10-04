import { ACTIONS, type Action } from "./Calculator"

type Operation = "+" | "-" | "*" | "÷"

type OperationButtonProps = {
  operation: Operation
  dispatch: React.Dispatch<Action>
}

export default function OperationButton({ operation, dispatch }: OperationButtonProps) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}
    >
      {operation}
    </button>
  )
}
