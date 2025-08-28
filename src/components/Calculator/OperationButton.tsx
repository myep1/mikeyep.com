// OperationButton.tsx
import { ACTIONS } from "./Calculator";

type OperationButtonProps = {
  dispatch: React.Dispatch<{ type: string; payload?: any }>;
  operation: string;
};

export default function OperationButton({
  dispatch,
  operation,
}: OperationButtonProps) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
