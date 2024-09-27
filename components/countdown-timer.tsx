"use client";
import React from "react";

interface CountdownTimerProps {
  launchDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ launchDate }) => {
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const launch = new Date(launchDate).getTime();
      const difference = launch - now;

      if (difference < 0) {
        clearInterval(timer);
        setTimeLeft("Launched");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  return <span>{timeLeft}</span>;
};

export default CountdownTimer;
