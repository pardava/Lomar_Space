"use client";

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
};

export default function CategorySelect({
  categories,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="mb-2 block font-medium">
        Category
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Choose category</option>

        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}