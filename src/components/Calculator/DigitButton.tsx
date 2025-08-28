// DigitButton.tsx
import { ACTIONS } from "./Calculator";

type DigitButtonProps = {
  dispatch: React.Dispatch<{ type: string; payload?: any }>;
  digit: string;
};

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
