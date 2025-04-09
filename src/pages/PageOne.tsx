import { useRef, useState } from "react";

const PageOne = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [delay, setDelay] = useState<number>(1000);
  const isCancelled = useRef(false); 

  async function processWithDelay(numbers: number[], delay: number): Promise<void> {
    setOutput([]);
    setError(null);
    isCancelled.current = false;

    if (!inputValue.includes(",")) {
      throw new Error("Invalid input: Must be in array format");
    }
    if (!numbers.every((num) => typeof num === "number" && !isNaN(num))) {
      throw new Error("Invalid input: All elements must be valid numbers.");
    }

    if (numbers.length === 0) {
      setOutput(["No numbers to process."]);
      return;
    }

    if (typeof delay !== "number" || isNaN(delay) || delay < 0) {
      throw new Error("Invalid delay: Must be a positive number.");
    }

    for (const num of numbers) {
      if (isCancelled.current) {
        setOutput((prev) => [...prev, "Process cancelled."]);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      setOutput((prev) => [...prev, `${num}`]);
    }
  }

  const handleStart = async () => {
    try {
      const parsedArray = inputValue
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => Number(s));

      await processWithDelay(parsedArray, delay);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    isCancelled.current = true;
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <label className="whitespace-nowrap text-sm font-medium w-56" htmlFor="number-input">
          Enter array:
        </label>
        <input
          id="number-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Example: 1, 2, 3"
          className="flex-1 border px-3 py-2 rounded"
        />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label className="whitespace-nowrap text-sm font-medium w-56" htmlFor="delay-input">
          Delay time (in ms):
        </label>
        <input
          id="delay-input"
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          placeholder="Delay in ms"
          className="flex-1 border px-3 py-2 rounded"
          min={0}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start Process
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>

      {error && (
        <p className="mt-4 text-red-600 font-semibold">Error: {error}</p>
      )}

      <p className="font-semibold mt-4">Processing Output:</p>
      {output.length > 0 && (
        <ul className="mt-2 text-green-600 font-mono">
          {output.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PageOne;
