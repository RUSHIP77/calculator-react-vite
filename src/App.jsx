import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./styles.css"


//Actions to be performed.
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE: "delete-digit",
  EQUALS: "equals",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:

    //Overwriting the current number present in the screen, with the new number input
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      //Dont allow more than one zeros in the start
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      //more than one decimal points are not allowed
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.OPERATION:

    //You cannot use operator without entering a number
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

    // Overwriting the operation Eg :24* then you hit +, It will be 24+
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
    //Current operand becomes previous, and now we can start inputing numbers again.
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
     //performs the calculation and then make the result as previous operand
      return {
        ...state,
        previousOperand: equals(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE:

    //If in overwrite state,clear out everything
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      //when the last digit is null, then reset value to null, instead of leaving an empty string.
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
    //removing last digit from the current operand.
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EQUALS:

    //DO nothing, remain as it is, if any of these information is missing.
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: equals(state),
      }
  }
}

function equals({ currentOperand, previousOperand, operation }) {
  //Converting strings into a number.
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  //if anyofthese doesnt exist, so no calculations to do, return empty string.
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString()
}
//Formating numbers according to US format and making sure that doesn't apply after decimal digits.
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>





      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>  AC  </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>                DEL</button>
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
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EQUALS })}> = </button>
</div>
  )
}

export default App