'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const NAV_LINKS = [
  { href: '#vehicles', label: 'Vehicles' },
  { href: '#add-vehicle', label: 'Add Vehicle' },
  { href: '#maintenance', label: 'Log Maintenance' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-white/15 bg-[#0d0906]">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-6 px-6 lg:px-11">
        <Link href="/" className="flex items-center gap-3" aria-label="GarageQL home">
          <span className="flex size-8 rotate-[-6deg] items-center justify-center rounded-lg bg-orange-500 text-lg font-bold text-black">
            <span className="rotate-[6deg]">G</span>
          </span>
          <span className="text-lg font-bold tracking-tight text-stone-100">GarageQL</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-stone-300 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} className="transition-colors hover:text-orange-400" href={link.href}>
              {link.label}
            </Link>
          ))}
          <Button className="h-9 rounded-lg bg-orange-500 px-4 font-bold text-white hover:bg-orange-400">
            <Link href="#add-vehicle">+ New Vehicle</Link>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-100 hover:bg-white/10 md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="border-white/15 bg-[#0d0906]">
            <SheetHeader>
              <SheetTitle className="text-stone-100">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6 px-4 text-sm font-bold text-stone-300" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className="transition-colors hover:text-orange-400"
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className="h-9 w-full rounded-lg bg-orange-500 px-4 font-bold text-white hover:bg-orange-400"
                onClick={() => setOpen(false)}
              >
                <Link href="#add-vehicle">+ New Vehicle</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
