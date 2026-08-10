"use client";

import { useState } from "react";
import { DollarSign, Palette, Lightbulb, Sofa } from "lucide-react";

const colors = ["#ffffff", "#f5f5dc", "#d6c7ae", "#b08968", "#6d6875", "#2d2d2d"];

interface BudgetPanelProps {
  onGenerate?: (settings: {
    budget: number;
    color: string;
    lighting: string;
  }) => void;
  estimatedItemCount?: number;
}

export default function BudgetPanel({
  onGenerate,
  estimatedItemCount,
}: BudgetPanelProps) {
  const [budget, setBudget] = useState(3500);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [lighting, setLighting] = useState("Natural Light");

  return (
    <aside className="rounded-3xl border border-[#33475A]/8 bg-white p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7EA6D8]/10 text-[#7EA6D8]">
          <DollarSign size={18} />
        </div>
        <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-[#33475A]">
          AI settings
        </h2>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#5B7186]">Budget</span>
          <span className="font-[family-name:var(--font-fraunces)] text-2xl text-[#33475A]">
            €{budget.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min={500}
          max={12000}
          step={100}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="mt-4 w-full accent-[#7EA6D8]"
        />
        <div className="mt-1 flex justify-between text-xs text-[#8598A8]">
          <span>€500</span>
          <span>€12,000</span>
        </div>
      </div>

      <div className="mt-9">
        <div className="mb-3 flex items-center gap-2">
          <Palette size={16} className="text-[#5B7186]" />
          <h3 className="text-sm font-semibold text-[#33475A]">
            Color palette
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`h-10 w-10 rounded-full border-2 transition ${
                selectedColor === color
                  ? "border-[#7EA6D8] scale-110"
                  : "border-white shadow-sm"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-9">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb size={16} className="text-[#5B7186]" />
          <h3 className="text-sm font-semibold text-[#33475A]">Lighting</h3>
        </div>

        <select
          value={lighting}
          onChange={(e) => setLighting(e.target.value)}
          className="h-11 w-full rounded-xl border border-[#33475A]/12 bg-white px-4 text-sm text-[#33475A] outline-none focus:border-[#7EA6D8]"
        >
          <option>Natural Light</option>
          <option>Warm Light</option>
          <option>Cold Light</option>
          <option>Luxury Ambient</option>
        </select>
      </div>

      {typeof estimatedItemCount === "number" && (
        <div className="mt-9 rounded-2xl bg-[#F0F4F8] p-5">
          <div className="flex items-center gap-2">
            <Sofa size={16} className="text-[#5B7186]" />
            <h3 className="text-sm font-semibold text-[#33475A]">
              Furniture estimate
            </h3>
          </div>
          <p className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl text-[#33475A]">
            {estimatedItemCount}
          </p>
          <p className="mt-1 text-sm text-[#8598A8]">recommended items</p>
        </div>
      )}

      <button
        onClick={() => onGenerate?.({ budget, color: selectedColor, lighting })}
        className="mt-9 w-full rounded-full bg-[#33475A] py-3.5 text-sm font-semibold text-white transition hover:bg-[#7EA6D8]"
      >
        Generate AI design
      </button>
    </aside>
  );
}
