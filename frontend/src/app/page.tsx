"use client";
import { useState, useEffect, useRef } from "react";
import {
  Activity, Package, Shield, Award, CheckCircle,
  Phone, Mail, MapPin, Star, ArrowRight, Heart,
  Zap, Truck, ChevronRight, Scissors, Search, BarChart2
} from "lucide-react";

const FB = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const WA = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);
const LI = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const TT = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.86a8.16 8.16 0 0 0 4.77 1.52V7.93a4.85 4.85 0 0 1-1-.24z" />
  </svg>
);

const CATEGORIES = [
  { icon: Activity,   name: "Diagnóstico",    desc: "Tensiómetros, oxímetros, estetoscopios y equipos de diagnóstico clínico.",     color: "#00d8b0", rgb: "0,216,176" },
  { icon: Search,     name: "Laboratorio",    desc: "Microscopios, centrífugas, reactivos y equipos de análisis clínico.",           color: "#4da8ff", rgb: "77,168,255" },
  { icon: Heart,      name: "Cardiología",    desc: "Electrocardiógrafos, monitores cardíacos y desfibriladores de última generación.", color: "#ff6b8a", rgb: "255,107,138" },
  { icon: BarChart2,  name: "Monitoreo",      desc: "Monitores multiparámetro, telemetría y sistemas de vigilancia intensiva.",     color: "#a78bfa", rgb: "167,139,250" },
  { icon: Scissors,   name: "Cirugía",        desc: "Instrumental quirúrgico, bisturís eléctricos y lámparas cialíticas.",         color: "#fbbf24", rgb: "251,191,36"  },
  { icon: Package,    name: "Hospitalaria",   desc: "Camas, camillas, sillas de ruedas y mobiliario clínico completo.",             color: "#34d399", rgb: "52,211,153" },
];

const FEATURES = [
  { icon: Shield, title: "Productos Certificados",       desc: "Todos nuestros equipos cuentan con certificación ISO y habilitación sanitaria vigente." },
  { icon: Truck,  title: "Envío a Todo Bolivia",         desc: "Logística especializada para equipos médicos en todo el territorio nacional." },
  { icon: Zap,    title: "Soporte Técnico 24/7",        desc: "Técnicos especializados disponibles cuando lo necesites, en cualquier momento." },
  { icon: Award,  title: "+10 Años de Experiencia",     desc: "Respaldando clínicas, hospitales y profesionales de la salud boliviana." },
];

const TESTIMONIALS = [
  { name: "Dr. Carlos Mendoza",   role: "Director – Clínica San Rafael",            text: "EvolucionMedic nos equipó con tecnología de primer nivel. El servicio postventa es excepcional y la respuesta técnica es inmediata." },
  { name: "Dra. Paola Ríos",      role: "Jefa de Laboratorio – Centro Diagnóstico", text: "La calidad de los equipos superó nuestras expectativas. Precios competitivos y entrega puntual siempre." },
  { name: "Lic. Marco Flores",    role: "Administrador – Hospital Regional",        text: "La asesoría técnica personalizada nos ayudó a elegir los equipos perfectos. Totalmente recomendados." },
];

const SOCIALS = [
  { icon: <FB />,  href: "https://facebook.com/evolucionmedic",         label: "Facebook",   hover: "#1877f2" },
  { icon: <IG />,  href: "https://instagram.com/evolucionmedic",        label: "Instagram",  hover: "#e1306c" },
  { icon: <WA />,  href: "https://wa.me/59170000000",                   label: "WhatsApp",   hover: "#25d366" },
  { icon: <LI />,  href: "https://linkedin.com/company/evolucionmedic", label: "LinkedIn",   hover: "#0a66c2" },
  { icon: <TT />,  href: "https://tiktok.com/@evolucionmedic",          label: "TikTok",     hover: "#ff0050" },
];

export default function EvolucionMedicLanding() {
  const [scrollY, setScrollY]             = useState(0);
  const [countersOn, setCountersOn]       = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCountersOn(true); }, { threshold: 0.4 });
    if (statsRef.current) io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  const navBg = scrollY > 60
    ? "rgba(5,12,31,0.97)"
    : "rgba(5,12,31,0.35)";

  return (
    <div style={{ background: "#050c1f", color: "#f0f4ff", fontFamily: "'Outfit',sans-serif", overflowX: "hidden" }}>

      {/* ─── GLOBAL STYLES ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(36px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes floatY {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-14px); }
        }
        @keyframes pulseRing {
          0%,100% { box-shadow:0 0 0 0 rgba(0,216,176,.35); }
          50%     { box-shadow:0 0 0 12px rgba(0,216,176,0); }
        }
        @keyframes waRing {
          0%,100% { box-shadow:0 6px 28px rgba(37,211,102,.55); }
          50%     { box-shadow:0 6px 48px rgba(37,211,102,.85); }
        }
        @keyframes shimmer {
          0%   { background-position:0% 50%; }
          50%  { background-position:100% 50%; }
          100% { background-position:0% 50%; }
        }
        @keyframes countIn {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes ecgLine {
          from { stroke-dashoffset:600; }
          to   { stroke-dashoffset:0; }
        }
        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:.3; }
        }

        .hero-title {
          font-family:'Syne',sans-serif;
          font-size: clamp(2.2rem,4.5vw,4rem);
          font-weight:800;
          line-height:1.08;
          animation: fadeUp .8s ease both;
        }
        .grad-text {
          background: linear-gradient(120deg,#00d8b0 0%,#4da8ff 45%,#a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s ease infinite;
        }
        .hero-sub   { animation: fadeUp .8s .18s ease both; }
        .hero-ctas  { animation: fadeUp .8s .34s ease both; }
        .hero-trust { animation: fadeUp .8s .5s  ease both; }

        .btn-primary {
          background: linear-gradient(135deg,#00d8b0,#00b894);
          color:#050c1f; font-weight:700; font-size:.92rem;
          padding:.82rem 1.9rem; border-radius:50px; border:none;
          cursor:pointer; display:inline-flex; align-items:center; gap:.5rem;
          text-decoration:none; transition:transform .2s,box-shadow .2s;
          animation: pulseRing 2.6s ease-in-out infinite;
        }
        .btn-primary:hover {
          transform:translateY(-3px) scale(1.03);
          box-shadow:0 16px 44px rgba(0,216,176,.45);
          animation:none;
        }
        .btn-wa {
          background:rgba(37,211,102,.1);
          color:#25d366; font-weight:600; font-size:.92rem;
          padding:.82rem 1.9rem; border-radius:50px;
          border:1px solid rgba(37,211,102,.3);
          cursor:pointer; display:inline-flex; align-items:center; gap:.5rem;
          text-decoration:none; transition:all .2s;
        }
        .btn-wa:hover {
          background:rgba(37,211,102,.18);
          border-color:#25d366;
          transform:translateY(-3px);
        }
        .btn-outline {
          background:transparent;
          color:#c0d0e0; font-weight:600; font-size:.92rem;
          padding:.82rem 1.9rem; border-radius:50px;
          border:1px solid rgba(255,255,255,.15);
          cursor:pointer; display:inline-flex; align-items:center; gap:.5rem;
          text-decoration:none; transition:all .2s;
        }
        .btn-outline:hover {
          background:rgba(255,255,255,.06);
          border-color:rgba(255,255,255,.3);
          transform:translateY(-3px);
        }

        .cat-card {
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.06);
          border-radius:18px; padding:1.75rem;
          cursor:pointer; transition:all .3s ease;
          position:relative; overflow:hidden;
        }
        .cat-card:hover {
          transform:translateY(-7px);
          border-color:rgba(0,216,176,.28);
          background:rgba(0,216,176,.04);
          box-shadow:0 20px 60px rgba(0,0,0,.4);
        }
        .cat-card:hover .cat-icon { transform:scale(1.12) rotate(-4deg); }
        .cat-icon { transition:transform .3s ease; }

        .feat-card {
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.06);
          border-radius:18px; padding:1.75rem;
          transition:all .3s;
        }
        .feat-card:hover {
          background:rgba(255,255,255,.05);
          border-color:rgba(0,216,176,.2);
          transform:translateY(-5px);
        }

        .testi-card {
          background:rgba(255,255,255,.035);
          border:1px solid rgba(255,255,255,.07);
          border-radius:20px; padding:2rem;
          transition:all .3s;
        }
        .testi-card:hover {
          transform:translateY(-5px);
          border-color:rgba(0,216,176,.22);
          box-shadow:0 20px 50px rgba(0,0,0,.35);
        }

        .section-tag {
          display:inline-block;
          background:rgba(0,216,176,.1);
          border:1px solid rgba(0,216,176,.22);
          color:#00d8b0;
          font-size:.72rem; font-weight:700;
          letter-spacing:.14em; text-transform:uppercase;
          padding:.32rem 1rem; border-radius:50px;
        }
        .section-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(1.75rem,3.2vw,2.75rem);
          font-weight:800; line-height:1.18;
        }
        .orb {
          position:absolute; border-radius:50%;
          filter:blur(90px); pointer-events:none;
        }
        .stat-val {
          font-family:'Syne',sans-serif;
          font-size:2.8rem; font-weight:800;
          background:linear-gradient(135deg,#00d8b0,#4da8ff);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .ecg-path {
          stroke-dasharray:600;
          stroke-dashoffset:600;
          animation: ecgLine 2.5s ease forwards;
        }
        .blink-dot { animation: blink 1.4s ease-in-out infinite; }
        .float-card { animation: floatY 4s ease-in-out infinite; }
        .float-badge1 { animation: floatY 3.5s .5s ease-in-out infinite; }
        .float-badge2 { animation: floatY 4.2s 1.1s ease-in-out infinite; }
        .wa-float {
          position:fixed; bottom:1.8rem; right:1.8rem; z-index:999;
          width:58px; height:58px; border-radius:50%;
          background:#25d366; color:white;
          display:flex; align-items:center; justify-content:center;
          text-decoration:none;
          animation: waRing 2.2s ease-in-out infinite;
          transition:transform .2s;
        }
        .wa-float:hover { transform:scale(1.12); animation:none; box-shadow:0 8px 36px rgba(37,211,102,.75); }

        .nav-link {
          color:#a0b0c8; text-decoration:none;
          font-size:.88rem; transition:color .2s;
        }
        .nav-link:hover { color:#00d8b0; }

        .quick-link {
          color:#8899b0; text-decoration:none;
          font-size:.875rem;
          display:flex; align-items:center; gap:.4rem;
          transition:color .2s;
        }
        .quick-link:hover { color:#00d8b0; }

        .divider-line {
          width:56px; height:3px;
          background:linear-gradient(90deg,#00d8b0,transparent);
          border-radius:2px; margin-top:1rem;
        }
        .cta-wrap {
          background:linear-gradient(135deg,rgba(0,216,176,.07),rgba(77,168,255,.04));
          border:1px solid rgba(0,216,176,.12);
          border-radius:26px; padding:4rem;
          text-align:center; position:relative; overflow:hidden;
        }
      `}</style>

      {/* ─── FLOATING WHATSAPP ─── */}
      <a href="https://wa.me/59170000000?text=Hola%2C%20me%20interesa%20conocer%20sus%20equipos%20m%C3%A9dicos" className="wa-float" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <WA />
      </a>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"1rem 2.5rem",
        background: navBg,
        backdropFilter:"blur(16px)",
        borderBottom:`1px solid rgba(0,216,176,${scrollY > 60 ? .18 : .04})`,
        transition:"background .3s, border-color .3s",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:".6rem" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#00d8b0,#4da8ff)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Activity size={20} color="#050c1f" />
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.05rem", letterSpacing:"-.02em" }}>
            Evolucion<span style={{ color:"#00d8b0" }}>Medic</span><span style={{ color:"#8899b0" }}>.SRL</span>
          </span>
        </div>
        {/* Links */}
        <div style={{ display:"flex", alignItems:"center", gap:"1.8rem" }}>
          <a href="#servicios" className="nav-link">Productos</a>
          <a href="#nosotros"  className="nav-link">Nosotros</a>
          <a href="#contacto"  className="nav-link">Contacto</a>
          <a href="/login" className="nav-link" style={{ fontWeight: 600, color: "#00d8b0" }}>
            Ingresar al Sistema
          </a>
          <a href="https://wa.me/59170000000?text=Quiero%20una%20cotizaci%C3%B3n" className="btn-primary" style={{ padding:".52rem 1.3rem", fontSize:".82rem", animation:"none" }} target="_blank" rel="noopener noreferrer">
            Cotizar ahora
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:"8rem 2.5rem 4rem", position:"relative", overflow:"hidden" }}>
        <div className="orb" style={{ width:700, height:700, background:"rgba(0,216,176,.06)",  top:"-180px", left:"-250px" }} />
        <div className="orb" style={{ width:450, height:450, background:"rgba(77,168,255,.05)",  top:"80px",  right:"-120px" }} />
        <div className="orb" style={{ width:320, height:320, background:"rgba(167,139,250,.04)", bottom:"60px", left:"42%" }} />

        <div style={{ maxWidth:1280, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4.5rem", alignItems:"center" }}>

          {/* LEFT */}
          <div>
            <div className="section-tag" style={{ marginBottom:"1.4rem" }}>✦ Equipos Médicos Premium · Bolivia</div>
            <h1 className="hero-title">
              Equipa tu clínica<br />con lo{" "}
              <span className="grad-text">mejor del mundo médico</span>
            </h1>
            <p className="hero-sub" style={{ marginTop:"1.4rem", fontSize:"1.05rem", lineHeight:1.75, color:"#8899b0", maxWidth:460 }}>
              EvolucionMedic.SRL trae tecnología médica de élite a Bolivia. Desde diagnóstico hasta cirugía, somos tu aliado estratégico en equipamiento clínico.
            </p>
            <div className="hero-ctas" style={{ display:"flex", gap:"1rem", marginTop:"2.2rem", flexWrap:"wrap" }}>
              <a href="#servicios" className="btn-primary">
                Ver Catálogo <ArrowRight size={17} />
              </a>
              <a href="https://wa.me/59170000000?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20equipos" className="btn-wa" target="_blank" rel="noopener noreferrer">
                <WA /> Escribir por WhatsApp
              </a>
            </div>
            <div className="hero-trust" style={{ display:"flex", gap:"1.6rem", marginTop:"2rem", flexWrap:"wrap" }}>
              {["Envío a toda Bolivia","Garantía oficial","Soporte 24/7"].map((t, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".82rem", color:"#8899b0" }}>
                  <CheckCircle size={14} color="#00d8b0" /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — medical monitor mockup */}
          <div style={{ position:"relative", display:"flex", justifyContent:"center", alignItems:"center" }}>
            <div className="float-card" style={{ position:"relative", zIndex:1 }}>
              <div style={{
                background:"rgba(255,255,255,.04)",
                backdropFilter:"blur(24px)",
                border:"1px solid rgba(0,216,176,.22)",
                borderRadius:22, padding:"1.75rem",
                width:330,
                boxShadow:"0 30px 90px rgba(0,0,0,.55), 0 0 80px rgba(0,216,176,.08)",
              }}>
                {/* card header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.3rem" }}>
                  <div>
                    <div style={{ fontSize:".7rem", color:"#6677aa", marginBottom:3 }}>Monitor multiparámetro</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.1rem" }}>VM-Pro X7</div>
                  </div>
                  <div style={{ width:40, height:40, borderRadius:10, background:"rgba(0,216,176,.14)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Heart size={20} color="#00d8b0" />
                  </div>
                </div>
                {/* vitals grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".65rem", marginBottom:"1.3rem" }}>
                  {[
                    { label:"SpO₂",    value:"98%",    color:"#00d8b0" },
                    { label:"Pulso",   value:"72 bpm", color:"#ff6b8a" },
                    { label:"Temp.",   value:"36.8 °C",color:"#fbbf24" },
                    { label:"Presión", value:"120/80", color:"#4da8ff" },
                  ].map((v,i) => (
                    <div key={i} style={{ background:"rgba(255,255,255,.03)", borderRadius:10, padding:".65rem" }}>
                      <div style={{ fontSize:".68rem", color:"#6677aa", marginBottom:3 }}>{v.label}</div>
                      <div style={{ fontWeight:700, color:v.color, fontSize:"1.05rem" }}>{v.value}</div>
                    </div>
                  ))}
                </div>
                {/* ECG */}
                <div style={{ background:"rgba(0,216,176,.05)", borderRadius:12, padding:".9rem", marginBottom:"1rem" }}>
                  <div style={{ fontSize:".68rem", color:"#8899b0", marginBottom:".4rem" }}>ECG en tiempo real</div>
                  <svg viewBox="0 0 280 48" width="100%" height="48">
                    <polyline
                      className="ecg-path"
                      points="0,30 18,30 22,10 27,44 32,14 37,30 75,30 79,10 84,44 89,14 94,30 132,30 136,10 141,44 146,14 151,30 189,30 193,10 198,44 203,14 208,30 246,30 250,10 255,44 260,14 265,30 280,30"
                      fill="none" stroke="#00d8b0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {/* status bar */}
                <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                  <div className="blink-dot" style={{ width:8, height:8, borderRadius:"50%", background:"#00d8b0" }} />
                  <span style={{ fontSize:".78rem", color:"#8899b0" }}>Sistema activo</span>
                  <span style={{ marginLeft:"auto", fontSize:".78rem", color:"#00d8b0", fontWeight:600 }}>En stock ✓</span>
                </div>
              </div>
            </div>

            {/* floating badges */}
            <div className="float-badge1" style={{ position:"absolute", top:"6%", right:"-2%", background:"rgba(255,255,255,.06)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,.1)", borderRadius:14, padding:".7rem 1rem", zIndex:2 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".45rem" }}>
                <Award size={17} color="#fbbf24" />
                <div>
                  <div style={{ fontSize:".65rem", color:"#8899b0" }}>Certificación</div>
                  <div style={{ fontSize:".82rem", fontWeight:700 }}>ISO 13485</div>
                </div>
              </div>
            </div>
            <div className="float-badge2" style={{ position:"absolute", bottom:"7%", left:"-4%", background:"rgba(255,255,255,.06)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,.1)", borderRadius:14, padding:".7rem 1rem", zIndex:2 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".45rem" }}>
                <Package size={17} color="#00d8b0" />
                <div>
                  <div style={{ fontSize:".65rem", color:"#8899b0" }}>Inventario</div>
                  <div style={{ fontSize:".82rem", fontWeight:700 }}>+500 equipos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <div ref={statsRef} style={{ borderTop:"1px solid rgba(255,255,255,.05)", borderBottom:"1px solid rgba(255,255,255,.05)", background:"rgba(255,255,255,.014)", padding:"2.2rem 2.5rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"2rem", textAlign:"center" }}>
          {[
            { val:"+500",  lbl:"Productos en catálogo" },
            { val:"+200",  lbl:"Clientes satisfechos"  },
            { val:"10+",   lbl:"Años de experiencia"   },
            { val:"24/7",  lbl:"Soporte técnico"       },
          ].map((s,i) => (
            <div key={i} style={{ animation: countersOn ? `countIn .6s ${i*.14}s ease both` : "none", opacity: countersOn ? 1 : 0 }}>
              <div className="stat-val">{s.val}</div>
              <div style={{ fontSize:".83rem", color:"#8899b0", marginTop:".2rem" }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CATEGORIES ─── */}
      <section id="servicios" style={{ padding:"6rem 2.5rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <div className="section-tag">Nuestras Líneas</div>
            <h2 className="section-title" style={{ marginTop:".8rem" }}>Todo lo que tu clínica necesita</h2>
            <p style={{ color:"#8899b0", marginTop:"1rem", maxWidth:520, margin:"1rem auto 0", lineHeight:1.7 }}>
              Desde diagnóstico hasta hospitalaria, contamos con el equipo correcto para cada especialidad médica en Bolivia.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem" }}>
            {CATEGORIES.map((c,i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="cat-card">
                  <div className="cat-icon" style={{ width:52, height:52, borderRadius:14, background:`rgba(${c.rgb},.12)`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.2rem" }}>
                    <Icon size={26} color={c.color} />
                  </div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1.05rem", marginBottom:".5rem" }}>{c.name}</h3>
                  <p style={{ color:"#8899b0", fontSize:".85rem", lineHeight:1.65 }}>{c.desc}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:".4rem", marginTop:"1.2rem", color:"#00d8b0", fontSize:".83rem", fontWeight:600 }}>
                    Ver equipos <ArrowRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section id="nosotros" style={{ padding:"6rem 2.5rem", background:"rgba(255,255,255,.012)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"center" }}>
          <div>
            <div className="section-tag">¿Por qué elegirnos?</div>
            <h2 className="section-title" style={{ marginTop:".8rem", marginBottom:"1rem" }}>
              Más de 10 años siendo el aliado de la salud boliviana
            </h2>
            <p style={{ color:"#8899b0", lineHeight:1.8, fontSize:".95rem" }}>
              EvolucionMedic.SRL nació con la misión de democratizar el acceso a tecnología médica de punta. Somos representantes oficiales de marcas líderes del mundo, con presencia en toda Bolivia.
            </p>
            <div className="divider-line" />
            <div style={{ marginTop:"2rem", display:"flex", gap:"1rem" }}>
              <a href="https://wa.me/59170000000" className="btn-primary" style={{ animation:"none" }} target="_blank" rel="noopener noreferrer">
                Solicitar asesoría <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            {FEATURES.map((f,i) => {
              const FI = f.icon;
              return (
                <div key={i} className="feat-card">
                  <div style={{ width:44, height:44, borderRadius:12, background:"rgba(0,216,176,.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>
                    <FI size={22} color="#00d8b0" />
                  </div>
                  <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".92rem", marginBottom:".45rem" }}>{f.title}</h4>
                  <p style={{ color:"#8899b0", fontSize:".8rem", lineHeight:1.65 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding:"6rem 2.5rem" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <div className="section-tag">Testimonios</div>
            <h2 className="section-title" style={{ marginTop:".8rem" }}>Lo que dicen nuestros clientes</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.4rem" }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="testi-card">
                <div style={{ display:"flex", gap:".22rem", marginBottom:"1rem" }}>
                  {[...Array(5)].map((_,j) => <Star key={j} size={15} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <p style={{ color:"#c0d0e0", lineHeight:1.72, fontSize:".875rem", marginBottom:"1.5rem", fontStyle:"italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#00d8b0,#4da8ff)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:".88rem", color:"#050c1f", flexShrink:0 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:".88rem" }}>{t.name}</div>
                    <div style={{ fontSize:".72rem", color:"#8899b0" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ padding:"3rem 2.5rem 5rem" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div className="cta-wrap">
            <div className="orb" style={{ width:500, height:500, background:"rgba(0,216,176,.05)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
            <div style={{ position:"relative" }}>
              <div className="section-tag">Contáctanos hoy</div>
              <h2 className="section-title" style={{ marginTop:"1rem" }}>¿Listo para transformar tu clínica?</h2>
              <p style={{ color:"#8899b0", marginTop:"1rem", maxWidth:480, margin:"1rem auto 0", lineHeight:1.7 }}>
                Solicita una cotización personalizada. Nuestros asesores te guiarán hacia el equipo ideal para tu institución.
              </p>
              <div style={{ display:"flex", justifyContent:"center", gap:"1rem", marginTop:"2.2rem", flexWrap:"wrap" }}>
                <a href="https://wa.me/59170000000?text=Quiero%20una%20cotizaci%C3%B3n" className="btn-primary" target="_blank" rel="noopener noreferrer">
                  <WA /> Solicitar cotización
                </a>
                <a href="tel:+59170000000" className="btn-outline">
                  <Phone size={17} /> Llamar ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT + SOCIAL ─── */}
      <section id="contacto" style={{ padding:"5rem 2.5rem", borderTop:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr", gap:"4rem" }}>

          {/* brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:"1.4rem" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#00d8b0,#4da8ff)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Activity size={20} color="#050c1f" />
              </div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.05rem" }}>
                Evolucion<span style={{ color:"#00d8b0" }}>Medic</span>.SRL
              </span>
            </div>
            <p style={{ color:"#8899b0", lineHeight:1.75, fontSize:".875rem", marginBottom:"1.6rem" }}>
              Tu proveedor de confianza en equipos médicos de alta tecnología. Comprometidos con elevar el estándar de la salud en Bolivia.
            </p>
            <div style={{ display:"flex", gap:".65rem", flexWrap:"wrap" }}>
              {SOCIALS.map((s,i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  onMouseEnter={() => setHoveredSocial(i)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    width:46, height:46,
                    borderRadius:12,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    border:"1px solid rgba(255,255,255,.1)",
                    transition:"all .25s",
                    textDecoration:"none",
                    color: hoveredSocial === i ? s.hover : "#a0b0c8",
                    background: hoveredSocial === i ? `${s.hover}18` : "transparent",
                    borderColor: hoveredSocial === i ? `${s.hover}55` : "rgba(255,255,255,.1)",
                    transform: hoveredSocial === i ? "translateY(-4px) scale(1.08)" : "none",
                  }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* contact info */}
          <div>
            <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".95rem", marginBottom:"1.4rem" }}>Contáctanos</h4>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {[
                { icon:<Phone size={16} />,  label:"Teléfono",  val:"+591 7 000 0000" },
                { icon:<Mail size={16} />,   label:"Email",     val:"ventas@evolucionmedic.com" },
                { icon:<MapPin size={16} />, label:"Dirección", val:"La Paz, Bolivia" },
              ].map((c,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:".85rem", color:"#a0b0c8" }}>
                  <div style={{ width:38, height:38, borderRadius:9, background:"rgba(0,216,176,.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#00d8b0" }}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={{ fontSize:".68rem", color:"#6677aa", marginBottom:2 }}>{c.label}</div>
                    <div style={{ fontSize:".875rem" }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div>
            <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:".95rem", marginBottom:"1.4rem" }}>Catálogo Rápido</h4>
            <div style={{ display:"flex", flexDirection:"column", gap:".7rem" }}>
              {["Diagnóstico","Laboratorio","Cardiología","Cirugía","Monitoreo","Hospitalaria","Solicitar Cotización"].map((l,i) => (
                <a key={i} href="#servicios" className="quick-link">
                  <ChevronRight size={13} color="#00d8b0" /> {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding:"1.4rem 2.5rem", borderTop:"1px solid rgba(255,255,255,.05)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
        <p style={{ color:"#55667a", fontSize:".78rem" }}>© 2026 EvolucionMedic.SRL — Todos los derechos reservados.</p>
        <p style={{ color:"#55667a", fontSize:".78rem" }}>Hecho con ❤️ para la salud de Bolivia</p>
      </footer>

    </div>
  );
}
