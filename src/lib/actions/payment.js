"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const subscription = async (data) => {
  const res = await fetch(`${SERVER_URL}/subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result;
};
