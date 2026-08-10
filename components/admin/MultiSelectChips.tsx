"use client";

interface MultiSelectChipsProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelectChips({
  label,
  options,
  value,
  onChange,
}: MultiSelectChipsProps) {
  function toggle(option: string) {
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option]
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-[#33475A]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${
                active
                  ? "border-[#7EA6D8] bg-[#7EA6D8] text-white"
                  : "border-[#33475A]/15 text-[#5B7186] hover:border-[#33475A]/30"
              }`}
            >
              {option.replace("_", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
