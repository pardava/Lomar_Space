'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FloatingNav from './FloatingNav';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/catalog' },
  { label: 'AI Studio', href: '/ai' },
];

export default function AppNav() {
  const pathname = usePathname();
  return <FloatingNav links={LINKS} currentPath={pathname} LinkComponent={Link} uploadHref="/ai" />;
}