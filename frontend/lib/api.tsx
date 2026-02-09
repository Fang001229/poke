export type Pokemon = {
  name: string;
  image: string | null;
  types: string[];
  height: number | null;
  weight: number | null;
};

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchPokemons(page: number, limit: number): Promise<Pokemon[]> {
  if (!BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

  const url = `${BASE}/api/pokemons?page=${page}&limit=${limit}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}
