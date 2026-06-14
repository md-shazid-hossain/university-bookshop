import { useEffect, useState } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");

  const buttons = [
    "C", "⌫", "(", ")", "/",
    "7", "8", "9", "*", "sin",
    "4", "5", "6", "-", "cos",
    "1", "2", "3", "+", "tan",
    "0", ".", "^", "π", "=",
    "√", "e",
  ];

  const formatValue = (val: string) => {
    switch (val) {
      case "π":
        return "Math.PI";
      case "e":
        return "Math.E";
      case "√":
        return "Math.sqrt";
      case "sin":
        return "Math.sin";
      case "cos":
        return "Math.cos";
      case "tan":
        return "Math.tan";
      case "^":
        return "**";
      default:
        return val;
    }
  };

  const safeCalculate = (expr: string) => {
    try {
      // safer than eval
      // still not perfect for production, but much cleaner
      const result = Function(`"use strict"; return (${expr})`)();
      return result;
    } catch {
      return "Error";
    }
  };

  const handleClick = (value: string) => {
    if (value === "C") return setInput("");
    if (value === "⌫") return setInput((prev) => prev.slice(0, -1));
    if (value === "=") {
      const result = safeCalculate(input);
      return setInput(String(result));
    }

    setInput((prev) => prev + formatValue(value));
  };

  /* ⌨️ Keyboard Support */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      if (!isNaN(Number(key)) || "+-*/().".includes(key)) {
        setInput((prev) => prev + key);
      }

      if (key === "Enter") {
        e.preventDefault();
        setInput((prev) => String(safeCalculate(prev)));
      }

      if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }

      if (key.toLowerCase() === "c") {
        setInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="w-96 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-5">

        {/* Display */}
        <div className="bg-black/40 text-white p-4 rounded-2xl mb-4 text-right text-2xl min-h-[60px] font-mono overflow-x-auto">
          {input || "0"}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`
                p-3 rounded-xl text-sm font-semibold transition
                ${btn === "=" ? "bg-green-500 text-white col-span-1" : "bg-white/20 text-white hover:bg-white/30"}
                ${btn === "C" ? "bg-red-500 text-white" : ""}
                ${btn === "⌫" ? "bg-yellow-500 text-black" : ""}
              `}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-xs text-white/60 mt-3 text-center">
          Keyboard supported: Enter, Backspace, numbers, + - * /
        </p>
      </div>
    </div>
  );
}