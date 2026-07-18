"use client";

import { useRef, useState } from "react";
import { Button, Card, Description, FieldError, Input, Label, TextArea, TextField } from "@heroui/react";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { BOOK_STATUS, CATEGORIES } from "@/lib/librarian-data";

const emptyForm = {
  title: "",
  author: "",
  description: "",
  deliveryFee: "",
  category: CATEGORIES[0],
};

export default function AddBookForm({ onAddBook }) {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!form.title || !form.author || !form.deliveryFee) {
      setError("Title, author, and delivery fee are required.");
      return;
    }

    let imageUrl = "";

    try {
      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      // Status is strictly forced to "Pending Approval" on submit.
      // The librarian has no way to override this from the UI.
      onAddBook({
        id: `bk-${Date.now()}`,
        title: form.title,
        author: form.author,
        description: form.description,
        deliveryFee: parseFloat(form.deliveryFee),
        category: form.category,
        imageUrl,
        status: BOOK_STATUS.PENDING,
        requests: 0,
      });

      setForm(emptyForm);
      setImageFile(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccessMsg("Book submitted for approval. It won't appear on Browse until an admin approves it.");
    } catch (err) {
      setError(err.message || "Something went wrong while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField className="flex flex-col gap-1.5 md:col-span-1" isRequired>
          <Label className="text-xs text-[var(--rr-ink-dim)]">Title</Label>
          <Input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="The Midnight Library"
            className="rounded-md border px-3 py-2 text-sm"
          />
        </TextField>

        <TextField className="flex flex-col gap-1.5 md:col-span-1" isRequired>
          <Label className="text-xs text-[var(--rr-ink-dim)]">Author</Label>
          <Input
            value={form.author}
            onChange={(e) => updateField("author", e.target.value)}
            placeholder="Matt Haig"
            className="rounded-md border px-3 py-2 text-sm"
          />
        </TextField>

        <TextField className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="text-xs text-[var(--rr-ink-dim)]">Description</Label>
          <TextArea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="A short blurb about the book..."
            rows={3}
            className="rounded-md border px-3 py-2 text-sm"
          />
        </TextField>

        <TextField className="flex flex-col gap-1.5 md:col-span-1" isRequired>
          <Label className="text-xs text-[var(--rr-ink-dim)]">Delivery Fee (USD)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.deliveryFee}
            onChange={(e) => updateField("deliveryFee", e.target.value)}
            placeholder="3.50"
            className="rounded-md border px-3 py-2 text-sm"
          />
        </TextField>

        <div className="flex flex-col gap-1.5 md:col-span-1">
          <label className="text-xs text-[var(--rr-ink-dim)]" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="rr-select rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--rr-gold)]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs text-[var(--rr-ink-dim)]" htmlFor="cover-image">
            Cover Image
          </label>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Cover preview"
                className="h-24 w-16 rounded-sm object-cover shadow-md"
              />
            ) : (
              <div className="flex h-24 w-16 items-center justify-center rounded-sm border border-dashed border-[var(--rr-hairline)] text-[10px] text-[var(--rr-ink-dim)]">
                No image
              </div>
            )}
            <input
              id="cover-image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs text-[var(--rr-ink-dim)] file:mr-3 file:rounded-md file:border file:border-[var(--rr-hairline)] file:bg-[var(--rr-surface-2)] file:px-3 file:py-1.5 file:text-[var(--rr-ink)]"
            />
          </div>
          <Description className="text-[11px] text-[var(--rr-ink-dim)]">
            Uploaded to imgBB. Only the hosted URL is stored with the book.
          </Description>
        </div>

        {error && (
          <div className="rounded-md border border-[var(--rr-wine)] bg-[var(--rr-wine)]/10 px-3 py-2 text-xs text-[var(--rr-wine-bright)] md:col-span-2">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="rounded-md border border-[var(--rr-sage)] bg-[var(--rr-sage)]/10 px-3 py-2 text-xs text-[#a9caa5] md:col-span-2">
            {successMsg}
          </div>
        )}

        <div className="md:col-span-2">
          <Button type="submit" variant="primary" isPending={isUploading}>
            {isUploading ? "Uploading..." : "Submit for Approval"}
          </Button>
          <p className="mt-2 text-[11px] text-[var(--rr-ink-dim)]">
            New books are always submitted with status{" "}
            <span className="font-mono-label text-[var(--rr-gold-bright)]">Pending Approval</span> and
            stay hidden from the public Browse page until an admin approves them.
          </p>
        </div>
      </form>
    </Card>
  );
}
