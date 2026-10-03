import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowRight, Menu, X, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/roll-clap-logo-cropped.png.asset.json";
import heroImage from "@/assets/hero-editorial.jpg";
import artistImage from "@/assets/gallery-artist.jpg";
import productionImage from "@/assets/gallery-production.jpg";
import eventImage from "@/assets/gallery-event.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Roll Clap — Creative Management & Production" },
    { name: "description", content: "Roll Clap brings artists, experiences, stories and production together. Explore our creative management, events, media and production services." },
    { property: "og:title", content: "Roll Clap — Creative Management & Production" },
    { property: "og:description", content: "Artists. Experiences. Stories. Production. Creative work that moves people." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const services = [
  { title: "Artist Management", description: "We represent, develop and manage artists, building meaningful opportunities and long-term careers through strategic partnerships and creative direction." },
  { title: "Event Planning & Management", description: "From concept to execution, we plan and manage experiences that bring brands, people and ideas together." },
  { title: "Influencer & Social Media Management", description: "We connect brands with creators and build social campaigns designed around relevance, creativity and meaningful audience engagement." },
  { title: "PR & Media Management", description: "We shape stories, build visibility and connect brands, artists and campaigns with the right media conversations." },
  { title: "Production Services", description: "From concept and creative direction to production and final delivery, we bring ideas to life across commercial, digital and branded content." },
];
const nav = [{ label: "About", href: "#about" }, { label: "Services", href: "#services" }, { label: "Work", href: "#work" }, { label: "Contact", href: "#contact" }];

function Logo({ className = "" }: { className?: string }) {
  return <img className={className} src={logoAsset.url} alt="Roll Clap" width="520" height="130" />;
}

function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [hasVideo, setHasVideo] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 1700);
    return () => window.clearTimeout(timer);
  }, [onFinish]);
  return <div className="loading-screen" aria-label="Loading Roll Clap">
    <span className="loading-kicker">ROLL · CLAP · ACTION</span><Logo className="loading-logo" /><span className="loading-bottom">A NEW SCENE IS COMING</span>
    {hasVideo && <video className="loading-video" src="/roll-clap-loading.mp4" autoPlay muted playsInline onEnded={onFinish} onError={() => setHasVideo(false)} />}
  </div>;
}

function Index() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const siteRef = useRef<HTMLDivElement>(null);
  const finishLoading = () => setLoaded(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!loaded || !siteRef.current) return;
    let cleanup = () => {};
    let alive = true;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!alive || !siteRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const context = gsap.context(() => {
        gsap.from(".hero-line span", { yPercent: 110, duration: 1.05, ease: "power4.out", stagger: 0.13, delay: 0.12 });
        gsap.from(".hero-enter", { y: 22, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power2.out", delay: 0.5 });
        gsap.from(".hero-visual", { x: 50, opacity: 0, scale: 1.04, duration: 1.1, ease: "power3.out", delay: 0.2 });
        gsap.utils.toArray<HTMLElement>(".reveal-heading").forEach(el => {
          gsap.from(el, { y: 55, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".sequence-word").forEach((el, i) => {
          gsap.from(el, { x: i % 2 ? 75 : -75, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".gallery-item").forEach(el => {
          gsap.from(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
      }, siteRef);
      cleanup = () => context.revert();
    });
    return () => { alive = false; cleanup(); };
  }, [loaded]);
  useEffect(() => { document.body.style.overflow = menuOpen || reelOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen, reelOpen]);

  return <>
    {!loaded && <LoadingScreen onFinish={finishLoading} />}
    <div ref={siteRef} className={loaded ? "site is-ready" : "site"}>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="brand" aria-label="Roll Clap home" onClick={() => setMenuOpen(false)}><Logo /></a>
        <nav className="desktop-nav" aria-label="Main navigation">{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
        <Button asChild className="header-cta"><a href="#contact">LET'S TALK <ArrowRight size={16} /></a></Button>
        <Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </header>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{nav.map((item, i) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{item.label}<ArrowDownRight /></a>)}<a href="#contact" onClick={() => setMenuOpen(false)} className="mobile-contact">LET'S TALK <ArrowRight /></a></nav>}
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="hero-topline hero-enter"><span>CREATIVE MANAGEMENT & PRODUCTION</span><span>EST. FOR WHAT'S NEXT</span></div>
            <h1 id="hero-title"><span className="hero-line"><span>WE MAKE</span></span><span className="hero-line"><span>MOMENTS</span></span><span className="hero-line"><span>MOVE<span className="hero-dot">.</span></span></span></h1>
            <div className="hero-bottom hero-enter"><div><p className="hero-intro">Artists. Experiences. Stories. Production.</p><p className="hero-description">Roll Clap is a creative management and production company bringing artists, brands, creators and ideas together to create work that moves people.</p></div><div className="hero-actions"><Button asChild><a href="#contact">LET'S WORK TOGETHER <ArrowRight size={17} /></a></Button><Button asChild variant="outline"><a href="#work">EXPLORE OUR WORK <ArrowDownRight size={17} /></a></Button></div></div>
          </div>
          <div className="hero-visual"><img src={heroImage} width="1600" height="1104" alt="Artist on a film set beside a cinema camera" /><div className="hero-frame-label"><span>FRAME 001 / ROLL CLAP</span><span>REC <i /></span></div></div>
          <div className="hero-scroll"><span>SCROLL TO EXPLORE</span><span className="hero-scroll-line" /></div>
        </section>

        <section className="about section-wrap" id="about"><div className="section-meta"><span>01 / THE STORY</span><span>WHO WE ARE</span></div><div className="about-grid"><h2 className="display-heading reveal-heading">WE CREATE<br />WHAT PEOPLE<br /><em>REMEMBER.</em></h2><div className="about-copy"><span className="mini-rule" /><p>Roll Clap is a creative management and production company built around people, ideas and experiences.</p><p>We work across artist management, events, social media, PR and production to turn creative thinking into work that gets noticed.</p><a className="text-link" href="#services">EXPLORE WHAT WE DO <ArrowRight size={18} /></a></div></div><div className="about-stamp" aria-hidden="true">ROLL <span>•</span> CLAP <span>•</span> ACTION</div></section>

        <section className="services section-wrap" id="services"><div className="section-meta"><span>02 / OUR EXPERTISE</span><span>WHAT WE DO</span></div><div className="services-intro"><h2 className="display-heading reveal-heading">WHAT<br /><em>WE DO.</em></h2><p>From people to productions, we bring the moving parts together.</p></div><div className="service-list">{services.map((service, i) => <details className="service-row" key={service.title}><summary><span className="service-number">0{i + 1}</span><span className="service-title">{service.title}</span><span className="service-arrow"><ArrowDownRight size={30} strokeWidth={1.4} /></span></summary><div className="service-description"><p>{service.description}</p></div></details>)}</div></section>

        <section className="work" id="work"><div className="work-top section-wrap"><div className="section-meta"><span>03 / THE WORK</span><span>MADE TO MOVE</span></div><div className="work-title-row"><h2 className="display-heading reveal-heading">MADE TO<br /><em>MOVE.</em></h2><p>Every story starts somewhere. The best ones stay with you.</p></div></div><div className="reel-frame"><img src={productionImage} width="1408" height="912" loading="lazy" alt="Cinema camera and crew working on a production set" /><div className="reel-overlay"><div className="reel-top"><span>ROLL CLAP / SHOWREEL</span><span>TAKE 01 — 00:00:00</span></div><Button className="reel-play" aria-label="Play showreel" onClick={() => setReelOpen(true)}><Play fill="currentColor" size={24} /></Button><div className="reel-bottom"><span>PLAY REEL <ArrowRight size={18} /></span><span>COMING SOON</span></div></div></div></section>

        <section className="gallery section-wrap" aria-label="Visual gallery"><div className="section-meta"><span>04 / THROUGH THE LENS</span><span>VISUAL NOTES</span></div><div className="gallery-grid"><figure className="gallery-item gallery-portrait"><img src={artistImage} width="912" height="1200" loading="lazy" alt="Artist during a stage soundcheck" /><figcaption>PEOPLE <ArrowDownRight size={18} /></figcaption></figure><figure className="gallery-item gallery-landscape"><img src={heroImage} width="1600" height="1104" loading="lazy" alt="Creative portrait being filmed on set" /><figcaption>IDEAS <ArrowDownRight size={18} /></figcaption></figure><figure className="gallery-item gallery-square"><img src={eventImage} width="1008" height="1008" loading="lazy" alt="Performer on an illuminated stage during rehearsal" /><figcaption>EXPERIENCES <ArrowDownRight size={18} /></figcaption></figure><div className="gallery-video"><span>FRAME 04 / MOVING IMAGE</span><div className="gallery-video-center"><Play size={28} /><span>MORE STORIES<br />COMING SOON</span></div><span>ROLL CLAP — 2026</span></div></div><p className="gallery-note">Editorial imagery shown as a visual direction. Original Roll Clap work will live here.</p></section>

        <section className="brand-sequence"><div className="section-wrap"><div className="section-meta"><span>05 / OUR LANGUAGE</span><span>THE CREATIVE PROCESS</span></div><div className="sequence-list"><div className="sequence-word"><span>01</span><strong>ROLL</strong><ArrowDownRight /></div><div className="sequence-word"><span>02</span><strong>CLAP</strong><ArrowDownRight /></div><div className="sequence-word"><span>03</span><strong>ACTION</strong><ArrowDownRight /></div><div className="sequence-word"><span>04</span><strong>CUT<span className="sequence-period">.</span></strong><ArrowDownRight /></div></div></div></section>

        <section className="approach section-wrap"><div className="section-meta"><span>06 / THE APPROACH</span><span>HOW IT COMES TOGETHER</span></div><div className="approach-grid"><h2 className="display-heading reveal-heading">PEOPLE.<br />IDEAS.<br /><em>EXECUTION.</em></h2><div className="approach-side"><p className="approach-lead">Great work happens when the right people, ideas and execution come together.</p><div className="approach-steps"><div><span>01 / PEOPLE</span><p>Artists, creators, collaborators and partners.</p></div><div><span>02 / IDEAS</span><p>Concepts that have something to say.</p></div><div><span>03 / EXECUTION</span><p>Production that turns those ideas into reality.</p></div></div></div></div></section>

        <section className="contact section-wrap" id="contact"><div className="section-meta"><span>07 / NEXT SCENE</span><span>LET'S MAKE SOMETHING</span></div><div className="contact-layout"><div><h2 className="display-heading reveal-heading">READY TO<br /><em>ROLL?</em></h2><p>Have a project, collaboration or idea in mind? Let's make it happen.</p><Button className="contact-cta" onClick={() => document.getElementById("contact-details")?.scrollIntoView({ behavior: "smooth", block: "center" })}>START A PROJECT <ArrowRight size={20} /></Button></div><div id="contact-details" className="contact-details"><span className="mini-rule" /><div><small>EMAIL</small><span>Contact email coming soon</span></div><div><small>PHONE</small><span>Phone number coming soon</span></div><div><small>INSTAGRAM</small><span>Profile coming soon</span></div><div><small>LOCATION</small><span>Details coming soon</span></div></div></div></section>
      </main>
      <footer className="footer"><div className="section-wrap"><div className="footer-main"><a href="#top" className="footer-logo" aria-label="Back to top"><Logo /></a><p>Artists. Experiences.<br />Stories. Production.</p><nav aria-label="Footer navigation">{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><div className="footer-social"><span>INSTAGRAM</span><span>LINKEDIN</span><span>YOUTUBE</span><small>Social profiles coming soon</small></div></div><div className="footer-bottom"><span>© 2026 ROLL CLAP. ALL RIGHTS RESERVED.</span><span>ROLL / CLAP / ACTION / CUT</span><a href="#top">BACK TO TOP ↑</a></div></div></footer>
    </div>
    {reelOpen && <div className="reel-modal" role="dialog" aria-modal="true" aria-label="Roll Clap showreel"><Button variant="ghost" size="icon" className="reel-close" aria-label="Close showreel" onClick={() => setReelOpen(false)}><X /></Button><div className="reel-modal-inner"><span>ROLL CLAP / SHOWREEL</span><h2>THE NEXT<br />SCENE IS<br /><em>COMING.</em></h2><p>Our showreel will be here soon.</p><Button variant="ghost" size="icon" aria-label={soundOn ? "Mute" : "Unmute"} onClick={() => setSoundOn(!soundOn)} title="Sound available when the showreel is added">{soundOn ? <Volume2 /> : <VolumeX />}</Button></div></div>}
  </>;
}
