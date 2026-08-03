import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SiteHeader() {
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
          <Link className="transition-colors hover:text-orange-400" href="#vehicles">Vehicles</Link>
          <Link className="transition-colors hover:text-orange-400" href="#add-vehicle">Add Vehicle</Link>
          <Link className="transition-colors hover:text-orange-400" href="#maintenance">Log Maintenance</Link>
          <Button className="h-9 rounded-lg bg-orange-500 px-4 font-bold text-white hover:bg-orange-400">
            <Link href="#add-vehicle">+ New Vehicle</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
