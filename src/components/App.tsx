'use client'

import { Coffees } from "./Coffees"
import { Connected } from "./Connected"
import { Tip } from "./Tip"
import { GiCoffeeBeans } from 'react-icons/gi'

export const App = () => {
  return (
   <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
   }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <GiCoffeeBeans />
        CryptoCoffee
      </h1>
      <p style={{ marginBottom: 8, fontSize: '1.25rem' }}>Give back with a crypto brew!</p>
      <Connected>
        <Coffees />
        <Tip />
      </Connected>
   </div>
  )
}
