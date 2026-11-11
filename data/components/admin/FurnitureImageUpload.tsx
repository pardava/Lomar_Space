"use client";

import { useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function FurnitureImageUpload({
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const upload = async (
    file: File
  ) => {
    setUploading(true);

    const form = new FormData();

    form.append("file", file);

    form.append(
      "upload_preset",
      process.env
        .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await res.json();

    onChange(data.secure_url);

    setUploading(false);
  };

  return (
    <div>
      <label className="mb-2 block font-medium">
        Furniture Image
      </label>

      <input
        hidden
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) upload(file);
        }}
      />

      <button
        type="button"
        onClick={() =>
          inputRef.current?.click()
        }
        className="rounded-xl border px-5 py-3"
      >
        {uploading
          ? "Uploading..."
          : "Upload Image"}
      </button>

      {value && (
        <img
          src={value}
          className="mt-5 h-52 rounded-xl object-cover"
          alt=""
        />
      )}
    </div>
  );
}