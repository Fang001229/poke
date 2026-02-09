"use client";

import { useEffect, useMemo, useState } from "react";

type Pokemon = {
  name: string;
  image: string | null;
  types: string[];
  height: number | null;
  weight: number | null;
};

const API_BASE = "http://127.0.0.1:8000"; 
const LIMIT = 30;

export default function Home() {
  const [items, setItems] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function loadPage(p: number) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/pokemons?page=${p}&limit=${LIMIT}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      const next: Pokemon[] = Array.isArray(data) ? data : (data.results ?? []);

      setItems((prev) => (p === 1 ? next : [...prev, ...next]));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage(1);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <main style={styles.page}>
      {/* Top section */}
      <section style={styles.topGrid}>
        <CarouselPlaceholder />
        <div style={styles.rightBanners}>
          <BannerPlaceholder label="Banner" />
          <BannerPlaceholder label="Banner" />
        </div>
      </section>

      {/* Middle section */}
      <section style={styles.middleGrid}>
        <SideImagePlaceholder label="Left Image" />

        <div style={styles.centerCol}>
          <div style={styles.searchRow}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Pokémon by name..."
              style={styles.searchInput}
            />
            <button type="button" style={styles.searchBtn}>
              Search
            </button>
          </div>

          <div style={styles.scrollArea}>
            {error && <div style={styles.errorBox}>{error}</div>}

            {/* ✅ 3 columns */}
            <div style={styles.gridList}>
              {filtered.map((p) => (
                <PokemonCard key={`${p.name}-${p.image ?? ""}`} p={p} />
              ))}
            </div>

            <button
              onClick={() => {
                const next = page + 1;
                setPage(next);
                loadPage(next);
              }}
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        </div>

        <SideImagePlaceholder label="Right Image" />
      </section>
    </main>
  );
}

function PokemonCard({ p }: { p: Pokemon }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardImageBox}>
        {p.image ? (
          <img src={p.image} alt={p.name} style={styles.cardImage} />
        ) : (
          <span style={styles.noImg}>no img</span>
        )}
      </div>

      <div>
        <div style={styles.cardTitle}>{cap(p.name)}</div>
        <div style={styles.badges}>
          {p.types.map((t) => (
            <span key={t} style={styles.badge}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BannerPlaceholder({ label }: { label: string }) {
  return <div style={styles.banner}>{label}</div>;
}

function SideImagePlaceholder({ label }: { label: string }) {
  return <div style={styles.sideImage}>{label}</div>;
}

function CarouselPlaceholder() {
    const slides = [
    "/banners/banner1.png",
    "/banners/banner2.png",
    "/banners/banner3.webp",
  ];


  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={styles.carousel}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slides[i]}
        alt={`Slide ${i + 1}`}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
      />
    </div>
  );
}

function cap(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    background: "#fff",
    color: "#000",
  },

  topGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
  },
  rightBanners: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  carousel: {
    height: 260,
    borderRadius: 12,
    border: "1px solid #eee",
    overflow: "hidden",
    background: "#fafafa",
  },
  banner: {
    height: 120,
    borderRadius: 12,
    border: "1px solid #eee",
    background: "#fafafa",
    display: "grid",
    placeItems: "center",
    fontWeight: 600,
  },

  middleGrid: {
    display: "grid",
    gridTemplateColumns: "240px 1fr 240px",
    gap: 16,
    alignItems: "start",
  },

  sideImage: {
    height: 520,
    borderRadius: 12,
    border: "1px solid #eee",
    background: "#fafafa",
    display: "grid",
    placeItems: "center",
    fontWeight: 600,
    position: "sticky",
    top: 16,
  },

  centerCol: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  searchRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  },
  searchBtn: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #e5a100",
    background: "#ffb300",
    fontWeight: 800,
    cursor: "pointer",
  },

  scrollArea: {
    height: 520,
    overflowY: "auto",
    borderRadius: 12,
    border: "1px solid #eee",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#fff",
  },

  errorBox: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #f99",
    background: "#fff5f5",
  },

  gridList: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },

  card: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardImageBox: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    background: "#f6f6f6",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  noImg: {
    fontSize: 12,
    color: "#999",
  },
  cardTitle: {
    fontWeight: 800,
  },
  badges: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 6,
  },
  badge: {
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #ddd",
    textTransform: "capitalize",
  },

  button: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};
