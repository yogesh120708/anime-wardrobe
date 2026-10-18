import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import hero from "@/assets/hero.jpg";
import hoodieRonin from "@/assets/hoodie-ronin.jpg";
import teeShinobi from "@/assets/tee-shinobi.jpg";
import jacketTitan from "@/assets/jacket-titan.jpg";
import jacketHaori from "@/assets/jacket-haori.jpg";
import teeSpirit from "@/assets/tee-spirit.jpg";
import hoodieCursed from "@/assets/hoodie-cursed.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Otaku Threads — Anime Streetwear Store" },
      { name: "description", content: "Shop anime hoodies, tees and jackets. Manage inventory in one place." },
      { property: "og:title", content: "Otaku Threads — Anime Streetwear Store" },
      { property: "og:description", content: "Shop anime hoodies, tees and jackets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Product = { id: string; name: string; series: string; category: string; price: number; stock: number; image?: string };

const SEED: Product[] = [
  { id: "1", name: "Crimson Ronin Hoodie", series: "Original", category: "Hoodie", price: 59, stock: 24, image: hoodieRonin },
  { id: "2", name: "Shinobi Leaf Tee", series: "Ninja Saga", category: "T-Shirt", price: 29, stock: 40, image: teeShinobi },
  { id: "3", name: "Titan Wall Bomber", series: "Titan Arc", category: "Jacket", price: 89, stock: 6, image: jacketTitan },
  { id: "4", name: "Demon Slash Haori", series: "Blade Night", category: "Jacket", price: 75, stock: 0, image: jacketHaori },
  { id: "5", name: "Spirit Bath Oversized Tee", series: "Ghibli Mood", category: "T-Shirt", price: 32, stock: 18, image: teeSpirit },
  { id: "6", name: "Cursed Energy Hoodie", series: "Jujutsu Days", category: "Hoodie", price: 64, stock: 3, image: hoodieCursed },
];
const KEY = "otaku-inventory";
const empty = { name: "", series: "", category: "T-Shirt", price: 0, stock: 0 };
const input = "w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Index() {
  const [items, setItems] = useState<Product[]>(SEED);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState<Omit<Product, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s: Product[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (s.length) setItems(s.map((i) => {
      const img = i.image ?? SEED.find((p) => p.id === i.id)?.image;
      return img ? { ...i, image: img } : i;
    }));
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, loaded]);

  const cats = ["All", ...new Set(items.map((i) => i.category))];
  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = useMemo(() => Object.entries(cart).reduce((s, [id, q]) => s + (items.find((i) => i.id === id)?.price ?? 0) * q, 0), [cart, items]);

  const add = (p: Product) => {
    if ((cart[p.id] ?? 0) >= p.stock) return;
    setCart({ ...cart, [p.id]: (cart[p.id] ?? 0) + 1 });
  };
  const checkout = () => {
    setItems(items.map((i) => ({ ...i, stock: i.stock - (cart[i.id] ?? 0) })));
    setCart({});
    setCartOpen(false);
    alert("Order placed! Stock updated.");
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    if (editId) setItems(items.map((i) => (i.id === editId ? { ...form, id: editId } : i)));
    else setItems([...items, { ...form, id: crypto.randomUUID() }]);
    setForm(empty); setEditId(null);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-display text-3xl text-primary">オタク THREADS</span>
          <nav className="flex items-center gap-6 text-sm font-medium uppercase">
            <a href="#shop" className="hover:text-primary">Shop</a>
            <a href="#inventory" className="hover:text-primary">Inventory</a>
            <button onClick={() => setCartOpen(true)} className="rounded-sm bg-primary px-3 py-1.5 text-primary-foreground glow">Cart ({cartCount})</button>
          </nav>
        </div>
      </header>

      <section className="relative h-[80vh] overflow-hidden">
        <img src={hero} alt="Anime streetwear hoodie" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">New drop · Vol. 07</p>
          <h1 className="mt-2 max-w-xl text-7xl leading-none md:text-9xl">Wear your <span className="text-primary">arc.</span></h1>
          <p className="mt-4 max-w-md text-muted-foreground">Limited anime streetwear. Heavyweight cotton, screen-printed in small batches.</p>
          <a href="#shop" className="mt-8 w-fit rounded-sm bg-primary px-8 py-3 font-bold uppercase text-primary-foreground glow">Shop the drop</a>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-6xl">The Collection</h2>
          <div className="flex gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`rounded-sm border px-3 py-1 text-sm uppercase ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, idx) => (
            <article key={p.id} className="group overflow-hidden rounded-sm border border-border bg-card transition hover:border-primary">
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-background">
                {p.image ? (
                  <img src={p.image} alt={p.name} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                  <span className="font-display text-[9rem] text-primary/20 transition group-hover:scale-110 group-hover:text-primary/40">{String(idx + 1).padStart(2, "0")}</span>
                )}
                <span className="absolute left-3 top-3 rounded-sm bg-accent px-2 py-0.5 text-xs font-bold uppercase text-accent-foreground">{p.category}</span>
                {p.stock === 0 && <span className="absolute right-3 top-3 rounded-sm bg-destructive px-2 py-0.5 text-xs font-bold uppercase text-destructive-foreground">Sold out</span>}
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.series}</p>
                <h3 className="text-2xl">{p.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold">${p.price}</span>
                  <button disabled={p.stock === 0} onClick={() => add(p)} className="rounded-sm bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground disabled:opacity-40">Add</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="inventory" className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-6xl">Inventory Panel</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[["Products", items.length], ["Units in stock", items.reduce((s, i) => s + i.stock, 0)], ["Low / out of stock", items.filter((i) => i.stock < 5).length]].map(([l, v]) => (
              <div key={l} className="rounded-sm border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display text-5xl text-primary">{v}</p></div>
            ))}
          </div>

          <form onSubmit={save} className="mt-8 grid gap-3 rounded-sm border border-border bg-card p-4 md:grid-cols-6">
            <input className={`${input} md:col-span-2`} placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={input} placeholder="Anime series" value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} />
            <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["T-Shirt", "Hoodie", "Jacket", "Pants", "Accessory"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="number" min={0} className={input} placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
            <input type="number" min={0} className={input} placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} />
            <button className="rounded-sm bg-primary px-4 py-2 font-bold uppercase text-primary-foreground md:col-span-6">{editId ? "Update product" : "Add product"}</button>
          </form>

          <div className="mt-6 overflow-x-auto rounded-sm border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left uppercase text-muted-foreground">
                <tr><th className="p-3">Product</th><th className="p-3">Series</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {p.image ? <img src={p.image} alt={p.name} width={40} height={40} loading="lazy" className="h-10 w-10 rounded-sm object-cover" /> : <span className="h-10 w-10 rounded-sm bg-secondary" />}
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{p.series}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">${p.price}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setItems(items.map((i) => i.id === p.id ? { ...i, stock: Math.max(0, i.stock - 1) } : i))} className="h-6 w-6 rounded-sm border border-border">−</button>
                        <span className={p.stock === 0 ? "text-destructive" : p.stock < 5 ? "text-accent" : ""}>{p.stock}</span>
                        <button onClick={() => setItems(items.map((i) => i.id === p.id ? { ...i, stock: i.stock + 1 } : i))} className="h-6 w-6 rounded-sm border border-border">+</button>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => { setEditId(p.id); const { id: _, ...rest } = p; setForm(rest); }} className="mr-3 text-accent hover:underline">Edit</button>
                      <button onClick={() => setItems(items.filter((i) => i.id !== p.id))} className="text-destructive hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">© 2026 Otaku Threads</footer>

      {cartOpen && (
        <div className="fixed inset-0 z-30 flex justify-end bg-background/70" onClick={() => setCartOpen(false)}>
          <aside className="flex h-full w-full max-w-sm flex-col border-l border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-4xl">Your Cart</h2>
            <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
              {cartCount === 0 && <p className="text-muted-foreground">Cart is empty.</p>}
              {Object.entries(cart).map(([id, q]) => {
                const p = items.find((i) => i.id === id);
                if (!p) return null;
                return (
                  <div key={id} className="flex items-center justify-between border-b border-border pb-2">
                    <div><p className="font-medium">{p.name}</p><p className="text-sm text-muted-foreground">{q} × ${p.price}</p></div>
                    <button onClick={() => { const c = { ...cart }; delete c[id]; setCart(c); }} className="text-sm text-destructive">Remove</button>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 flex justify-between text-lg font-bold"><span>Total</span><span>${total}</span></p>
            <button disabled={cartCount === 0} onClick={checkout} className="mt-4 rounded-sm bg-primary py-3 font-bold uppercase text-primary-foreground glow disabled:opacity-40">Checkout</button>
          </aside>
        </div>
      )}
    </div>
  );
}
