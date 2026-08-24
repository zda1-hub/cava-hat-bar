"use client";
import { useMemo, useRef, useState } from "react";

const hats = [
  ["The Sunday Stroll", "$138", "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85"],
  ["The Desert Rose", "$148", "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=900&q=85"],
  ["The After Hours", "$158", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85"],
] as const;
const accessories = ["Vintage ribbon", "Feather plume", "Turquoise charm", "Brass concho", "Silk scarf"];
const hatChoices = ["Fitted", "Adjustable", "Tear Drop", "Camo", "Poly Blend", "Straw"];
const hatColors = ["Bone", "Dark chocolate", "Beige", "Nude", "Blush", "Sage", "Turquoise", "Black"];
const bands = ["None", "Classic leather", "Vintage ribbon", "Braided jute", "Silk grosgrain"];
const feathers = ["None", "Pheasant", "Small brown", "Peacock", "White", "Cream"];
const charms = ["None", "Gold horseshoe", "Silver cactus", "Cowboy boot", "Gold heart", "Moon", "Star", "Snake"];
const symbols = ["None", "Horseshoe", "Cactus", "Longhorn", "Heart", "Sun", "Arrow", "Butterfly", "Flower", "Star"];
const extrasMenu = ["None", "Match - Black", "Match - Pink", "Match - Red", "Card - Classic", "Card - Western", "Bundle 1", "Feather stem"];
const A = () => <span aria-hidden="true">↗</span>;
function NavDropdown({ label, items }: { label: string; items: Array<[string, string]> }) { return <details className="nav-dropdown"><summary>{label}<span aria-hidden="true">⌄</span></summary><div className="nav-dropdown-menu">{items.map(([text, href]) => <a key={text} href={href}>{text}</a>)}</div></details>; }
function BuilderGroup({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) { return <div className="builder-group"><label>{title}</label>{note && <p className="builder-note">{note}</p>}{children}</div>; }
function OptionGrid({ items, value, onChange, priced }: { items: string[]; value: string; onChange: (v: string) => void; priced?: boolean }) { return <div className="builder-option-grid">{items.map(item => <button className={value === item ? "active" : ""} onClick={() => onChange(item)} key={item}>{item}{priced && item !== "None" && <small>+$8</small>}</button>)}</div>; }
function BuilderSelect({ value, onChange, items }: { value: string; onChange: (v: string) => void; items: string[] }) { return <select className="builder-select" value={value} onChange={e => onChange(e.target.value)}>{items.map(item => <option key={item}>{item}</option>)}</select>; }
function RefSelect({ label, value, onChange, items, price }: { label: string; value: string; onChange: (v: string) => void; items: string[]; price?: string }) { return <section className="ref-section"><div className="ref-section-title"><b>{label}</b><span>{value} {price}</span></div><select value={value} onChange={e => onChange(e.target.value)}>{items.map(item => <option key={item}>{item}</option>)}</select></section>; }
const cowboyAsset = (file: string) => `/cowboy-renderings/${file}`;
const cowboyHatRenders: Record<string, Record<string, string>> = {
  Fitted: { "Bone Cattleman": cowboyAsset("1db8kg.png"), "Dark Brown Cattleman": cowboyAsset("1dcn5c.png"), "Mint Cattleman": cowboyAsset("1d9a1s.png"), "Fuchsia Cattleman": cowboyAsset("1d8wm8.png"), "Soft Pink Cattleman": cowboyAsset("1d8pwg.png"), "Red Cattleman": cowboyAsset("1d93c0.png"), "Turquoise Cattleman": cowboyAsset("2f170001-07a6-49bf-82b8-967d685b475a.png"), "Purple Cattleman": cowboyAsset("2cc85e74-dbe2-48ec-aab0-932b42873158.png"), "White Cattleman": cowboyAsset("d37be2d6-2538-4952-a322-5a7ae7354c20.png"), "Sage Green Cattleman": cowboyAsset("f19f6020-3019-4f32-9900-b61dbeeea71e.png") },
  Adjustable: { "White Cowboy Adjustable": cowboyAsset("1dbiuo.png"), "Red Cowboy Adjustable": cowboyAsset("1dbc4w.png"), "Beige Cowboy Adjustable": cowboyAsset("1daypc.png"), "Mocha Cowboy Adjustable": cowboyAsset("1db5f4.png"), "Black Cowboy Adjustable": cowboyAsset("1dbsxc.png"), "Pink Cowboy Adjustable": cowboyAsset("1da7mo.png") },
  "Tear Drop": { "Dark Brown TD Cowboy": cowboyAsset("1dbfa8.png"), "Mocha TD Cowboy": cowboyAsset("1dbm00.png"), "Black TD Cowboy": cowboyAsset("1dcgfk.png") },
  Camo: { "Camo Cowboy": cowboyAsset("1da3og.png") },
  "Poly Blend": { "White Cowboy (Poly)": cowboyAsset("1dc300.png"), "Camel Cowboy (Poly)": cowboyAsset("1d9qmo.png"), "Black Cowboy (Poly)": cowboyAsset("1darzk.png"), "Red Cowboy (Poly)": cowboyAsset("1da7u8.png") },
  Poly: { "White Cowboy (Poly)": cowboyAsset("1dc300.png"), "Camel Cowboy (Poly)": cowboyAsset("1d9qmo.png"), "Black Cowboy (Poly)": cowboyAsset("1darzk.png"), "Red Cowboy (Poly)": cowboyAsset("1da7u8.png") },
  Straw: { "Camel Straw": cowboyAsset("1dahpc.png") }
};
const baseBandAssets: Record<string, string> = { "Beige Linen": cowboyAsset("3ychtu.png"), Grey: cowboyAsset("3yce36.png"), "Metallic Silver": cowboyAsset("3ychg2.png"), "Dusty Pink": cowboyAsset("3ycksy.png"), "Light Blue": cowboyAsset("3yco5u.png"), Blue: cowboyAsset("3ycriq.png"), Mustard: cowboyAsset("3ycy8i.png"), "Navy Blue": cowboyAsset("3ycuvm.png"), "Dark Brown": cowboyAsset("3yd1le.png"), Champagne: cowboyAsset("3yd4ya.png"), "Metallic Pink": cowboyAsset("3yd8b6.png"), "Bright Pink": cowboyAsset("3ydbo2.png"), "Light Purple": cowboyAsset("3ydf0y.png"), Burgundy: cowboyAsset("3ydidu.png"), "Metallic Green": cowboyAsset("3ydp3m.png"), Black: cowboyAsset("3ydsgi.png"), Brown: cowboyAsset("3yclea.png"), "White Linen": cowboyAsset("3yc7r6.png"), "Sage Green": cowboyAsset("3ycb42.png"), "Brown Chiffon": cowboyAsset("36da8f.png"), "Cream Lace": cowboyAsset("7tffh0.png"), "White Lace": cowboyAsset("7tfm6s.png") };
const layeredBandAssets: Record<string, string> = { "Gold Chain": cowboyAsset("5rxjhw.png"), "Turq. & Gold Chain": cowboyAsset("92drh0.png"), "Black Bead & Gold": cowboyAsset("92e1jo.png"), "Crystal & Gold Chain": cowboyAsset("5x0jls.png"), "Gold Stars Chain": cowboyAsset("5x0qbk.png"), "Thin Brown Cord": cowboyAsset("5ry9z8.png"), "Rolled Terracotta": cowboyAsset("5rygp0.png"), "Pink Braid": cowboyAsset("92e4wk.png"), "Rolled Pink": cowboyAsset("5ryu4k.png"), "Rolled Teal": cowboyAsset("5rz0uc.png"), "Purple Studs": cowboyAsset("5rz7k4.png"), "Pink Sparkle": cowboyAsset("5rxn2c.png"), "Black Sparkle": cowboyAsset("5rxts4.png"), "White Rope - Studs": cowboyAsset("5juapq.png"), "Off White Rope - Studs": cowboyAsset("5juri6.png"), "Blue Rope - Studs": cowboyAsset("5jv1ku.png"), "Black Rope - Gold Studs": cowboyAsset("5jvida.png"), "Brown Ribbon": cowboyAsset("5jvz5q.png"), "Aqua Rope - Studs": cowboyAsset("5jwcla.png"), "Brown Rope - Studs": cowboyAsset("5juyta.png"), "Red Rope - Studs": cowboyAsset("5jv8i6.png"), "Black Rope - Silver Studs": cowboyAsset("5jvlxq.png"), "Black Chain": cowboyAsset("5jw2q6.png"), "Leaf Chain": cowboyAsset("5jwg5q.png"), "Knotted Rope": cowboyAsset("5jwq8e.png") };
const featherAssets: Record<string, string> = { Pheasant: cowboyAsset("66ac111a0dab153a92aa512d.png"), "Small Brown Feather": cowboyAsset("66ac111e26478cae640bb813.png"), Peacock: cowboyAsset("66ac11220dab153a92aa51c4.png"), White: cowboyAsset("66ac112626478cae640bbae7.png"), "Pheasant Turq.": cowboyAsset("5rw54k.png"), "Spotted Turq.": cowboyAsset("5rwbuc.png"), Brown: cowboyAsset("5rwik4.png"), Cream: cowboyAsset("5rwp9w.png"), "Brown Turq.": cowboyAsset("5rwvzo.png"), "Light Brown Turq.": cowboyAsset("5rx2pg.png") };
const charmAssets: Record<string, string> = { "Gold Horseshoe": cowboyAsset("9z5dtj.png"), "Silver Horseshoe": cowboyAsset("9z573r.png"), "Gold Cactus": cowboyAsset("9z4m5j.png"), "Silver Cactus": cowboyAsset("9z4svb.png"), "Gold Cowboy Boot": cowboyAsset("9z4co7.png"), "Gold Heart": cowboyAsset("9z4ppz.png"), Moon: cowboyAsset("9z5kjb.png"), Star: cowboyAsset("9z5xl3.png"), "Gold Snake": cowboyAsset("9z6b0n.png"), "Silver Snake": cowboyAsset("9z6hqf.png") };
type RenderPosition = { x: number; y: number };
type MovableLayer = "feather" | "base" | "layerOne" | "layerTwo" | "charm";
function DraggableRender({ name, className, src, position, artworkClassName, onImageRef }: { name: string; className: string; src: string; position: RenderPosition; artworkClassName?: string; onImageRef?: (image: HTMLImageElement | null) => void }) { const artwork = <img ref={onImageRef} src={src} alt={`${name} render`} draggable="false" />; return <div className={`reference-render-layer ${className}`} style={{ transform: `translate(${position.x}%, ${position.y}%)` }}>{artworkClassName ? <div className={artworkClassName}>{artwork}</div> : artwork}</div>; }
function SimpleCustomizer({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [blend, setBlend] = useState("Fitted"), [color, setColor] = useState("Bone Cattleman"), [base, setBase] = useState("None"), [layerOne, setLayerOne] = useState("None"), [layerTwo, setLayerTwo] = useState("None"), [tie, setTie] = useState("Tie On The Back"), [feather, setFeather] = useState("None"), [initials, setInitials] = useState(""), [additional, setAdditional] = useState("No"), [additionalText, setAdditionalText] = useState(""), [symbol, setSymbol] = useState("None"), [brandingComments, setBrandingComments] = useState(""), [charm, setCharm] = useState("None"), [size, setSize] = useState("6 7/8"), [comments, setComments] = useState("");
  const [bandPositions, setBandPositions] = useState({ base: { x: 0, y: 0 }, layerOne: { x: 0, y: 0 }, layerTwo: { x: 0, y: 0 } }), [featherPosition, setFeatherPosition] = useState({ x: 0, y: 0 }), [charmPosition, setCharmPosition] = useState({ x: 0, y: 0 }), [activeLayer, setActiveLayer] = useState<MovableLayer | null>(null);
  const layerImages = useRef<Partial<Record<MovableLayer, HTMLImageElement | null>>>({});
  const alphaCanvases = useRef<Partial<Record<MovableLayer, HTMLCanvasElement>>>({});
  const [draggingLayer, setDraggingLayer] = useState<{ key: MovableLayer; x: number; y: number; origin: RenderPosition } | null>(null);
  const baseBandsAll = ["None", ...Object.keys(baseBandAssets)], layeredBandsAll = ["None", ...Object.keys(layeredBandAssets)];
  const feathersAll = ["None", ...Object.keys(featherAssets)];
  const symbolsAll = ["None", "Horseshoe", "Cactus", "Longhorn 1", "Longhorn 2", "Cross 1", "Cross 2", "Heart Outline", "Heart", "Curve", "Sun", "Arrow", "Golf Pin", "Guns Crossed", "Cowboy", "Cowboy Boot", "Snake", "Buffalo", "Bear", "Horn 1", "Horn 2", "Duck", "Wave", "Butterfly", "Flower", "Star", "Lightning Bolt", "Mountains"];
  const render = cowboyHatRenders[blend][color], shapePrice: Record<string, number> = { Fitted: 120, Adjustable: 80, "Tear Drop": 80, Camo: 40, "Poly Blend": 25, Poly: 15, Straw: 0 }, price = 50 + shapePrice[blend] + (feather !== "None" ? 5 : 0) + (additional === "Yes" ? 15 : 0) + (charm !== "None" ? 8 : 0);
  const chooseShape = (shape: string) => { setBlend(shape); setColor(Object.keys(cowboyHatRenders[shape])[0]); };
  const reset = () => { setBlend("Fitted"); setColor("Bone Cattleman"); setBase("None"); setLayerOne("None"); setLayerTwo("None"); setTie("Tie On The Back"); setFeather("None"); setInitials(""); setAdditional("No"); setAdditionalText(""); setSymbol("None"); setBrandingComments(""); setCharm("None"); setSize("6 7/8"); setComments(""); setBandPositions({ base: { x: 0, y: 0 }, layerOne: { x: 0, y: 0 }, layerTwo: { x: 0, y: 0 } }); setFeatherPosition({ x: 0, y: 0 }); setCharmPosition({ x: 0, y: 0 }); setActiveLayer(null); };
  const setBand = (key: "base" | "layerOne" | "layerTwo") => (x: number, y: number) => setBandPositions(p => ({ ...p, [key]: { x, y } }));
  const positions: Record<MovableLayer, RenderPosition> = { feather: featherPosition, base: bandPositions.base, layerOne: bandPositions.layerOne, layerTwo: bandPositions.layerTwo, charm: charmPosition };
  const isPresent: Record<MovableLayer, boolean> = { feather: feather !== "None", base: base !== "None", layerOne: layerOne !== "None", layerTwo: layerTwo !== "None", charm: charm !== "None" };
  const moveLayer = (key: MovableLayer, x: number, y: number) => { if (key === "base" || key === "layerOne" || key === "layerTwo") setBand(key)(x, y); else if (key === "feather") setFeatherPosition({ x, y }); else setCharmPosition({ x, y }); };
  const hasVisibleBandPixel = (key: MovableLayer, x: number, y: number) => {
    if (!isPresent[key] || !["base", "layerOne", "layerTwo"].includes(key)) return false;
    const image = layerImages.current[key];
    if (!image?.complete || !image.naturalWidth || !image.naturalHeight) return false;
    const localX = x - positions[key].x, localY = y - positions[key].y;
    if (localX < 0 || localX > 100 || localY < 0 || localY > 100) return false;
    let canvas = alphaCanvases.current[key];
    if (!canvas || canvas.dataset.source !== image.currentSrc) {
      canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.dataset.source = image.currentSrc;
      canvas.getContext("2d", { willReadFrequently: true })?.drawImage(image, 0, 0);
      alphaCanvases.current[key] = canvas;
    }
    const px = Math.min(canvas.width - 1, Math.max(0, Math.round((localX / 100) * (canvas.width - 1))));
    const py = Math.min(canvas.height - 1, Math.max(0, Math.round((localY / 100) * (canvas.height - 1))));
    try { return (canvas.getContext("2d", { willReadFrequently: true })?.getImageData(px, py, 1, 1).data[3] ?? 0) > 24; } catch { return false; }
  };
  const startStageDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100, y = ((e.clientY - rect.top) / rect.height) * 100;
    const directHit = (["layerTwo", "layerOne", "base"] as MovableLayer[]).find(key => hasVisibleBandPixel(key, x, y));
    const key = directHit ?? activeLayer;
    if (!key || !isPresent[key]) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setActiveLayer(key);
    setDraggingLayer({ key, x: e.clientX, y: e.clientY, origin: positions[key] });
  };
  const continueStageDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingLayer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    moveLayer(draggingLayer.key, draggingLayer.origin.x + ((e.clientX - draggingLayer.x) / rect.width) * 100, draggingLayer.origin.y + ((e.clientY - draggingLayer.y) / rect.height) * 100);
  };
  const selectMovable = (layer: MovableLayer, setter: (value: string) => void) => (value: string) => { setter(value); setActiveLayer(value === "None" ? null : layer); };
  const movableLayers: Array<[MovableLayer, string]> = [["feather", "Feather"], ["base", "Base band"], ["layerOne", "Band 1"], ["layerTwo", "Band 2"], ["charm", "Charm"]].filter(([key]) => ({ feather, base, layerOne, layerTwo, charm })[key] !== "None") as Array<[MovableLayer, string]>;
  return <div className="reference-customizer" role="dialog" aria-modal="true" aria-label="Cava custom hat builder">
    <div className="reference-preview">
      <div className="reference-preview-tools"><button aria-label="Zoom preview">⊕</button><button aria-label="Share design">↥</button><button aria-label="Start over" onClick={reset}>↻</button></div>
      <div className="reference-hat-frame">
        <div className="reference-hat-stage" onPointerDown={startStageDrag} onPointerMove={continueStageDrag} onPointerUp={() => setDraggingLayer(null)} onPointerCancel={() => setDraggingLayer(null)}>
          <img className="reference-base-render" src={render} alt={`${color} ${blend} hat render`}/>
          {feather !== "None" && <DraggableRender
            name={`${feather} feather`}
            className="reference-feather-layer"
            artworkClassName="reference-feather-transform"
            src={featherAssets[feather]}
            position={featherPosition}
            onImageRef={image => { layerImages.current.feather = image; }}
          />}
          {base !== "None" && <DraggableRender
            name={`${base} base band`}
            className="reference-base-band"
            src={baseBandAssets[base]}
            position={bandPositions.base}
            onImageRef={image => { layerImages.current.base = image; }}
          />}
          {layerOne !== "None" && <DraggableRender
            name={`${layerOne} layered band one`}
            className="reference-layer-one"
            src={layeredBandAssets[layerOne]}
            position={bandPositions.layerOne}
            onImageRef={image => { layerImages.current.layerOne = image; }}
          />}
          {layerTwo !== "None" && <DraggableRender
            name={`${layerTwo} layered band two`}
            className="reference-layer-two"
            src={layeredBandAssets[layerTwo]}
            position={bandPositions.layerTwo}
            onImageRef={image => { layerImages.current.layerTwo = image; }}
          />}
          {charm !== "None" && <DraggableRender
            name={`${charm} charm`}
            className="reference-charm-layer"
            artworkClassName="reference-charm-transform"
            src={charmAssets[charm]}
            position={charmPosition}
            onImageRef={image => { layerImages.current.charm = image; }}
          />}
          <div className="reference-initials">{initials}</div>
        </div>
        <div className="reference-selection-label">{blend} · {color} · {base} · {layerOne} · {layerTwo}</div>
      </div>
      <button className="reference-add" onClick={onSaved}>Add to cart · ${price}.00</button>
    </div>
    <div className="reference-options">
      <button className="reference-close" aria-label="Close customizer" onClick={onClose}>×</button>
      <div className="reference-product-title"><strong>${price}.00</strong><b>COWBOY / CAVA</b></div>
      <section className="reference-layer-editor">
        <div><b>EDIT &amp; MOVE A LAYER</b><span>{movableLayers.find(([key]) => key === activeLayer)?.[1] ?? "Choose a layer"}</span></div>
        <select aria-label="Edit and move a layer" value={activeLayer ?? ""} onChange={e => setActiveLayer(e.target.value as MovableLayer)} disabled={movableLayers.length === 0}>
          <option value="" disabled>{movableLayers.length === 0 ? "Add a band, feather, or charm first" : "Choose a layer"}</option>
          {movableLayers.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <p>Choose any existing layer, then drag it directly on the hat.</p>
      </section>
      <section className="ref-section"><div className="ref-section-title"><b>HAT CHOICE / BLEND</b><span>{blend}</span></div><OptionGrid items={Object.keys(cowboyHatRenders)} value={blend} onChange={chooseShape}/></section>
      <section className="ref-section"><div className="ref-section-title"><b>COLOR</b><span>{color}</span></div><OptionGrid items={Object.keys(cowboyHatRenders[blend])} value={color} onChange={setColor}/></section>
      <RefSelect label="BASE BAND" value={base} onChange={selectMovable("base", setBase)} items={baseBandsAll}/>
      <RefSelect label="LAYERED BAND 1" value={layerOne} onChange={selectMovable("layerOne", setLayerOne)} items={layeredBandsAll}/>
      <RefSelect label="LAYERED BAND 2" value={layerTwo} onChange={selectMovable("layerTwo", setLayerTwo)} items={layeredBandsAll}/>
      <section className="ref-section"><div className="ref-section-title"><b>BAND TIE PLACEMENT</b><span>{tie}</span></div><OptionGrid items={["Tie On The Side", "Tie On The Back"]} value={tie} onChange={setTie}/></section>
      <section className="ref-section"><div className="ref-section-title"><b>FEATHERS</b><span>{feather}</span></div><p>Please choose a feather. These will be placed behind the band cluster.</p><OptionGrid items={feathersAll} value={feather} onChange={selectMovable("feather", setFeather)} priced/></section>
      <section className="ref-section"><div className="ref-section-title"><b>BRANDING</b><span>{initials || "None"}</span></div><p>Letters are 1/2&quot; tall. Up to five initials are included.</p><input className="builder-input" maxLength={5} value={initials} onChange={e => setInitials(e.target.value.toUpperCase())} placeholder="Up to 5 letters"/><span className="counter">{initials.length}/5</span></section>
      <section className="ref-section"><div className="ref-section-title"><b>ADDITIONAL BRANDING</b><span>{additional}</span></div><OptionGrid items={["No", "Yes"]} value={additional} onChange={setAdditional}/>{additional === "Yes" && <input className="builder-input" maxLength={18} value={additionalText} onChange={e => setAdditionalText(e.target.value.toUpperCase())} placeholder="Up to 18 characters"/>}</section>
      <section className="ref-section"><div className="ref-section-title"><b>BRANDING: SYMBOLS</b><span>{symbol}</span></div><p>Symbols are shown in white and will be burned onto the finished hat.</p><OptionGrid items={symbolsAll} value={symbol} onChange={setSymbol} priced/></section>
      <section className="ref-section"><div className="ref-section-title"><b>BRANDING COMMENTS</b></div><textarea className="builder-input builder-textarea" value={brandingComments} onChange={e => setBrandingComments(e.target.value)} placeholder="Comments about branding"/></section>
      <section className="ref-section"><div className="ref-section-title"><b>CHARMS &amp; SMALL ACCESSORIES</b><span>{charm}</span></div><OptionGrid items={["None", ...Object.keys(charmAssets)]} value={charm} onChange={selectMovable("charm", setCharm)} priced/></section>
      <section className="ref-section"><div className="ref-section-title"><b>HAT SIZE</b><span>{size}</span></div><OptionGrid items={["6 7/8", "7 1/8", "7 3/8"]} value={size} onChange={setSize}/></section>
      <section className="ref-section"><div className="ref-section-title"><b>HAT COMMENTS</b></div><textarea className="builder-input builder-textarea" value={comments} onChange={e => setComments(e.target.value)} placeholder="Comments"/></section>
      <button className="reference-bottom-add" onClick={onSaved}>Add to cart · ${price}.00</button>
    </div>
  </div>;
}

export default function Home() {
  const [menu, setMenu] = useState(false), [hat, setHat] = useState(hats[0][0]), [size, setSize] = useState("M"), [extras, setExtras] = useState([accessories[0]]), [brand, setBrand] = useState(false), [email, setEmail] = useState(""), [notice, setNotice] = useState(""), [customOpen, setCustomOpen] = useState(false);
  const [shape, setShape] = useState("Fitted"), [color, setColor] = useState("Bone"), [baseBand, setBaseBand] = useState("None"), [layerOne, setLayerOne] = useState("None"), [layerTwo, setLayerTwo] = useState("None"), [tie, setTie] = useState("Back"), [feather, setFeather] = useState("None"), [brandText, setBrandText] = useState(""), [symbol, setSymbol] = useState("None"), [charm, setCharm] = useState("None"), [extra, setExtra] = useState("None"), [comments, setComments] = useState("");
  const total = useMemo(() => 138 + extras.length * 8 + (brand ? 12 : 0) + (feather !== "None" ? 8 : 0) + (charm !== "None" ? 8 : 0) + (extra !== "None" ? 8 : 0) + (symbol !== "None" ? 12 : 0), [extras, brand, feather, charm, extra, symbol]);
  const toggle = (x: string) => setExtras((v) => v.includes(x) ? v.filter((i) => i !== x) : [...v, x]);
  return <main onClick={e => { const target = e.target as HTMLElement; if (menu && !target.closest(".menu-button")) setMenu(false); if (!target.closest(".nav-dropdown")) document.querySelectorAll(".nav-dropdown[open]").forEach(el => { (el as HTMLDetailsElement).open = false; }); }}>{customOpen && <SimpleCustomizer onClose={() => setCustomOpen(false)} onSaved={() => { setCustomOpen(false); setNotice("Your custom hat design is saved — we’ll be in touch shortly."); }} />}
    <div className="brand-switcher"><a className="active" href="#top">CAVA HAT BAR</a><span>|</span><a href="#story">CAVA STUDIO</a></div>
    <header className="site-header"><button className="menu-button" onClick={() => setMenu(!menu)}>☰ <small>Menu</small></button><nav className={menu ? "nav-links open" : "nav-links"}><a href="#shop">JUST IN</a><NavDropdown label="COLLECTIONS" items={[["Best Sellers", "#shop"], ["Custom Edit Collection", "#shop"], ["Spring + Summer", "#shop"], ["Straw Hats", "#shop"], ["Western Collection", "#shop"], ["Packable Collection", "#shop"], ["Felt Hats", "#shop"], ["Nashville Collection", "#shop"], ["Bag Collection", "#shop"], ["Fall + Winter", "#shop"], ["Limited Edition", "#shop"], ["Men's Hats | Two Roads", "#shop"], ["Lookbook", "#story"], ["Travel", "#shop"], ["Beach", "#shop"], ["Festival + Concert", "#shop"], ["Night Out", "#shop"], ["Wedding", "#shop"]]}/><NavDropdown label="STYLES" items={[["Western", "#shop"], ["Everyday", "#shop"], ["Straw", "#shop"], ["Felt", "#shop"]]}/><NavDropdown label="ACCESSORIES" items={[["Hat Bands + Trims", "#custom"], ["Hat Pins + Charms", "#custom"], ["Hat Care", "#faq"], ["Bags", "#shop"], ["Sunglasses", "#shop"], ["Beanies + Scarves", "#shop"], ["Apparel", "#shop"], ["E-Gift Card", "#faq"]]}/><NavDropdown label="CUSTOM HAT BAR" items={[["Virtual Hat Bar", "#custom"], ["Nashville", "#custom"], ["Salt Lake City", "#custom"], ["Traveling Hat Bar", "#custom"], ["Speakeasy", "#custom"]]}/><NavDropdown label="SALE" items={[["Shop sale", "#shop"], ["End of season", "#shop"]]}/></nav><a className="wordmark" href="#top">CAVA<span>HAT BAR</span></a><div className="header-actions"><a href="#custom">⌕</a><a href="#custom">♙</a><a href="#custom">♧</a><a href="#custom">♡</a></div></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">THE CAVA SUMMER EDIT</p><h1>Make it<br/><em>yours.</em></h1><p className="lede">A hat for every moment — and a custom edit for the ones you’ll remember.</p><a className="button hero-button" href="#custom">SHOP YOUR STYLE <A /></a></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?auto=format&fit=crop&w=1800&q=90" alt="Woman in a wide brim hat"/><div className="image-tag">CAVA / 001<br/><span>Made for the moments</span></div></div></section>
    <section className="intro-band"><p className="eyebrow">WELCOME TO THE HAT BAR</p><h2>Come for the hat.<br/><em>Stay for the feeling.</em></h2><p>Choose your base, layer on the details, and make it unmistakably yours. Every Cava hat is an invitation to get out there and make a memory.</p><a className="text-link" href="#story">Our story <A /></a></section>
    <section className="shop-section" id="shop"><div className="section-head"><div><p className="eyebrow">SHOP THE EDIT</p><h2>Made to be worn<br/><em>on repeat.</em></h2></div><a className="text-link" href="#custom">Shop all hats <A /></a></div><div className="product-grid">{hats.map((h) => <article className="product-card" key={h[0]}><div className="product-image"><img src={h[2]} alt={h[0]}/><button>♡</button></div><div className="product-meta"><div><h3>{h[0]}</h3><p>Hand-finished felt hat</p></div><strong>{h[1]}</strong></div></article>)}</div></section>
    <section className="custom-section" id="custom"><div className="custom-intro"><p className="eyebrow">THE VIRTUAL HAT BAR</p><h2>Your hat,<br/><em>your way.</em></h2><p>Design from the comfort of home. Select your base, layer in your favorite accessories, and add your own signature. We’ll bring your edit to life.</p><div className="steps"><span><b>01</b> Pick a base</span><span><b>02</b> Add your details</span><span><b>03</b> Make it yours</span></div><button className="button outline" onClick={() => setCustomOpen(true)}>Open the full hat builder <A /></button></div><div className="builder-card"><div className="builder-preview rancher-placeholder-preview"><img src="/cowboy-renderings/1db8kg.png" alt="Cowboy hat builder placeholder render"/><div className="preview-label">YOUR CAVA HAT<br/><span>{hat} · Size {size}</span></div></div><div className="builder-controls"><button className="button dark full-builder-button" onClick={() => setCustomOpen(true)}>Customize your hat <A /></button><p className="builder-note">Use our full-screen builder to choose your shape, color, layered bands, feathers, branding, charms, size, and notes.</p></div></div></section>
    {false && customOpen && <div className="customizer-overlay" role="dialog" aria-modal="true" aria-label="Cava custom hat builder"><div className="customizer-top"><button onClick={() => setCustomOpen(false)}>← Back</button></div></div>}
    <section className="size-section"><div><p className="eyebrow">FIND YOUR FIT</p><h2>Good hats<br/><em>feel good.</em></h2><p>Measure around your head, just above your eyebrows and ears. Keep the tape snug, not tight.</p><a className="text-link" href="#faq">Sizing FAQs <A /></a></div><div className="size-chart"><div className="chart-head"><span>Size</span><span>Head circumference</span><span>US hat size</span></div>{[["S","21 ⅝ – 22 in","6 ⅞ – 7"],["M","22 ¼ – 22 ¾ in","7 ⅛ – 7 ¼"],["L","23 – 23 ½ in","7 ⅜ – 7 ½"]].map(r => <div className="chart-row" key={r[0]}>{r.map(c => <span key={c}>{c}</span>)}</div>)}</div></section>
    <section className="story-section" id="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1200&q=85" alt="Friends outdoors wearing hats"/></div><div className="story-copy"><p className="eyebrow">OUR STORY</p><h2>Made for the<br/><em>good stuff.</em></h2><p>Cava started with a simple idea: the best accessories are the ones that become part of your story. We believe getting dressed should feel like an occasion, even when it’s just a Tuesday.</p><p>So we made a hat bar that feels like a conversation with your best-dressed friend — warm, personal, and a little bit unexpected.</p><a className="button dark" href="#custom">Meet Cava <A /></a></div></section>
    <section className="faq-section" id="faq"><div className="section-head"><div><p className="eyebrow">GOOD TO KNOW</p><h2>Questions,<br/><em>answered.</em></h2></div><a className="text-link" href="mailto:hello@cavahatbar.com">Ask us anything <A /></a></div><div className="faq-list">{[["How does the virtual hat bar work?","Choose your hat and details above, then book a virtual session with our hat tenders. We’ll walk you through the whole experience."],["What are the accessories made of?","Every detail is selected for personality and durability. We use vintage-inspired ribbons, natural feathers, brass, silk, and found treasures."],["Can I book Cava for my event?","Absolutely. We love a celebration. Send us a note and we’ll help bring a custom hat bar to your next gathering."],["What is your return policy?","Because custom hats are made just for you, final edits are final sale. Premade hats can be exchanged within 14 days of delivery."]].map(([q,a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="newsletter"><p className="eyebrow">THE CAVA LETTER</p><h2>A little more <em>good stuff.</em></h2><p>New drops, styling notes, and the occasional excuse to put on a hat.</p><form onSubmit={e => {e.preventDefault();setNotice(email ? "You’re on the list — see you soon." : "Add your email to join the list.")}}><input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)}/><button>Join the list <A/></button></form>{notice && <small className="notice">{notice}</small>}</section>
    <footer><div className="footer-brand"><a className="wordmark" href="#top">CAVA<span>HAT BAR</span></a><p>Wear your story.</p></div><div><b>Explore</b><a href="#shop">Shop</a><a href="#custom">Custom Hat Bar</a><a href="#story">Our Story</a></div><div><b>Help</b><a href="#faq">FAQs</a><a href="#faq">Shipping + returns</a><a href="mailto:hello@cavahatbar.com">Contact</a></div><div><b>Follow along</b><a href="#top">Instagram ↗</a><a href="#top">Pinterest ↗</a><a href="#top">TikTok ↗</a></div><div className="footer-bottom"><span>© 2026 Cava Hat Bar</span><span>Made with intention in the desert</span></div></footer>
  </main>;
}
