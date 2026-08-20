"use client";

import { FormEvent, useState } from "react";

import FurnitureImageUpload from "./FurnitureImageUpload";
import BrandSelect from "./BrandSelect";
import CategorySelect from "./CategorySelect";
import MultiSelectChips from "./MultiSelectChips";

import { useFurniture } from "@/hooks/useFurniture";
import { createFurniture } from "@/services/furniture.service";

const STYLE_OPTIONS = [
  "scandinavian",
  "minimalist",
  "modern",
  "boho",
  "luxury",
];

const ROOM_TYPE_OPTIONS = [
  "living_room",
  "bedroom",
  "kitchen",
  "dining_room",
  "office",
];

export default function FurnitureForm() {
  const { brands, categories, loading } = useFurniture();

  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState<string[]>([]);
  const [roomType, setRoomType] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");
  const [productUrl, setProductUrl] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (style.length === 0 || roomType.length === 0) {
      alert("Select at least one style and one room type — the AI matching relies on these.");
      return;
    }

    try {
      await createFurniture({
        name,
        description,
        price: Number(price),
        width_cm: Number(width),
        depth_cm: Number(depth),
        height_cm: Number(height),
        image_url: image,
        product_url: productUrl,
        brand_id: brand,
        category_id: category,
        style,
        room_type: roomType,
        glb_url: "",
      });

      alert("Furniture added successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setWidth("");
      setDepth("");
      setHeight("");
      setImage("");
      setBrand("");
      setCategory("");
      setStyle([]);
      setRoomType([]);
      setProductUrl("");
    } catch (error) {
      console.error(error);
      alert("Failed to save furniture.");
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FurnitureImageUpload
        value={image}
        onChange={setImage}
      />

      <input
        type="text"
        placeholder="Furniture Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <input
        type="url"
        placeholder="Product URL (link to the real retailer page)"
        value={productUrl}
        onChange={(e) => setProductUrl(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Width (cm)"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="w-full rounded-xl border p-3"
        />

        <input
          type="number"
          placeholder="Depth (cm)"
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
          className="w-full rounded-xl border p-3"
        />

        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <BrandSelect
        brands={brands}
        value={brand}
        onChange={setBrand}
      />

      <CategorySelect
        categories={categories}
        value={category}
        onChange={setCategory}
      />

      {/* New: style and room type — required for AI furniture matching
          in getMatchedFurniture(). Without these, this item will never
          show up in AI-generated recommendations. */}
      <MultiSelectChips
        label="Style (select all that fit)"
        options={STYLE_OPTIONS}
        value={style}
        onChange={setStyle}
      />

      <MultiSelectChips
        label="Room type (select all that fit)"
        options={ROOM_TYPE_OPTIONS}
        value={roomType}
        onChange={setRoomType}
      />

      <button
        type="submit"
        className="rounded-xl bg-[#3A2119] px-6 py-3 text-white transition hover:bg-[#3A2119]"
      >
        Save Furniture
      </button>
    </form>
  );
}
