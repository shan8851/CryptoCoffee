import { ChangeEvent, useEffect, useState } from "react";
import abi from '../contracts/abi.json'
import { useContractEvent, useContractWrite } from "wagmi";
import { parseEther } from "viem";
import { FiCoffee } from 'react-icons/fi'
import Confetti from 'react-dom-confetti';

const config = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 4000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: [
  '#A67C52',
  '#D9A875',
  '#B28451',
  '#593D2B',
  '#F0E2DE',
  '#E6D2C5',
  '#7C3A1D',
  '#3F250B',
  '#6F4E37',
  '#FFFFFF',
]
};

export const Tip = () => {
  const [dollarAmount, setDollarAmount] = useState('');
  const [ethPrice, setEthPrice] = useState<string | null>(null);
  const [ethAmount, setEthAmount] = useState('');
  const [success, setSuccess] = useState(false)
  useContractEvent({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
    abi,
    eventName: 'CoffeePurchased',
    listener() {
      setSuccess(true);
    },
  })

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
    abi,
    functionName: 'buyCoffee',
    onSuccess() {
      setEthPrice(null);
      setDollarAmount('');
    }
  })

  const fetchEthPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      setEthPrice(null);
    }
  };

  // Convert dollar amount to ETH when the dollar amount or ETH price changes
  useEffect(() => {
    if (ethPrice && dollarAmount) {
      const amountInEth = parseFloat(dollarAmount) / parseFloat(ethPrice);
      setEthAmount(amountInEth.toFixed(6));
    }
  }, [dollarAmount, ethPrice]);

  useEffect(() => {
    fetchEthPrice();
  }, []);

  const handleDollarAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    if (!isNaN(Number(amount))) {
      setDollarAmount(amount);
    }
  };

  const etherscanLink = `https://sepolia.etherscan.io/tx/${data?.hash}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            style={{ background: 'transparent', margin: '16px 0', width: 150 }}
            value={dollarAmount}
            onChange={handleDollarAmountChange}
            placeholder="Enter USD"
            disabled={isLoading}
          />
           <button
            style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', margin: 16 }}
            disabled={!ethPrice || !dollarAmount || !write}
            onClick={() => {
              if (!ethPrice) return;
              write({ value: parseEther(ethAmount as `${number}`)})
            }}
          >
            <FiCoffee  />
            BUY
          </button>
        </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 32 }}>
        {dollarAmount && (
          <p style={{ color: '#6D4C3C', fontWeight: 700 }}>$ in ETH: {ethAmount}</p>
        )}
      </div>
      {isLoading && <div>Please confirm your donation in MetaMask</div>}
      {isSuccess && (
        <p style={{ maxWidth: 500, textAlign: 'center'}}>Thanks for the brew! Your transaction is pending, you can chck ot on on <a href={etherscanLink} target="_blank" rel="noreferrer">etherscan</a>. Alternatively stay on the page to get confirmation when it completes</p>
      )}
      <Confetti active={success} config={config}/>
    </div>
  );
};
