import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  Wine,
  UtensilsCrossed,
  Star,
  ArrowDown,
  CheckCircle2,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useInView } from "./hooks/useInView";
import { useTilt } from "./hooks/useTilt";

/* ------------------------------------------------------------------ */
/*  Custom cursor (desktop only)                                       */
/* ------------------------------------------------------------------ */

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mq.matches);
    const listener = () => setIsFinePointer(mq.matches);
    mq.addEventListener?.("change", listener);
    return () => mq.removeEventListener?.("change", listener);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let raf = 0;

    const animate = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable =
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "input" ||
        target.tagName.toLowerCase() === "select" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        !!target.closest(".interactive-card");
      setIsHovering(hoverable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#d4af37]"
        style={{
          width: 6,
          height: 6,
          boxShadow: "0 0 10px rgba(212, 175, 55, 0.9)",
          opacity: isHovering ? 0 : 1,
          transition: "opacity 0.25s ease",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border flex items-center justify-center transition-[width,height,background-color,border-color] duration-300 ease-out"
        style={{
          width: isHovering ? 64 : 34,
          height: isHovering ? 64 : 34,
          borderColor: isHovering ? "rgba(212,175,55,0.9)" : "rgba(212,175,55,0.4)",
          backgroundColor: isHovering ? "rgba(212,175,55,0.08)" : "transparent",
        }}
      />
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastScrollY.current && y > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#platos-destacados", label: "Selección" },
    { href: "#platos-autor", label: "Menú" },
    { href: "#bodega-postres", label: "Bodega" },
    { href: "#reservas", label: "Reservar" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-5" : "py-8"}`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex justify-between items-center">
        <a href="#top" className="text-2xl font-serif tracking-[0.3em] uppercase text-[#d4af37]">
          LC.
        </a>

        <div className="hidden md:flex space-x-10 items-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-xs tracking-[0.25em] uppercase text-gray-300 hover:text-[#d4af37] transition-colors cursor-pointer group"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-[#d4af37]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={26} /> : <MenuIcon size={26} />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          menuOpen ? "max-h-64 opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center space-y-6 pb-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-[0.25em] uppercase text-gray-200 hover:text-[#d4af37] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

const CinematicHero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(t);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center will-change-transform transition-opacity duration-[1500ms]"
        style={{
          backgroundImage: "url('/images/hero.jpg')",
          transform: `translateY(${scrollY * 0.4}px) scale(1.1)`,
          opacity: loaded ? 0.55 : 0,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)] z-0" />

      <div
        className="relative z-10 text-center flex flex-col items-center px-4 will-change-transform"
        style={{ transform: `translateY(${scrollY * -0.2}px)` }}
      >
        <span className="text-[#d4af37] tracking-[0.4em] uppercase text-xs md:text-sm mb-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]">
          Alta Cocina Sensorial
        </span>
        <h1
          className="text-6xl md:text-8xl lg:text-[9.5rem] font-serif text-[#fafafa] mb-6 leading-none opacity-0 animate-[scaleDown_1.5s_ease-out_forwards]"
          style={{ textShadow: "0 10px 40px rgba(0,0,0,0.9)" }}
        >
          La Castañuela
        </h1>
        <p className="text-gray-300 font-light tracking-wide max-w-md mx-auto mb-4 opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
          Un viaje sensorial donde la tradición se reinventa en cada bocado.
        </p>
        <div className="w-px h-20 bg-gradient-to-b from-[#d4af37] to-transparent opacity-0 animate-[growDown_1s_ease-out_1.3s_forwards] mt-4" />
      </div>

      <a
        href="#platos-destacados"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce-slow group"
      >
        <span className="text-white/50 text-xs tracking-widest uppercase mb-2 group-hover:text-[#d4af37] transition-colors">
          Descienda
        </span>
        <ArrowDown className="w-4 h-4 text-white/40 group-hover:text-[#d4af37] transition-colors" />
      </a>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Signature dishes ("Platos del día") — reworked & polished          */
/* ------------------------------------------------------------------ */

interface Plato {
  name: string;
  desc: string;
  tag: string;
  price: string;
  img: string;
  origin: "left" | "right";
}

const SignatureDishCard: React.FC<{ plato: Plato; index: number }> = ({ plato, index }) => {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.3, rootMargin: "-10% 0px -10% 0px" });
  const tilt = useTilt<HTMLDivElement>(6);
  const fromLeft = plato.origin === "left";

  return (
    <div
      ref={ref}
      className={`flex flex-col ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-10 md:gap-16 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView
          ? "translateY(0) translateX(0) rotate(0deg)"
          : `translateY(70px) translateX(${fromLeft ? "-70px" : "70px"}) rotate(${fromLeft ? "-3deg" : "3deg"})`,
        transitionDelay: isInView ? `${index * 0.12}s` : "0s",
      }}
    >
      {/* Image */}
      <div className="w-full md:w-1/2 relative group perspective-1000">
        <div
          className="absolute -inset-3 border border-[#d4af37]/30 rounded-sm transition-all duration-1000 ease-out"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "scale(1)" : "scale(0.9)",
            transitionDelay: isInView ? `${index * 0.12 + 0.25}s` : "0s",
          }}
        />
        <div
          ref={tilt.ref}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          className="relative overflow-hidden rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out"
        >
          <div className="relative w-full h-[45vh] md:h-[58vh] overflow-hidden bg-[#111]">
            <img
              src={plato.img}
              alt={plato.name}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: isInView ? "scale(1)" : "scale(1.35)",
                filter: isInView ? "grayscale(0) blur(0px)" : "grayscale(0.6) blur(6px)",
                transitionDelay: isInView ? `${index * 0.12}s` : "0s",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute top-5 left-5 text-[10px] tracking-[0.3em] uppercase text-[#d4af37] border border-[#d4af37]/40 rounded-full px-3 py-1.5 bg-black/40 backdrop-blur-sm">
              {plato.tag}
            </span>
            <span className="absolute bottom-5 right-5 text-[#d4af37] font-serif text-2xl">
              {plato.price}
            </span>
          </div>
        </div>
        <div className="text-[#d4af37]/10 font-serif text-[10rem] leading-none absolute -top-16 -left-6 select-none pointer-events-none hidden md:block">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2 px-2 md:px-8 text-center md:text-left">
        <div
          className="flex items-center justify-center md:justify-start gap-2 mb-4 transition-all duration-700"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(15px)",
            transitionDelay: isInView ? `${index * 0.12 + 0.15}s` : "0s",
          }}
        >
          {[...Array(3)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
          ))}
        </div>
        <h3
          className="text-4xl md:text-5xl font-serif text-white mb-5 transition-all duration-700"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transitionDelay: isInView ? `${index * 0.12 + 0.2}s` : "0s",
          }}
        >
          {plato.name}
        </h3>
        <p
          className="text-gray-400 text-lg font-light leading-relaxed mb-8 border-l border-[#d4af37]/30 pl-4 transition-all duration-700"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transitionDelay: isInView ? `${index * 0.12 + 0.3}s` : "0s",
          }}
        >
          {plato.desc}
        </p>
        <button
          className="group flex items-center space-x-2 text-[#d4af37] uppercase tracking-widest text-sm hover:text-white transition-all duration-700 mx-auto md:mx-0"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transitionDelay: isInView ? `${index * 0.12 + 0.4}s` : "0s",
          }}
        >
          <span className="border-b border-[#d4af37] group-hover:border-white transition-colors pb-1">
            Conocer más
          </span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const PlatosDelDia: React.FC = () => {
  const header = useInView<HTMLDivElement>({ threshold: 0.4 });

  const platos: Plato[] = [
    {
      name: "Caviar Oscietra & Blinis",
      desc: "Crema agria ahumada, yema curada, cebollino fresco de nuestro huerto y perlas de caviar Oscietra servidas sobre hielo negro.",
      tag: "Entrante Frío",
      price: "€48",
      img: "/images/plato-caviar.jpg",
      origin: "left",
    },
    {
      name: "Foie Gras Mi-Cuit",
      desc: "Reducción de Pedro Ximénez, brioche tostado artesanal, higos confitados y flor de sal en escamas.",
      tag: "Especialidad",
      price: "€36",
      img: "/images/plato-foie.jpg",
      origin: "right",
    },
    {
      name: "Risotto de Trufa Negra",
      desc: "Arroz Acquerello cocinado lentamente, Parmigiano Reggiano curado 36 meses y láminas de trufa negra de temporada.",
      tag: "Recomendado",
      price: "€42",
      img: "/images/plato-risotto.jpg",
      origin: "left",
    },
  ];

  return (
    <section
      id="platos-destacados"
      className="py-28 md:py-36 bg-[#050505] relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(92,26,27,0.18),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full">
        <div
          ref={header.ref}
          className="text-center mb-20 md:mb-28 transition-all duration-1000 ease-out"
          style={{
            opacity: header.isInView ? 1 : 0,
            transform: header.isInView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <div className="flex items-center justify-center space-x-3 mb-5">
            <span className="w-8 h-px bg-[#d4af37]/50" />
            <span className="text-[#d4af37] tracking-[0.3em] uppercase text-xs font-semibold">
              Selección del Chef
            </span>
            <span className="w-8 h-px bg-[#d4af37]/50" />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Sugerencias <br className="md:hidden" /> Efímeras
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            Platos concebidos con ingredientes de temporada, disponibles por tiempo limitado
            mientras dure su esplendor.
          </p>
        </div>

        <div className="space-y-24 md:space-y-36">
          {platos.map((plato, i) => (
            <SignatureDishCard key={plato.name} plato={plato} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Opposing horizontal scroll (menu showcase)                         */
/* ------------------------------------------------------------------ */

interface ScrollItem {
  title: string;
  description: string;
  image: string;
}

interface OpposingHorizontalScrollProps {
  id: string;
  title: string;
  subtitle: string;
  items: ScrollItem[];
  direction?: "rtl" | "ltr";
  icon?: React.ComponentType<{ className?: string }>;
}

const OpposingHorizontalScroll: React.FC<OpposingHorizontalScrollProps> = ({
  title,
  subtitle,
  items,
  direction = "rtl",
  icon: Icon,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      setMaxTranslate(Math.max(0, trackWidth - viewportWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      const currentScrollTop = Math.min(Math.max(-rect.top, 0), totalScrollableDistance);
      const progress = totalScrollableDistance > 0 ? currentScrollTop / totalScrollableDistance : 0;
      const easeOutQuad = (t: number) => t * (2 - t);
      setScrollProgress(easeOutQuad(progress));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [maxTranslate]);

  const getTransform = () => {
    if (direction === "rtl") {
      return `translate3d(${-scrollProgress * maxTranslate}px, 0, 0)`;
    }
    return `translate3d(${-maxTranslate + scrollProgress * maxTranslate}px, 0, 0)`;
  };

  const containerHeight = `calc(100vh + ${maxTranslate}px)`;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0a0a0a]"
      id={id}
      style={{ height: containerHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        <div
          className={`absolute top-1/2 ${direction === "rtl" ? "right-0" : "left-0"} w-[40vw] h-[40vw] bg-[#5c1a1b]/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none`}
        />
        <div
          className={`absolute top-24 ${direction === "rtl" ? "left-6 md:left-20" : "right-6 md:right-20 text-right"} z-20`}
        >
          <div className={`flex items-center space-x-3 mb-2 ${direction === "rtl" ? "" : "justify-end"}`}>
            {Icon && direction === "rtl" && <Icon className="text-[#d4af37] w-6 h-6" />}
            <span className="text-[#d4af37] tracking-[0.3em] uppercase text-xs font-semibold">
              {subtitle}
            </span>
            {Icon && direction === "ltr" && <Icon className="text-[#d4af37] w-6 h-6" />}
          </div>
          <h2 className="text-4xl md:text-7xl font-serif text-white">{title}</h2>
        </div>

        <div
          ref={trackRef}
          className="flex items-center pt-32 pb-12 w-max will-change-transform"
          style={{ transform: getTransform() }}
        >
          <div className="w-[10vw] flex-shrink-0" />
          {items.map((item, index) => (
            <div
              key={index}
              className="w-[85vw] md:w-[45vw] lg:w-[30vw] h-[65vh] flex-shrink-0 mx-[3vw] relative group interactive-card"
            >
              <div className="w-full h-full relative overflow-hidden rounded-md bg-[#111] shadow-2xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] transform group-hover:scale-110 filter saturate-50 group-hover:saturate-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                  <div className="text-[#d4af37] font-serif text-8xl opacity-20 absolute -top-16 left-8 z-0 pointer-events-none transition-transform duration-700 group-hover:-translate-y-4">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-3xl lg:text-4xl font-serif text-white mb-4 group-hover:text-[#d4af37] transition-colors duration-500">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base font-light mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 h-20">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center border-t border-white/20 pt-6">
                      <span className="text-[#d4af37] tracking-[0.2em] text-xs uppercase font-semibold">
                        Descubrir
                      </span>
                      <ChevronRight className="text-[#d4af37] w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="w-[30vw] flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Quote / transition section                                         */
/* ------------------------------------------------------------------ */

const VerticalTransition: React.FC = () => {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.5 });

  return (
    <section className="py-32 md:py-40 bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div
        ref={ref}
        className="max-w-4xl mx-auto px-6 text-center relative z-10 transition-all duration-1000 ease-out"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? "scale(1) translateY(0)" : "scale(0.95) translateY(30px)",
        }}
      >
        <Sparkles className="w-10 h-10 text-[#d4af37] mx-auto mb-10 opacity-70 animate-pulse" />
        <h3 className="text-3xl md:text-5xl font-serif text-white/90 leading-relaxed mb-8 italic">
          "El arte de la gastronomía reside en la coreografía exacta entre la memoria y la
          innovación."
        </h3>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Reservation                                                         */
/* ------------------------------------------------------------------ */

const ReservationSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2, once: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative py-32 md:py-40 bg-[#0a0a0a] overflow-hidden" id="reservas">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#5c1a1b]/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div
            className="text-center lg:text-left transition-all duration-1000 ease-out"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(-40px)",
            }}
          >
            <span className="text-[#d4af37] tracking-[0.3em] uppercase text-sm mb-6 block">
              Su Mesa le Espera
            </span>
            <h2 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight">
              La Velada <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f9e596]">
                Perfecta
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Le invitamos a ser parte de nuestra historia. Recomendamos realizar su reserva con
              anticipación para asegurar su lugar en nuestra sala.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-8 text-gray-300">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full border border-[#d4af37]/30 flex items-center justify-center bg-[#d4af37]/5 flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-xl text-white">Cenas</h4>
                  <p className="text-sm text-gray-500">Mar - Sáb: 19:30 - 23:30</p>
                </div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full border border-[#5c1a1b]/50 flex items-center justify-center bg-[#5c1a1b]/10 flex-shrink-0">
                  <Wine className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-xl text-white">Bodega</h4>
                  <p className="text-sm text-gray-500">Degustaciones 18:00</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-[#0f0f0f] p-10 sm:p-12 lg:p-16 relative group shadow-2xl border border-white/5 rounded-sm transition-all duration-1000 ease-out"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(40px)",
              transitionDelay: "0.15s",
            }}
          >
            <div className="absolute inset-0 border border-[#d4af37]/0 group-hover:border-[#d4af37]/30 transition-colors duration-1000 pointer-events-none rounded-sm" />

            {submitted ? (
              <div className="relative z-10 flex flex-col items-center justify-center text-center py-16 animate-[fadeInUp_0.6s_ease-out]">
                <CheckCircle2 className="w-14 h-14 text-[#d4af37] mb-6" />
                <h3 className="text-3xl font-serif text-white mb-3">Reserva Recibida</h3>
                <p className="text-gray-400 font-light max-w-xs">
                  Gracias por confiar en La Castañuela. Nos pondremos en contacto para confirmar
                  su mesa a la brevedad.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-[#d4af37] text-xs tracking-[0.2em] uppercase border-b border-[#d4af37] pb-1 hover:text-white hover:border-white transition-colors"
                >
                  Realizar otra reserva
                </button>
              </div>
            ) : (
              <form className="space-y-10 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3 group/input">
                    <label className="text-xs text-[#d4af37] uppercase tracking-[0.2em]">Fecha</label>
                    <div className="relative">
                      <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-[#d4af37] transition-colors" />
                      <input
                        type="date"
                        required
                        className="w-full bg-transparent border-b border-white/20 pb-3 pl-10 text-white focus:outline-none focus:border-[#d4af37] transition-colors font-light text-lg [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 group/input">
                    <label className="text-xs text-[#d4af37] uppercase tracking-[0.2em]">
                      Comensales
                    </label>
                    <div className="relative">
                      <Users className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-[#d4af37] transition-colors" />
                      <select className="w-full bg-transparent border-b border-white/20 pb-3 pl-10 text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none font-light cursor-pointer text-lg">
                        <option className="bg-[#111] text-white">2 Personas - Íntimo</option>
                        <option className="bg-[#111]">3 Personas</option>
                        <option className="bg-[#111]">4 Personas</option>
                        <option className="bg-[#111]">Mesa Privada (5+)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 group/input">
                  <label className="text-xs text-[#d4af37] uppercase tracking-[0.2em]">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sr. / Sra."
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors font-light text-lg placeholder:text-gray-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 mt-8 bg-transparent border border-[#d4af37] text-[#d4af37] hover:text-black transition-colors duration-500 tracking-[0.3em] uppercase text-sm font-semibold relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">Solicitar Reserva</span>
                  <div className="absolute inset-0 bg-[#d4af37] transform scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 ease-out z-0" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const menuPlatos: ScrollItem[] = [
    {
      title: "Tártar de Rubia Gallega",
      description:
        "Lomo madurado 45 días, yema curada en jerez, crujiente de tupinambo y humo de romero silvestre.",
      image:
        "https://images.pexels.com/photos/8112976/pexels-photo-8112976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
    {
      title: "Carabinero a la Brasa",
      description:
        "Asado en carbón de encina, su jugo concentrado, emulsión de algas de la costa gallega y texturas de hinojo.",
      image:
        "https://images.pexels.com/photos/8112891/pexels-photo-8112891.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
    {
      title: "Pichón de Bresse",
      description:
        "Pechuga asada sangrante, paté de sus interiores en brioche trufado artesanal y demi-glace de cacao.",
      image:
        "https://images.pexels.com/photos/8112985/pexels-photo-8112985.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
    {
      title: "Lubina Salvaje",
      description:
        "Lomo confitado a baja temperatura, pil-pil de sus espinas, percebes y aire de limón negro fermentado.",
      image:
        "https://images.pexels.com/photos/35420084/pexels-photo-35420084.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
  ];

  const menuBodega: ScrollItem[] = [
    {
      title: "Reserva Centenaria",
      description:
        "Selección exclusiva de añadas raras de la Ribera del Duero y Borgoña, celosamente guardadas en nuestra cava de piedra.",
      image:
        "https://images.pexels.com/photos/19714324/pexels-photo-19714324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
    {
      title: "Esfera de Cacao 70%",
      description:
        "Ganache de chocolate amazónico, corazón líquido de maracuyá y tierra de almendras tostadas con sal en escamas.",
      image:
        "https://images.pexels.com/photos/8112980/pexels-photo-8112980.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
    {
      title: "Maridaje Experimental",
      description:
        "Un recorrido guiado por nuestro sumiller jefe, fusionando pequeños productores orgánicos y sakes artesanales japoneses.",
      image:
        "https://images.pexels.com/photos/31631254/pexels-photo-31631254.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
    {
      title: "Cítricos y Nieve",
      description:
        "Cremoso de yuzu, merengue seco roto, gel de albahaca fresca y sorbete cristalino de manzana verde.",
      image:
        "https://images.pexels.com/photos/24245839/pexels-photo-24245839.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    },
  ];

  return (
    <div className="font-sans antialiased text-gray-200 selection:bg-[#d4af37] selection:text-black bg-[#050505]">
      <CustomCursor />
      <Navbar />

      <main>
        <CinematicHero />

        <PlatosDelDia />

        <OpposingHorizontalScroll
          id="platos-autor"
          title="Obras de Autor"
          subtitle="Acto I"
          items={menuPlatos}
          direction="rtl"
          icon={UtensilsCrossed}
        />

        <VerticalTransition />

        <OpposingHorizontalScroll
          id="bodega-postres"
          title="Bodega & Finales"
          subtitle="Acto II"
          items={menuBodega}
          direction="ltr"
          icon={Wine}
        />

        <ReservationSection />
      </main>

      <footer className="py-16 bg-[#050505] border-t border-white/5 text-center flex flex-col items-center">
        <div className="text-2xl font-serif tracking-[0.3em] uppercase text-[#d4af37] mb-6">
          LC.
        </div>
        <p className="text-xs text-gray-600 tracking-[0.2em] uppercase">
          &copy; {new Date().getFullYear()} La Castañuela.
        </p>
        <p className="text-[10px] text-gray-700 tracking-[0.1em] uppercase mt-2">
          Diseño Web Premium para Alta Gastronomía
        </p>
      </footer>
    </div>
  );
}
