'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo gradient-text">
          SpectraMatch
        </Link>

        <ul className="nav-links">
          <li>
            <Link 
              href="/test" 
              className={`nav-link ${pathname === '/test' ? 'nav-link--active' : ''}`}
            >
              Test
            </Link>
          </li>
          <li>
            <Link 
              href="/matches" 
              className={`nav-link ${pathname === '/matches' ? 'nav-link--active' : ''}`}
            >
              Matches
            </Link>
          </li>
          <li>
            <Link 
              href="/profile" 
              className={`nav-link ${pathname === '/profile' ? 'nav-link--active' : ''}`}
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
