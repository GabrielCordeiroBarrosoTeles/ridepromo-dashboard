"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { CarFront, ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SiteHeaderProps = {
  /** "landing" = só logo + CTA (página inicial). "dashboard" = nav completo (todas as outras). */
  variant: "landing" | "dashboard" | "subpage";
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
};

const logoLinkClass = "flex items-center gap-2 text-white transition hover:opacity-90";

const navLinkClassDesktop = "rounded-md px-2 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white sm:px-3";
const navLinkClassMobile = "block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white";

type NavLinksProps = {
  children?: React.ReactNode;
  isMobile?: boolean;
  onClose?: () => void;
};

function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="RidePromo – ir ao início"
      className={logoLinkClass}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
        <CarFront className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-lg font-semibold tracking-tight md:text-xl">RidePromo</span>
    </Link>
  );
}

function NavLinks({ children, isMobile = false, onClose }: NavLinksProps) {
  const linkClass = isMobile ? navLinkClassMobile : navLinkClassDesktop;
  const navClassName = isMobile ? "space-y-1" : "flex flex-wrap items-center justify-end gap-1 overflow-x-auto sm:gap-3";

  const handleClick = useCallback(() => {
    if (isMobile) {
      onClose?.();
    }
  }, [isMobile, onClose]);
  return (
    <nav className={navClassName} aria-label="Navegação principal">
      <Link href="/dashboard" className={linkClass} onClick={handleClick}>Dashboard</Link>
      <Link href="/viagens" className={linkClass} onClick={handleClick}>Viagens</Link>
      <Link href="/clientes" className={linkClass} onClick={handleClick}>Clientes</Link>
      <Link href="/logs" className={linkClass} onClick={handleClick}>Logs</Link>
      <Link href="/configuracoes" className={linkClass} onClick={handleClick}>Configurações</Link>
      <Link href="/desistencias" className={linkClass} onClick={handleClick}>Desistências</Link>
      <Link href="/politica" className={linkClass} onClick={handleClick}>Política</Link>
      {isMobile && children && (
        <div className="mt-4 pt-4 border-t border-white/20">
          {children}
        </div>
      )}
    </nav>
  );
}

const headerClassName = "sticky top-0 z-50 border-b border-white/15 bg-[#fd6c13] shadow-[0_4px_20px_rgba(253,108,19,0.35)]";

export function SiteHeader({ variant, backHref = "/dashboard", backLabel = "Voltar ao Dashboard", children }: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (variant === "landing") {
    return (
      <header className={headerClassName} role="banner">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-6">
          <Logo href="/" />
          {children}
        </div>
      </header>
    );
  }

  if (variant === "dashboard") {
    return (
      <header className={headerClassName} role="banner">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <Logo href="/dashboard" />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <NavLinks />
            {children}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {children}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/15 bg-[#fd6c13]">
            <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 md:px-6">
              <NavLinks isMobile onClose={() => setIsMobileMenuOpen(false)}>
                {children}
              </NavLinks>
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className={headerClassName} role="banner">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link
          href={backHref}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-white/95 transition hover:bg-white/10 hover:text-white sm:px-3"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          <span>{backLabel}</span>
        </Link>
        <Logo href="/dashboard" />
        {children}
      </div>
    </header>
  );
}
