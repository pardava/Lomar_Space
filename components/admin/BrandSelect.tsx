"use client";

type Brand = {
  id: string;
  name: string;
};

type Props = {
  brands: Brand[];
  value: string;
  onChange: (value: string) => void;
};

export default function BrandSelect({
  brands,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="mb-2 block font-medium">
        Brand
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Choose brand</option>

        {brands.map((brand) => (
          <option
            key={brand.id}
            value={brand.id}
          >
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  );
}