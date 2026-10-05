"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BOOK } from "../config";
import { CheckoutButton } from "./CheckoutButton";
import { useBodyScrollLock } from "./useBodyScrollLock";
import { clearAnalyticsConsent } from "./privacy-consent";
import { SignupForm } from "./SignupForm";
import { alternateLocalePath, chromeCopy, localizedPath, type SiteLocale } from "../lib/i18n";

export function Wordmark({ footer = false, locale = "en" }: { footer?: boolean; locale?: SiteLocale }) {
  return (
    <a className={`brand${footer ? " footer-brand" : ""}`} href={locale === "es" ? "/es" : "/"} aria-label={locale === "es" ? "Inicio de Say No to Plastic" : "Say No to Plastic home"}>
      <img
        className="brand-wordmark"
        src={footer ? "/brand/sntp-wordmark-microplastic.webp" : "/brand/sntp-wordmark-microplastic-nav.webp"}
        width={footer ? 1320 : 900}
        height={footer ? 220 : 150}
        alt=""
        aria-hidden="true"
        decoding="async"
      />
    </a>
  );
}

export function Header({ skipToContent = true, locale = "en" }: { skipToContent?: boolean; locale?: SiteLocale }) {
  const pathname = usePathname();
  const copy = chromeCopy[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notice, setNotice] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const forceSolid = pathname.startsWith("/resources/") || pathname.startsWith("/newsletters/") || pathname.startsWith("/es/guias/") || pathname.startsWith("/es/boletines/");

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/public/site-notice", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((body: { notice?: string } | null) => setNotice(body?.notice?.trim() || ""))
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
      });
    return () => controller.abort();
  }, []);

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
    document.body.dataset.mobileNavOpen = "true";
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
      delete document.body.dataset.mobileNavOpen;
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
    return () => { window.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const isCurrent = (href: string) => {
    if (href === "/" || href === "/es") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const primaryNav = [
    { href: localizedPath("/", locale), label: copy.home },
    { href: localizedPath("/science", locale), label: copy.science },
    { href: localizedPath("/solutions", locale), label: copy.action },
    { href: localizedPath("/quick-action-card", locale), label: copy.guides },
    { href: localizedPath("/podcast", locale), label: copy.podcast },
    { href: localizedPath("/tedx", locale), label: copy.tedx },
    { href: localizedPath("/about-dr-elie-haddad", locale), label: copy.about },
  ];
  const alternateLocale: SiteLocale = locale === "es" ? "en" : "es";
  const alternateHref = alternateLocalePath(pathname, alternateLocale);
  return (
    <header className={`site-header${scrolled || forceSolid ? " is-scrolled" : ""}`}>
      {skipToContent && <a className="skip-link" href="#main-content">{copy.skip}</a>}
      {notice && <div className="site-owner-notice" role="status"><span>{notice}</span></div>}
      <Wordmark locale={locale} />
      <button ref={toggleRef} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-haspopup="true" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="sr-only">{locale === "es" ? (menuOpen ? "Cerrar navegación" : "Abrir navegación") : `${menuOpen ? "Close" : "Open"} navigation`}</span><i /><i />
      </button>
      <nav className="desktop-nav" aria-label={locale === "es" ? "Navegación principal" : "Primary navigation"}>
        {primaryNav.map((item) => <a key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}</a>)}
              <a className="language-switcher" href={alternateHref} hrefLang={alternateLocale} aria-label={locale === "es" ? "View this page in English" : "Ver esta página en español"}>{locale === "es" ? "EN" : "ES"}</a>
      </nav>
      <CheckoutButton className="header-cta" label={locale === "es" ? "header-es" : "header"}>{copy.book} <span>↗</span></CheckoutButton>
      {menuOpen && (
        <nav ref={menuRef} id="mobile-menu" className="mobile-nav" aria-label={locale === "es" ? "Navegación móvil" : "Mobile navigation"}>
          {primaryNav.map((item) => <a key={item.href} onClick={close} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}</a>)}
          <div className="mobile-nav-secondary" aria-label={locale === "es" ? "Más de Say No to Plastic" : "More from Say No to Plastic"}>
            <span>{copy.more}</span><a onClick={close} href={localizedPath("/resources", locale)}>{copy.guideLibrary}</a><a onClick={close} href={localizedPath("/homo-plasticus", locale)}>{copy.theBook}</a><a onClick={close} href={localizedPath("/media", locale)}>{copy.media}</a><a onClick={close} href={locale === "es" ? "/community" : "/community"}>{copy.community}</a>
          </div>
          <a className="mobile-language-switcher" onClick={close} href={alternateHref} hrefLang={alternateLocale}>{locale === "es" ? "English" : "Español"}</a>
          <CheckoutButton label={locale === "es" ? "mobile-menu-es" : "mobile-menu"} onStarted={close}>{copy.ebook} · ${BOOK.price}</CheckoutButton>
        </nav>
      )}
    </header>
  );
}

export function Footer({ locale = "en" }: { locale?: SiteLocale }) {
  const resetPrivacy = () => {
    clearAnalyticsConsent();
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };
  const year = new Date().getFullYear();
  const copy = chromeCopy[locale];
  return (
    <footer className="site-footer">
      <div className="earth"><p>“{copy.inheritance} <em>{copy.health}</em>”</p></div>
      <div className="footer-grid">
        <div><Wordmark footer locale={locale} /><p>{copy.footerTagline}</p><span className="movement-mark" aria-hidden="true"><img src="/brand/sntp-wordmark-microplastic-nav.webp" width="900" height="150" alt="" decoding="async" /></span></div>
        <div><strong>{copy.explore}</strong><a href={localizedPath("/science", locale)}>{copy.evidence}</a><a href={localizedPath("/science/how-detection-works", locale)}>{copy.detection}</a><a href={localizedPath("/science/exposome", locale)}>{copy.exposome}</a><a href={localizedPath("/solutions", locale)}>{copy.practical}</a><a href={localizedPath("/quick-action-card", locale)}>{copy.twelveStep}</a><a href={localizedPath("/homo-plasticus", locale)}>{copy.theBook}</a><a href="/purchase/recover">{copy.bookAccess}</a><a href={localizedPath("/resources", locale)}>{copy.guideLibrary}</a><a href="/recommendations">{copy.reviewStandard}</a></div>
        <div><strong>{copy.project}</strong><a href={localizedPath("/podcast", locale)}>Beyond Plastic podcast</a><a href={localizedPath("/tedx", locale)}>{copy.tedx}</a><a href={localizedPath("/about-dr-elie-haddad", locale)}>{copy.drHaddad}</a><a href={localizedPath("/media", locale)}>{copy.talkMedia}</a><a href={localizedPath("/newsletters", locale)}>{copy.fieldNotes}</a><a href={localizedPath("/contact", locale)}>{copy.contact}</a><a href="/editorial-policy">{copy.editorial}</a></div>
        <div className="footer-signup"><strong>{copy.newsletterTitle}</strong><p>{copy.newsletterBody}</p><SignupForm compact locale={locale} buttonLabel={copy.join} successTitle={copy.successTitle} successText={copy.successText} /></div>
      </div>
      <div className="footer-bottom"><span>© {year} Say No to Plastic</span><nav className="footer-legal" aria-label={locale === "es" ? "Políticas y ayuda" : "Policies and help"}><a href="/privacy-policy">{copy.privacy}</a><button className="privacy-choice-link" type="button" onClick={resetPrivacy}>{copy.privacyChoices}</button><a href="/terms">{copy.terms}</a><a href="/refunds-and-returns">{copy.refunds}</a><a href="/affiliate-disclosure">{copy.affiliate}</a><a href="/medical-disclaimer">{copy.disclaimer}</a><a href="/accessibility">{copy.accessibility}</a><a href={localizedPath("/contact", locale)}>{copy.mediaInquiries}</a></nav></div>
    </footer>
  );
}
