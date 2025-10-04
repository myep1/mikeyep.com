// DigitButton.tsx

import { ACTIONS, type Action } from "./Calculator"

type DigitButtonProps = {
  digit: string
  dispatch: React.Dispatch<Action>
}

export default function DigitButton({ dispatch, digit }: DigitButtonProps) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })
      }
    >
      {digit}
    </button>
  );
}
