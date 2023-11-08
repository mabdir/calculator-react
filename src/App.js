import { useReducer } from 'react';
import './index.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import { type } from '@testing-library/user-event/dist/type';

export const ACTIONS = {
  ADD_DIGIT : 'add-digit',
  OPER: 'operation',
  DEL: 'delete-digit',
  CLEAR:'delete-all',
  EVALUATE:'eval'
}

function reducer (state, { type, payload }){
  switch (type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) { return {
        ...state,
        curroutput: payload.digit,
        overwrite: true,
      }
    }
      if (payload.digit === "0" && state.curroutput === "0") return state
      if (payload.digit === "." && state.curroutput.includes("."))
       return state
      return {
        ...state,
       curroutput: `${state.curroutput || ""}${payload.digit}`,
      }
      case ACTIONS.OPER:
        if(state.curroutput == null && state.prevoutput == null){
          return state
        }
        if(state.curroutput == null) {
          return {
            ...state,
            oper: payload.oper,
          }
        }
        if(state.prevoutput == null){
          return {
            ...state,
            oper: payload.oper,
            prevoutput: state.curroutput,
            curroutput: null,
          }
        }
        return {
          ...state,
          prevoutput: evaluate(state),
          oper: payload.oper,
          curroutput: null
        }
      
      case ACTIONS.DEL:
        if(state.overwrite) {
          return {
            ...state,
            overwrite: false,
            curroutput: null,
          }
        }
        if(state.curroutput == null) return state
        if(state.curroutput.length === 1){
          return {
            ...state,
            curroutput: null
          }
        }
        return {
          ...state,
          curroutput: state.curroutput.slice(0, -1)
        }
      case ACTIONS.CLEAR:
      return {}
      case ACTIONS.EVALUATE:
        if(state.curroutput == null || state.prevoutput == null || state.oper == null){
          return state
        }
        return {
          ...state,
          oper: null,
          overwrite: true,
          prevoutput: null,
          curroutput: evaluate(state)
        }
  } 
    
}

function evaluate({curroutput, prevoutput, oper}){
  let prev = parseFloat(prevoutput)
  let current = parseFloat(curroutput)
  
  if(isNaN(prev) || isNaN(current)) return ""

  let computation = ""
  switch(oper){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
      
    
  }
    return computation.toString() 
  }
  
 const INTEGAR_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
 })

 function formatOperand(operand){
  if(operand == null) return
  const [integar, decimal] = operand.split(".")
  if (decimal == null) return INTEGAR_FORMATTER.format(integar)
  return `${INTEGAR_FORMATTER.format(integar)}.${decimal}`
 }

export default function App(){
  const [{ curroutput, prevoutput, oper}, dispatch] = useReducer(reducer, 
    {})

  
  return (
    <div className="calculator-grid">
      <div className="output">
      <div className="prevoutput">{formatOperand(prevoutput)} {oper}</div>
      <div className="curroutput">{formatOperand(curroutput)}</div>
      </div>

      <button className="span-two" onClick={() => dispatch({type :ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DEL})}>DEL</button>

      <OperationButton oper="/" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton oper="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton oper="-" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton oper="+" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />

      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>

    </div>
    
  )
}

