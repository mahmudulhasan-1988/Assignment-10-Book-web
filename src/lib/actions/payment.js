"use server";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
console.log(SERVER_URL);

export const subscription = async (data) => {
  console.log(data);

  await fetch(`${SERVER_URL}/subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
return;
  
};
