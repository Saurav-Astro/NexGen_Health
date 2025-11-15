import Link from 'next/link';
import { Logo } from './logo';
import { footerLinks } from '@/lib/data';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const mainLinks = [
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
    { href: "/contact", label: "Contact" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ]

  return (
    <footer className="border-t border-white/10 bg-transparent">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} NexGen Health. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {mainLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
