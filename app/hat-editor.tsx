"use client";
import { useEffect, useRef, useState } from "react";
import { cowboyHatRenders, baseBandAssets, layeredBandAssets, featherAssets, charmAssets } from "./hat-assets";
import "./hat-editor.css";

type Piece = { id: string; label: string; name: string; src?: string; text?: string; x: number; y: number; angle: number; scale: number; kind: string };
type Raster = { url: string; x: number; y: number; w: number; h: number };
export type HatDesign = { shape: string; color: string; size: string; pieces: Piece[]; notes: string; tie: string; total: number };
const amounts: Record<string, number> = { Fitted: 170, Adjustable: 130, "Tear Drop": 130, Camo: 90, "Poly Blend": 75, Poly: 65, Straw: 50 };
const cache = new Map<string, Promise<Raster>>();
// Normalize each transparent export once, then crop its actual artwork. The
// interactive rectangle is the piece itself, never its full transparent canvas.
function raster(src: string, kind: string): Promise<Raster> {
  const key = `${kind}:${src}`;
  if (cache.has(key)) return cache.get(key)!;
  const promise = new Promise<Raster>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1000;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        if (kind === "feather") { ctx.translate(650,430); ctx.rotate(51.332*Math.PI/180); ctx.scale(.45,.45); ctx.translate(-500,-500); }
        if (kind === "charm") { ctx.translate(740,590); ctx.scale(.068,.068); ctx.translate(-500,-500); }
        ctx.drawImage(image,0,0,1000,1000);
        ctx.setTransform(1,0,0,1,0,0);
        const bytes = ctx.getImageData(0,0,1000,1000).data;
        let left=1000,top=1000,right=0,bottom=0;
        for(let y=0;y<1000;y++) for(let x=0;x<1000;x++) if(bytes[(y*1000+x)*4+3]>8) { left=Math.min(left,x); right=Math.max(right,x); top=Math.min(top,y); bottom=Math.max(bottom,y); }
        if(right<left) throw new Error("Empty artwork");
        const crop = document.createElement("canvas"); crop.width=right-left+1; crop.height=bottom-top+1;
        crop.getContext("2d")!.drawImage(canvas,left,top,crop.width,crop.height,0,0,crop.width,crop.height);
        resolve({url:crop.toDataURL(),x:left/10,y:top/10,w:crop.width/10,h:crop.height/10});
      } catch(error) { reject(error); }
    };
    image.onerror=()=>reject(new Error("Unable to load artwork")); image.src=src;
  }); cache.set(key,promise); return promise;
}
function PieceView({piece,active,onSelect,onChange,onBegin}:{piece:Piece;active:boolean;onSelect:()=>void;onChange:(p:Partial<Piece>)=>void;onBegin:()=>void}) {
  const [art,setArt]=useState<Raster|null>(null),[error,setError]=useState(false);
  const gesture=useRef<{x:number;y:number;original:Piece;mode:string;cx:number;cy:number;start:number;distance:number;width:number}|null>(null);
  useEffect(()=>{let live=true;setArt(null);setError(false); if(piece.src) raster(piece.src,piece.kind).then(v=>{if(live)setArt(v)}).catch(()=>{if(live)setError(true)});return()=>{live=false}},[piece.src,piece.kind]);
  const box=art??{x:48,y:51,w:16,h:8};
  const begin=(e:React.PointerEvent<HTMLDivElement>,mode="move")=>{
    if(e.button!==0)return; e.preventDefault();e.stopPropagation();onSelect();onBegin();
    const el=e.currentTarget; const stage=el.closest('.hat-stage')!.getBoundingClientRect();
    const cx=stage.left+(box.x+box.w/2+piece.x)/100*stage.width,cy=stage.top+(box.y+box.h/2+piece.y)/100*stage.height;
    gesture.current={x:e.clientX,y:e.clientY,original:piece,mode,cx,cy,start:Math.atan2(e.clientY-cy,e.clientX-cx),distance:Math.hypot(e.clientX-cx,e.clientY-cy),width:stage.width};
    el.setPointerCapture(e.pointerId);
  };
  const move=(e:React.PointerEvent<HTMLDivElement>)=>{const g=gesture.current;if(!g)return;e.preventDefault();e.stopPropagation();
    if(g.mode==='rotate')onChange({angle:g.original.angle+(Math.atan2(e.clientY-g.cy,e.clientX-g.cx)-g.start)*180/Math.PI});
    else if(g.mode==='scale')onChange({scale:Math.max(.3,Math.min(2,g.original.scale*Math.hypot(e.clientX-g.cx,e.clientY-g.cy)/Math.max(1,g.distance)))});
    else onChange({x:Math.max(-box.x+2,Math.min(98-box.x-box.w,g.original.x+(e.clientX-g.x)/g.width*100)),y:Math.max(-box.y+2,Math.min(98-box.y-box.h,g.original.y+(e.clientY-g.y)/g.width*100))});
  };
  if(error)return <span className="art-error">{piece.name} could not load. Choose it again.</span>;
  if(!piece.text&&!art)return null;
  const position={left:`${box.x+piece.x}%`,top:`${box.y+piece.y}%`,width:`${box.w}%`,height:`${box.h}%`,transform:`rotate(${piece.angle}deg) scale(${piece.scale})`};
  const layer=piece.kind==='feather'?2:piece.kind==='charm'||piece.text?8:piece.id==='two'?6:piece.id==='one'?5:4;
  return <><div className="hat-piece-art" style={{...position,zIndex:layer}}>{piece.text?<span className="hat-brand">{piece.text}</span>:<img src={art!.url} draggable={false} alt={piece.name}/>}</div><div className={`hat-piece ${active?'selected':''}`} data-piece={piece.id} role="button" aria-label={`Move ${piece.label}: ${piece.name}`} tabIndex={0}
    style={{left:`${box.x+piece.x}%`,top:`${box.y+piece.y}%`,width:`${box.w}%`,height:`${box.h}%`,transform:`rotate(${piece.angle}deg) scale(${piece.scale})`,zIndex:active?20:piece.kind==='feather'?2:piece.kind==='charm'||piece.text?8:piece.id==='two'?6:piece.id==='one'?5:4}}
    onPointerDown={begin} onPointerMove={move} onPointerUp={()=>{gesture.current=null}} onPointerCancel={()=>{gesture.current=null}} onLostPointerCapture={()=>{gesture.current=null}}
    onFocus={onSelect} onKeyDown={e=>{const d:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(d[e.key]){e.preventDefault();onBegin();onChange({x:piece.x+d[e.key][0]*(e.shiftKey?2:.3),y:piece.y+d[e.key][1]*(e.shiftKey?2:.3)})}}}>
    {active&&<><div role="button" aria-label={`Drag ${piece.label}`} className="piece-caption" onPointerDown={e=>begin(e)}>{piece.label} · Move ✥</div><div role="button" aria-label={`Rotate ${piece.label}`} className="piece-rotate" onPointerDown={e=>begin(e,'rotate')}>↻</div><div role="button" aria-label={`Resize ${piece.label}`} className="piece-resize" onPointerDown={e=>begin(e,'scale')}>↘</div></>}
  </div></>;
}
function ImageChoice({name,src,selected,onClick,kind=''}:{name:string;src?:string;selected:boolean;onClick:()=>void;kind?:string}) {
 const [art,setArt]=useState<string>('');useEffect(()=>{let ok=true;if(src&&kind)raster(src,kind).then(a=>{if(ok)setArt(a.url)}).catch(()=>{});return()=>{ok=false}},[src,kind]);
 return <button type="button" className={`hat-choice ${selected?'chosen':''}`} aria-pressed={selected} onClick={onClick}>{src&&<img src={art||src} alt="" loading="lazy"/>}<span>{name}</span></button>;
}
export default function HatEditor({onClose,onSave,initial}:{onClose:()=>void;onSave:(d:HatDesign)=>void;initial?:HatDesign}) {
 const [shape,setShape]=useState(initial?.shape??'Tear Drop'),[color,setColor]=useState(initial?.color??'Mocha TD Cowboy'),[size,setSize]=useState(initial?.size??'M');
 const [pieces,setPieces]=useState<Piece[]>(initial?.pieces??[]),[active,setActive]=useState<string|null>(null),[history,setHistory]=useState<Piece[][]>([]),[notes,setNotes]=useState(initial?.notes??''),[tie,setTie]=useState(initial?.tie??'Back'),[review,setReview]=useState(false),[zoom,setZoom]=useState(false),[sizeChart,setSizeChart]=useState(false);
 const current=pieces.find(p=>p.id===active); const total=amounts[shape]+pieces.reduce((sum,p)=>sum+(p.kind==='branding'?12:8),0);
 const remember=()=>setHistory(h=>[...h.slice(-29),pieces]);
 const update=(id:string,change:Partial<Piece>)=>setPieces(ps=>ps.map(p=>p.id===id?{...p,...change}:p));
 const choose=(id:string,label:string,name:string,src:string|undefined,kind:string,text?:string)=>{remember();if(name==='None'||text===''){setPieces(ps=>ps.filter(p=>p.id!==id));if(active===id)setActive(null);return}setPieces(ps=>{const old=ps.find(p=>p.id===id);return [...ps.filter(p=>p.id!==id),{id,label,name,src,kind,text,x:old?.x??0,y:old?.y??0,angle:old?.angle??0,scale:old?.scale??1}]});setActive(id)};
 useEffect(()=>{const old=document.body.style.overflow;document.body.style.overflow='hidden';const key=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key)}},[onClose]);
 const select=(id:string,label:string,assets:Record<string,string>,kind:string)=> <section className="hat-option-section"><label htmlFor={`pick-${id}`}>{label}<span>+$8</span></label><select id={`pick-${id}`} value={pieces.find(p=>p.id===id)?.name??'None'} onChange={e=>choose(id,label,e.target.value,assets[e.target.value],kind)}><option>None</option>{Object.keys(assets).map(n=><option key={n}>{n}</option>)}</select></section>;
 const grid=(id:string,label:string,assets:Record<string,string>,kind:string)=><section className="hat-option-section"><h3>{label}<span>+$8</span></h3><div className="hat-choice-grid"><ImageChoice name="None" selected={!pieces.some(p=>p.id===id)} onClick={()=>choose(id,label,'None',undefined,kind)}/>{Object.entries(assets).map(([name,src])=><ImageChoice key={name} name={name} src={src} kind={kind} selected={pieces.some(p=>p.id===id&&p.name===name)} onClick={()=>choose(id,label,name,src,kind)}/>)}</div></section>;
 return <div className="hat-modal-backdrop"><div className="hat-modal" role="dialog" aria-modal="true" aria-label="Design your Cava hat">
  <header className="hat-modal-head"><b>CAVA <span>HAT BAR</span></b><span>YOUR HAT. YOUR WAY.</span><button aria-label="Close customizer" onClick={onClose}>×</button></header>
  <div className="hat-editor-layout"><section className="hat-preview">
   <div className="hat-preview-toolbar"><button aria-label="Zoom hat" aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?'−':'+'}</button><button disabled={!history.length} onClick={()=>{setPieces(history[history.length-1]);setHistory(h=>h.slice(0,-1))}}>↶ Undo</button><button disabled={!pieces.length} onClick={()=>{remember();setPieces([]);setActive(null)}}>Start over</button><strong>${total}.00</strong></div>
   <div className={`hat-stage-wrap ${zoom?'zoomed':''}`}><div className="hat-stage" onPointerDown={()=>setActive(null)}><img className="hat-photo" src={cowboyHatRenders[shape][color]} alt={`${color} hat`} draggable={false}/>{pieces.map(piece=><PieceView key={piece.id} piece={piece} active={active===piece.id} onSelect={()=>setActive(piece.id)} onBegin={remember} onChange={p=>update(piece.id,p)}/>)}</div></div>
   <div className="hat-layer-tray" aria-label="Select a piece to edit">{pieces.length===0?<p>Add your first band to begin.</p>:pieces.map(p=><button key={p.id} className={active===p.id?'active':''} aria-pressed={active===p.id} onClick={()=>setActive(p.id)}>{p.label}</button>)}</div>
   {current?<div className="hat-adjustments"><b>{current.label}</b><button aria-label="Move selected piece left" onClick={()=>{remember();update(current.id,{x:current.x-1})}}>←</button><button aria-label="Move selected piece up" onClick={()=>{remember();update(current.id,{y:current.y-1})}}>↑</button><button aria-label="Move selected piece down" onClick={()=>{remember();update(current.id,{y:current.y+1})}}>↓</button><button aria-label="Move selected piece right" onClick={()=>{remember();update(current.id,{x:current.x+1})}}>→</button><button onClick={()=>{remember();update(current.id,{angle:current.angle+15})}}>↻</button><button onClick={()=>{remember();setPieces(ps=>ps.filter(p=>p.id!==current.id));setActive(null)}}>Remove</button></div>:<p className="hat-hint">Select a piece to move, rotate, or resize it.</p>}
   <button className="hat-primary" onClick={()=>setReview(true)}>Review your hat <span>${total}.00 →</span></button>
  </section><section className="hat-options">
   <div className="hat-options-intro"><h2>Build your hat</h2><p>Accessories $8 each · Branding $12 per placement</p></div>
   <section className="hat-option-section"><h3>Hat style</h3><div className="hat-choice-grid">{Object.entries(cowboyHatRenders).map(([name,colors])=><ImageChoice key={name} name={name} src={Object.values(colors)[0]} selected={name===shape} onClick={()=>{setShape(name);setColor(Object.keys(colors)[0])}}/>)}</div></section>
   <section className="hat-option-section"><h3>Color <span>{color}</span></h3><div className="hat-choice-grid">{Object.entries(cowboyHatRenders[shape]).map(([name,src])=><ImageChoice key={name} name={name} src={src} selected={name===color} onClick={()=>setColor(name)}/>)}</div></section>
   {select('base','Base band',baseBandAssets,'band')}{select('one','Layered band 1',layeredBandAssets,'band')}{select('two','Layered band 2',layeredBandAssets,'band')}
   <section className="hat-option-section"><label htmlFor="hat-tie">Band tie placement</label><select id="hat-tie" value={tie} onChange={e=>setTie(e.target.value)}><option>Back</option><option>Side</option></select><p>Tie placement is recorded with your design; the photo shows the original tie.</p></section>
   {grid('feather','Feather',featherAssets,'feather')}
   <section className="hat-option-section"><label htmlFor="hat-branding">Branding <span>+$12</span></label><input id="hat-branding" placeholder="Your initials" maxLength={5} value={pieces.find(p=>p.id==='branding')?.text??''} onChange={e=>choose('branding','Branding',e.target.value,undefined,'branding',e.target.value.toUpperCase())}/><p>Up to five letters in one placement. Shown in white to preview the position.</p></section>
   {grid('charm','Charm',charmAssets,'charm')}
   <section className="hat-option-section"><h3>Hat size <button onClick={()=>setSizeChart(!sizeChart)}>Size chart</button></h3><div className="hat-sizes">{['S','M','L'].map(s=><button key={s} className={size===s?'active':''} aria-pressed={size===s} onClick={()=>setSize(s)}>{s}</button>)}</div>{sizeChart&&<table><thead><tr><th>Size</th><th>Head circumference</th></tr></thead><tbody><tr><td>S</td><td>21⅝–22 inches</td></tr><tr><td>M</td><td>22¼–22¾ inches</td></tr><tr><td>L</td><td>23–23½ inches</td></tr></tbody></table>}</section>
   <section className="hat-option-section"><label htmlFor="hat-notes">Final details</label><textarea id="hat-notes" placeholder="Anything we should know about your hat?" value={notes} onChange={e=>setNotes(e.target.value)}/></section>
  </section></div>
  {review&&<div className="hat-review" role="dialog" aria-label="Review your custom hat"><button className="review-close" onClick={()=>setReview(false)} aria-label="Back to editing">×</button><p className="review-eyebrow">YOUR FINAL EDIT</p><h2>Made your way.</h2><p>{color} · Size {size}</p><dl><div><dt>{shape} hat</dt><dd>${amounts[shape]}</dd></div>{pieces.map(p=><div key={p.id}><dt>{p.label}: {p.name}</dt><dd>${p.kind==='branding'?12:8}</dd></div>)}<div><dt>Total</dt><dd>${total}.00</dd></div></dl><p>Your selections and every piece’s position will be saved with your design.</p><button className="hat-primary" onClick={()=>onSave({shape,color,size,pieces,notes,tie,total})}>Save to your bag →</button><button className="hat-secondary" onClick={()=>setReview(false)}>Keep editing</button></div>}
 </div></div>;
}
