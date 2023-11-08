import React from 'react'
import { ACTIONS } from './App.js'
export default function OperationButton  ({ dispatch, oper }) {
  return (
    <button onClick={() => {dispatch({type: ACTIONS.OPER, payload: { oper } })}}>{oper}</button>
  )
}

