"use client";

import { useMemo, useState } from "react";
import { formatMoney, storeCatalog, storeCategories, type StoreCategory, type StoreProduct } from "@/data/storeCatalog";

type View = "shop" | "product" | "cart" | "checkout" | "confirmed" | "account" | "admin";
type AdminTab = "products" | "orders" | "kpis";

type CartLine = { productId: string; variantId: string; quantity: number };
type OrderStatus = "Preparing" | "Fulfilled" | "Cancelled";
type Order = { id: string; item: string; total: number; status: OrderStatus };

const seedOrders: Order[] = [{ id: "KA-1042", item: "Meridian Coat · Size M", total: 240, status: "Fulfilled" }];

function findProduct(products: StoreProduct[], id: string) {
  return products.find((product) => product.id === id);
}

export function StoreDemo() {
  const [products, setProducts] = useState<StoreProduct[]>(() => storeCatalog.map((product) => ({ ...product, variants: [...product.variants] })));
  const [view, setView] = useState<View>("shop");
  const [adminTab, setAdminTab] = useState<AdminTab>("products");
  const [category, setCategory] = useState<StoreCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(storeCatalog[0].id);
  const [variantId, setVariantId] = useState(storeCatalog[0].variants[0].id);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [latestOrder, setLatestOrder] = useState<string | null>(null);
  const [profile, setProfile] = useState({ name: "Sample Customer", email: "customer@example.com", city: "Berlin" });
  const [checkout, setCheckout] = useState({ name: "Sample Customer", email: "customer@example.com", address: "22 Main Road" });
  const [checkoutError, setCheckoutError] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      if (!product.active && view !== "admin") return false;
      if (category !== "All" && product.category !== category) return false;
      if (!needle) return true;
      return `${product.name} ${product.category}`.toLowerCase().includes(needle);
    });
  }, [products, query, category, view]);

  const selected = findProduct(products, selectedId) ?? products[0];
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cart.reduce((sum, line) => {
    const product = findProduct(products, line.productId);
    return sum + (product?.price ?? 0) * line.quantity;
  }, 0);
  const activeOrders = orders.filter((order) => order.status !== "Cancelled");
  const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const average = activeOrders.length ? Math.round(revenue / activeOrders.length) : 0;

  function openProduct(product: StoreProduct) {
    setSelectedId(product.id);
    setVariantId(product.variants[0].id);
    setView("product");
  }

  function addToCart() {
    if (!selected.active || selected.stock < 1) return;
    setCart((current) => {
      const existing = current.find((line) => line.productId === selected.id && line.variantId === variantId);
      if (existing) {
        return current.map((line) =>
          line === existing ? { ...line, quantity: Math.min(line.quantity + 1, selected.stock) } : line,
        );
      }
      return [...current, { productId: selected.id, variantId, quantity: 1 }];
    });
    setView("cart");
  }

  function updateQuantity(index: number, quantity: number) {
    setCart((current) => current.flatMap((line, lineIndex) => (lineIndex === index ? (quantity < 1 ? [] : [{ ...line, quantity }]) : [line])));
  }

  function placeOrder() {
    if (!checkout.name.trim() || !checkout.email.includes("@") || !checkout.address.trim()) {
      setCheckoutError("Add a name, an email, and a shipping address. No payment details are required.");
      return;
    }
    if (cart.length === 0) return;
    const id = `KA-${1043 + orders.length - seedOrders.length}`;
    const item = cart
      .map((line) => {
        const product = findProduct(products, line.productId);
        const variant = product?.variants.find((entry) => entry.id === line.variantId);
        return `${product?.name ?? "Item"} · ${variant?.label ?? ""} × ${line.quantity}`;
      })
      .join(", ");
    setOrders((current) => [{ id, item, total: cartTotal, status: "Preparing" }, ...current]);
    setProducts((current) =>
      current.map((product) => {
        const used = cart.filter((line) => line.productId === product.id).reduce((sum, line) => sum + line.quantity, 0);
        return used ? { ...product, stock: Math.max(0, product.stock - used) } : product;
      }),
    );
    setLatestOrder(id);
    setCart([]);
    setCheckoutError("");
    setView("confirmed");
  }

  const nav = [
    ["shop", "Shop"],
    ["cart", `Cart (${cartCount})`],
    ["account", "Account"],
    ["admin", "Admin"],
  ] as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#0d1016]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <p className="font-mono text-[13px] leading-5 tracking-[0.14em] text-muted uppercase">Local demo · Sample catalog</p>
        <nav aria-label="Store sections" className="flex flex-wrap gap-2">
          {nav.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`min-h-11 rounded-full border px-3 text-[13px] leading-5 ${view === id || (id === "shop" && (view === "product" || view === "checkout" || view === "confirmed")) ? "border-accent bg-accent text-accent-ink" : "border-line"}`}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {view === "shop" ? (
        <div className="p-4">
          <label className="block text-[13px] leading-5 text-muted" htmlFor="store-search">
            Search products
          </label>
          <input
            id="store-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px] leading-6 outline-none"
            placeholder="Search the catalog"
          />
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Product categories">
            {(["All", ...storeCategories] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                className={`min-h-11 rounded-full border px-3 text-[13px] leading-5 ${category === item ? "border-accent bg-white/10" : "border-line"}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {visible.length === 0 ? <p className="mt-6 text-[15px] leading-6 text-muted">No products match that search.</p> : null}
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {visible.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  className="flex h-full w-full items-start gap-3 rounded-xl border border-line p-3 text-left transition-colors duration-200 hover:bg-white/[0.03] sm:p-4"
                  onClick={() => openProduct(product)}
                >
                  <span className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-line bg-[#11151d] sm:h-24 sm:w-24">
                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-mono text-[13px] leading-5 text-muted">{product.category}</span>
                    <span className="mt-2 block text-[15px] leading-6 font-medium">{product.name}</span>
                    <span className="mt-1 block text-[13px] leading-5 text-muted">{product.summary}</span>
                    <span className="mt-3 block font-mono text-[15px] leading-6">{formatMoney(product.price)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {view === "product" && selected ? (
        <div className="grid gap-6 p-4 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <button type="button" className="min-h-11 text-[13px] leading-5 text-muted underline-offset-4 hover:underline" onClick={() => setView("shop")}>
              Back to shop
            </button>
            <p className="mt-3 font-mono text-[13px] leading-5 text-muted">{selected.category}</p>
            <h3 className="mt-2 text-2xl font-medium tracking-tight">{selected.name}</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-6 text-muted">{selected.summary}</p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="font-mono text-2xl">{formatMoney(selected.price)}</p>
            <p className="mt-2 text-[13px] leading-5 text-muted">{selected.stock} in sample stock</p>
            <fieldset className="mt-4">
              <legend className="text-[13px] leading-5 text-muted">Variant</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    aria-pressed={variantId === variant.id}
                    className={`min-h-11 rounded-full border px-3 text-[13px] leading-5 ${variantId === variant.id ? "border-accent bg-white/10" : "border-line"}`}
                    onClick={() => setVariantId(variant.id)}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              className="mt-5 inline-flex min-h-11 items-center rounded-lg cta-primary px-4 text-[15px] leading-6 font-medium disabled:opacity-50"
              onClick={addToCart}
              disabled={!selected.active || selected.stock < 1}
            >
              Add to cart
            </button>
          </div>
        </div>
      ) : null}

      {view === "cart" ? (
        <div className="p-4">
          <h3 className="text-xl font-medium">Cart</h3>
          {cart.length === 0 ? <p className="mt-3 text-[15px] leading-6 text-muted">The cart is empty.</p> : null}
          <ul className="mt-4 space-y-3">
            {cart.map((line, index) => {
              const product = findProduct(products, line.productId);
              const variant = product?.variants.find((entry) => entry.id === line.variantId);
              return (
                <li key={`${line.productId}-${line.variantId}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-3">
                  <div>
                    <p className="text-[15px] leading-6">{product?.name}</p>
                    <p className="text-[13px] leading-5 text-muted">{variant?.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line" aria-label={`Decrease ${product?.name}`} onClick={() => updateQuantity(index, line.quantity - 1)}>
                      −
                    </button>
                    <span className="min-w-6 text-center text-[15px]">{line.quantity}</span>
                    <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line" aria-label={`Increase ${product?.name}`} onClick={() => updateQuantity(index, line.quantity + 1)}>
                      +
                    </button>
                    <button type="button" className="min-h-11 px-2 text-[13px] leading-5 text-muted underline-offset-4 hover:underline" onClick={() => updateQuantity(index, 0)}>
                      Remove
                    </button>
                  </div>
                  <p className="font-mono text-[15px]">{formatMoney((product?.price ?? 0) * line.quantity)}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] leading-6">Total {formatMoney(cartTotal)}</p>
            <button type="button" className="inline-flex min-h-11 items-center rounded-lg cta-primary px-4 text-[15px] font-medium disabled:opacity-50" disabled={cart.length === 0} onClick={() => setView("checkout")}>
              Continue to demo checkout
            </button>
          </div>
        </div>
      ) : null}

      {view === "checkout" ? (
        <form
          className="max-w-xl p-4"
          onSubmit={(event) => {
            event.preventDefault();
            placeOrder();
          }}
        >
          <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">DEMO CHECKOUT</p>
          <h3 className="mt-3 text-xl font-medium">Demo Checkout</h3>
          <p className="mt-2 text-[15px] leading-6 text-muted">No payment is taken. Do not enter card details.</p>
          <label className="mt-4 block text-[13px] leading-5 text-muted" htmlFor="checkout-name">Name</label>
          <input id="checkout-name" value={checkout.name} onChange={(event) => setCheckout({ ...checkout, name: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px]" />
          <label className="mt-3 block text-[13px] leading-5 text-muted" htmlFor="checkout-email">Email</label>
          <input id="checkout-email" type="email" value={checkout.email} onChange={(event) => setCheckout({ ...checkout, email: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px]" />
          <label className="mt-3 block text-[13px] leading-5 text-muted" htmlFor="checkout-address">Shipping address</label>
          <input id="checkout-address" value={checkout.address} onChange={(event) => setCheckout({ ...checkout, address: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px]" />
          {checkoutError ? <p className="mt-3 text-[13px] leading-5 text-muted">{checkoutError}</p> : null}
          <p className="mt-4 text-[15px] leading-6">Order total {formatMoney(cartTotal)}</p>
          <button type="submit" className="mt-4 inline-flex min-h-11 items-center rounded-lg cta-primary px-4 text-[15px] font-medium">
            Place demo order
          </button>
        </form>
      ) : null}

      {view === "confirmed" ? (
        <div className="p-4">
          <h3 className="text-xl font-medium">Order confirmed</h3>
          <p className="mt-2 text-[15px] leading-6 text-muted">Demo order {latestOrder} is recorded locally. No payment was collected.</p>
          <button type="button" className="mt-4 inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[15px]" onClick={() => setView("account")}>
            View order history
          </button>
        </div>
      ) : null}

      {view === "account" ? (
        <div className="grid gap-6 p-4 md:grid-cols-2">
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <h3 className="text-xl font-medium">Account</h3>
            <p className="mt-2 text-[13px] leading-5 text-muted">Sample profile stored only in this browser session.</p>
            <label className="mt-4 block text-[13px] leading-5 text-muted" htmlFor="profile-name">Name</label>
            <input id="profile-name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px]" />
            <label className="mt-3 block text-[13px] leading-5 text-muted" htmlFor="profile-email">Email</label>
            <input id="profile-email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px]" />
            <label className="mt-3 block text-[13px] leading-5 text-muted" htmlFor="profile-city">City</label>
            <input id="profile-city" value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px]" />
          </form>
          <div>
            <h3 className="text-xl font-medium">Order history</h3>
            <ul className="mt-3 space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="rounded-xl border border-line p-3">
                  <p className="font-mono text-[13px] leading-5">{order.id}</p>
                  <p className="mt-1 text-[15px] leading-6">{order.item}</p>
                  <p className="mt-1 text-[13px] leading-5 text-muted">{order.status} · {formatMoney(order.total)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {view === "admin" ? (
        <div className="p-4">
          <h3 className="text-xl font-medium">Admin</h3>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Admin sections">
            {(["products", "orders", "kpis"] as const).map((tab) => (
              <button key={tab} type="button" aria-pressed={adminTab === tab} className={`min-h-11 rounded-full border px-3 text-[13px] capitalize ${adminTab === tab ? "border-accent bg-white/10" : "border-line"}`} onClick={() => setAdminTab(tab)}>
                {tab === "kpis" ? "KPIs" : tab}
              </button>
            ))}
          </div>
          {adminTab === "kpis" ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Revenue", formatMoney(revenue)],
                ["Orders", String(orders.length)],
                ["Average order", formatMoney(Number.isFinite(average) ? average : 0)],
              ].map(([label, value]) => (
                <li key={label} className="rounded-xl border border-line p-4">
                  <p className="text-[13px] leading-5 text-muted">{label}</p>
                  <p className="mt-2 font-mono text-2xl">{value}</p>
                </li>
              ))}
            </ul>
          ) : null}
          {adminTab === "products" ? (
            <ul className="mt-4 space-y-3">
              {products.map((product) => (
                <li key={product.id} className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-[1fr_7rem_7rem]">
                  <div>
                    <p className="text-[15px] leading-6">{product.name}</p>
                    <p className="text-[13px] leading-5 text-muted">{product.category} · {formatMoney(product.price)}</p>
                  </div>
                  <label className="text-[13px] leading-5 text-muted">
                    Stock
                    <input
                      type="number"
                      min={0}
                      value={product.stock}
                      aria-label={`${product.name} stock`}
                      className="mt-1 h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px]"
                      onChange={(event) =>
                        setProducts((current) => current.map((item) => (item.id === product.id ? { ...item, stock: Number(event.target.value) || 0 } : item)))
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="min-h-11 self-end rounded-full border border-line px-3 text-[13px]"
                    onClick={() => setProducts((current) => current.map((item) => (item.id === product.id ? { ...item, active: !item.active } : item)))}
                  >
                    {product.active ? "Listed" : "Hidden"}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {adminTab === "orders" ? (
            <ul className="mt-4 space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-3">
                  <div>
                    <p className="font-mono text-[13px] leading-5">{order.id}</p>
                    <p className="text-[15px] leading-6">{order.item}</p>
                    <p className="text-[13px] leading-5 text-muted">{formatMoney(order.total)}</p>
                  </div>
                  <label className="text-[13px] leading-5 text-muted">
                    Status
                    <select
                      value={order.status}
                      aria-label={`${order.id} status`}
                      className="mt-1 h-11 rounded-xl border border-line bg-[#0d1016] px-3 text-[15px]"
                      onChange={(event) =>
                        setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status: event.target.value as OrderStatus } : item)))
                      }
                    >
                      <option>Preparing</option>
                      <option>Fulfilled</option>
                      <option>Cancelled</option>
                    </select>
                  </label>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
