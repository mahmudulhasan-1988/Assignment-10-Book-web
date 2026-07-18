export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error("Image upload failed");
    }

    return result.data.url;
  } catch (error) {
    console.error("Image Upload Error:", error);
    return null;
  }
};