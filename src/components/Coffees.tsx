import { useContractEvent, useContractRead } from "wagmi"
import abi from '../contracts/abi.json'
import { useState } from "react"

export const Coffees = () => {
const { data, isError, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
    abi,
    functionName: 'coffeeCount',
  })
const [coffeeCount, setCoffeCount] = useState(data ? (data as BigInt).toString() : '0')
useContractEvent({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
    abi,
    eventName: 'CoffeePurchased',
    listener() {
      // Convert the previous state to a number, increment, and set the new state
      setCoffeCount(prev => {
        const previousCount = BigInt(prev); // This assumes that `prev` is a string that represents a BigInt
        const newCount = previousCount + 1n; // Increment using BigInt arithmetic
        return newCount.toString(); // Convert back to a string to update the state
      });
    },
});

  if (isError) return <p>Something went wrong fetching Coffee count</p>
  return (
    <div>
      <p>Coffees donated: {coffeeCount}</p>
    </div>
  )
}
