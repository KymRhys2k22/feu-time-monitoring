import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const Quotes = () => {
  const [quoteData, setQuoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchQuote = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await fetch("https://quotes-api-self.vercel.app/quote");
      if (!response.ok) throw new Error("Failed to fetch quote");
      const data = await response.json();
      setQuoteData(data);
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (error) return null; // Gracefully fallback to nothing if error

  return (
    <div className="w-full max-w-sm mx-auto mb-4 px-4 text-center">
      {isLoading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="h-3 w-3 animate-spin text-slate-300 dark:text-slate-600" />
        </div>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in duration-700">
          <p className="text-xs italic text-slate-400 dark:text-slate-500 font-serif leading-relaxed">
            "{quoteData?.quote}"
          </p>
          <span className="text-[10px] font-medium text-slate-300 dark:text-slate-600 mt-1 uppercase tracking-wider">
            — {quoteData?.author}
          </span>
        </div>
      )}
    </div>
  );
};

export default Quotes;
