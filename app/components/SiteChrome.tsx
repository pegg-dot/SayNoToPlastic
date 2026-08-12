"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BOOK } from "../config";
import { SignupForm } from "./SignupForm";
import { CheckoutButton } from "./CheckoutButton";
import { useBodyScrollLock } from "./useBodyScrollLock";
import { clearAnalyticsConsent } from "./privacy-consent";

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`brand${footer ? " footer-brand" : ""}`} href="/" aria-label="Say No to Plastic home">
      <img
        className="brand-wordmark"
        src={footer ? "/brand/sntp-wordmark-microplastic.png" : "/brand/sntp-wordmark-microplastic-nav.png"}
        width={footer ? 1320 : 900}
        height={footer ? 220 : 150}
        alt=""
        aria-hidden="true"
        decoding="async"
      />
    </a>
  );
}

export function Header({ skipToContent = true }: { skipToContent?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useBodyScrollLock(menuOpen);

  useEffect(() => {
    const closeForWelcome = () => setMenuOpen(false);
    window.addEventListener("hp:welcome-opening", closeForWelcome);
    return () => window.removeEventListener("hp:welcome-opening", closeForWelcome);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const backgroundRegions = [
      document.getElementById("main-content"),
      document.querySelector<HTMLElement>(".site-footer"),
      document.querySelector<HTMLElement>(".site-header .brand"),
      document.querySelector<HTMLElement>(".site-header .desktop-nav"),
      document.querySelector<HTMLElement>(".site-header .header-cta"),
    ].filter((region): region is HTMLElement => Boolean(region));
    const previous = backgroundRegions.map((region) => ({
      region,
      inert: region.inert,
      ariaHidden: region.getAttribute("aria-hidden"),
    }));
    for (const { region } of previous) {
      region.inert = true;
      region.setAttribute("aria-hidden", "true");
    }
    return () => {
      for (const state of previous) {
        state.region.inert = state.inert;
        if (state.ariaHidden === null) state.region.removeAttribute("aria-hidden");
        else state.region.setAttribute("aria-hidden", state.ariaHidden);
      }
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab" && menuOpen && menuRef.current) {
        const controls = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    if (menuOpen) requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus());
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);


  const close = () => setMenuOpen(false);
  const isCurrent = (href: string) => {
    if (href === "/") return pathname === "/";
    if (["/resources", "/media", "/purchase"].includes(href)) return pathname.startsWith(href);
    return pathname === href;
  };
  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      {skipToContent && <a className="skip-link" href="#main-content">Skip to main content</a>}
      <Wordmark />
      <button ref={toggleRef} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-haspopup="true" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="sr-only">{menuOpen ? "Close" : "Open"} navigation</span><i /><i />
      </button>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/" aria-current={pathname === "/" ? "page" : undefined}>Home</a><a href="/science" aria-current={pathname === "/science" ? "page" : undefined}>Science</a><a href="/solutions" aria-current={pathname === "/solutions" ? "page" : undefined}>Solutions</a><a href="/resources" aria-current={pathname.startsWith("/resources") ? "page" : undefined}>Guides</a><a href="/homo-plasticus" aria-current={pathname === "/homo-plasticus" ? "page" : undefined}>The book</a><a href="/about-dr-elie-haddad" aria-current={pathname === "/about-dr-elie-haddad" ? "page" : undefined}>Dr. Haddad</a><a href="/media" aria-current={pathname.startsWith("/media") ? "page" : undefined}>Events &amp; Media</a><a href="/community" aria-current={pathname === "/community" ? "page" : undefined}>Community</a>
      </nav>
      <CheckoutButton className="header-cta" label="header">Get the book <span>↗</span></CheckoutButton>
      {menuOpen && (
        <nav ref={menuRef} id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">
          <a onClick={close} href="/" aria-current={isCurrent("/") ? "page" : undefined}>Home</a><a onClick={close} href="/science" aria-current={isCurrent("/science") ? "page" : undefined}>Science</a><a onClick={close} href="/solutions" aria-current={isCurrent("/solutions") ? "page" : undefined}>Solutions</a><a onClick={close} href="/resources" aria-current={isCurrent("/resources") ? "page" : undefined}>Guides</a><a onClick={close} href="/homo-plasticus" aria-current={isCurrent("/homo-plasticus") ? "page" : undefined}>The book</a><a onClick={close} href="/about-dr-elie-haddad" aria-current={isCurrent("/about-dr-elie-haddad") ? "page" : undefined}>Dr. Haddad</a><a onClick={close} href="/media" aria-current={isCurrent("/media") ? "page" : undefined}>Events &amp; media</a><a onClick={close} href="/community" aria-current={isCurrent("/community") ? "page" : undefined}>Community</a><CheckoutButton label="mobile-menu" onStarted={close}>Get the ebook · ${BOOK.price}</CheckoutButton>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const resetPrivacy = () => {
    clearAnalyticsConsent();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="earth"><p>“The greatest inheritance we can leave our children isn't wealth. <em>It's health.</em>”</p></div>
      <div className="footer-grid">
        <div><Wordmark footer /><p>Science, clarity, and practical action for a world living with plastic.</p><span className="movement-mark" aria-hidden="true"><img src="/brand/sntp-wordmark-microplastic-nav.png" width="900" height="150" alt="" decoding="async" /></span></div>
        <div><strong>Explore</strong><a href="/science">The evidence</a><a href="/science/how-detection-works">How detection works</a><a href="/science/exposome">The exposome</a><a href="/solutions">Practical action</a><a href="/homo-plasticus">The book</a><a href="/purchase/recover">Book access</a><a href="/resources">Guides</a><a href="/recommendations">Product review standard</a></div>
        <div><strong>Project</strong><a href="/about-dr-elie-haddad">Dr. Haddad</a><a href="/media">Talk and media</a><a href="/community">Field notes</a><a href="/contact">Contact</a><a href="/editorial-policy">Editorial standard</a></div>
        <div className="footer-signup"><strong>Field notes</strong><p>New research summaries and practical exposure-reduction guidance.</p><SignupForm compact /><small>Unsubscribe at any time. <a href="/privacy-policy">Privacy details</a>.</small></div>
      </div>
      <div className="footer-bottom"><span>© {year} Say No to Plastic</span><span><a href="/privacy-policy">Privacy</a> &nbsp; <button className="privacy-choice-link" type="button" onClick={resetPrivacy}>Privacy choices</button> &nbsp; <a href="/terms">Terms</a> &nbsp; <a href="/refunds-and-returns">Refunds</a> &nbsp; <a href="/affiliate-disclosure">Affiliate disclosure</a> &nbsp; <a href="/medical-disclaimer">Medical disclaimer</a> &nbsp; <a href="/accessibility">Accessibility</a> &nbsp; <a href="/contact">Media inquiries</a></span></div>
    </footer>
  );
}
