"use client";

import { useState } from "react";

interface BudgetPanelProps {
  estimatedItemCount?: number;
  onGenerate: (data: { budget: number }) => void;
}

export default function BudgetPanel({
  estimatedItemCount,
  onGenerate,
}: BudgetPanelProps) {
  const [budget, setBudget] = useState(3500);

  function handleBudgetChange(value: number) {
    setBudget(value);
    onGenerate({ budget: value });
  }

  const formattedBudget = String(budget).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  return (
    <aside className="rounded-3xl border border-[#33475A]/8 bg-white p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7EA6D8]">
          Your budget
        </p>

        <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl text-[#33475A]">
          Design within your budget
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#8598A8]">
          Choose how much you would like to spend on furniture for your room.
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5B7186]">Budget</span>

          <span className="font-[family-name:var(--font-fraunces)] text-2xl text-[#33475A]">
            €{formattedBudget}
          </span>
        </div>

        <input
          type="range"
          min={500}
          max={10000}
          step={100}
          value={budget}
          onChange={(event) =>
            handleBudgetChange(Number(event.target.value))
          }
          className="mt-5 w-full accent-[#7EA6D8]"
        />

        <div className="mt-2 flex justify-between text-xs text-[#8598A8]">
          <span>€500</span>
          <span>€10,000</span>
        </div>
      </div>

      {estimatedItemCount !== undefined && estimatedItemCount > 0 && (
        <div className="mt-6 rounded-2xl bg-[#F0F4F8] p-4">
          <p className="text-sm font-medium text-[#33475A]">
            {estimatedItemCount} furniture pieces found
          </p>

          <p className="mt-1 text-xs text-[#8598A8]">
            Matching your selected style and budget.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => onGenerate({ budget })}
        className="mt-6 w-full rounded-full bg-[#33475A] py-3.5 text-sm font-semibold text-white transition hover:bg-[#7EA6D8]"
      >
        Update furniture
      </button>
    </aside>
  );
}