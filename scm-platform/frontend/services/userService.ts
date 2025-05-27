import { CreateUserDto } from "../src/types/User";

const API_URL = "http://localhost:3001/api/users";

export const createUser = async (user: CreateUserDto) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create user");
  }

  return res.json();
};
