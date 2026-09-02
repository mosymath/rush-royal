import { useMemo, useState } from "react";
import { ArrowLeft, Check, Coins, Music2, ShoppingBag, VolumeX } from "lucide-react";
import { getShopItem, parseInventory, SHOP_CATEGORIES, SHOP_ITEMS, type ShopCategory } from "@shared/shop";
import { buyShopItem, equipShopItem, type MosyPlayerProfile } from "@/game/playerProfile";
import "./shop.css";

type ShopProps = {
  profile: MosyPlayerProfile | null;
  onUpdateProfile: (profile: MosyPlayerProfile) => void;
  onExit: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
};

export default function Shop({ profile, onUpdateProfile, onExit, musicOn, onToggleMusic }: ShopProps) {
  const [category, setCategory] = useState<ShopCategory>("effect");
  const [feedback, setFeedback] = useState("");
  const ownedIds = useMemo(() => parseInventory(profile?.inventory ?? ""), [profile?.inventory]);
  const items = useMemo(() => SHOP_ITEMS.filter((item) => item.category === category), [category]);

  const flash = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2600);
  };

  const buy = (itemId: string) => {
    if (!profile) return;
    const result = buyShopItem(profile, itemId);
    if (result.ok) { onUpdateProfile(result.profile); flash(`You unlocked ${getShopItem(itemId)?.name}!`); }
    else flash(result.error ?? "Could not buy this item.");
  };

  const equip = (itemId: string) => {
    if (!profile) return;
    const result = equipShopItem(profile, itemId);
    if (result.ok) { onUpdateProfile(result.profile); flash(`${getShopItem(itemId)?.name} equipped!`); }
    else flash(result.error ?? "Own this item first.");
  };

  const isEquipped = (item: (typeof SHOP_ITEMS)[number]) => {
    if (item.category === "effect") return profile?.effectId === item.id;
    if (item.category === "theme") return profile?.themeId === item.id;
    return profile?.avatarId === item.id;
  };

  return <main className="mosy-shop" aria-labelledby="mosy-shop-title">
    <header className="mosy-shop-topbar">
      <button onClick={onExit} data-mosy-hover-sound><ArrowLeft size={17} /> MAIN MENU</button>
      <strong><ShoppingBag size={18} /> MOSY SHOP <b>COINS &amp; COLLECTIBLES</b></strong>
      <button onClick={onToggleMusic} aria-label={musicOn ? "Turn background music off" : "Turn background music on"}>{musicOn ? <Music2 size={18} /> : <VolumeX size={18} />} {musicOn ? "MUSIC" : "MUTED"}</button>
    </header>
    <section className="mosy-shop-hero">
      <div className="mosy-shop-balance"><Coins size={24} /><div><small>YOUR COINS</small><b>{profile?.coins?.toLocaleString() ?? "0"}</b></div></div>
      <div><h1 id="mosy-shop-title">Spend your <span>sparkle coins.</span></h1><p>Keep a correct-answer streak of 3 or more to earn coins, then unlock avatars, effects, and themes.</p></div>
    </section>
    <nav className="mosy-shop-categories" aria-label="Shop categories">{SHOP_CATEGORIES.map((cat) => <button key={cat.id} className={category === cat.id ? "is-active" : ""} onClick={() => setCategory(cat.id)} data-mosy-hover-sound><span>{cat.icon}</span>{cat.label}</button>)}</nav>
    {feedback ? <p className="mosy-shop-feedback" role="status">{feedback}</p> : null}
    <section className="mosy-shop-grid" aria-label="Shop items">{items.map((item) => { const owned = ownedIds.includes(item.id); const equipped = isEquipped(item); return <article key={item.id} className={`mosy-shop-item ${owned ? "is-owned" : ""} ${equipped ? "is-equipped" : ""}`} style={{ "--item-accent": item.accent } as React.CSSProperties}>
      <div className="mosy-shop-item-icon" aria-hidden="true">{item.preview}</div>
      <div className="mosy-shop-item-copy"><span className="mosy-shop-item-category">{item.category.toUpperCase()}</span><h3>{item.name}</h3><p>{item.description}</p></div>
      <div className="mosy-shop-item-actions">{owned ? <button className={equipped ? "is-equipped-btn" : ""} onClick={() => equip(item.id)} data-mosy-hover-sound>{equipped ? <><Check size={15} /> EQUIPPED</> : "EQUIP"}</button> : <button onClick={() => buy(item.id)} disabled={(profile?.coins ?? 0) < item.cost} data-mosy-hover-sound><Coins size={14} /> {item.cost}</button>}</div>
    </article>; })}</section>
  </main>;
}
