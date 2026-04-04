'use client'

import { cn } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const navItems = [
  {label: 'library', href: '/'},
  {label: 'Add New', href: '/books/new'}
]

const Navbar = () => {

  const pathname = usePathname();
  const { user } = useUser()

  return (
    <header className="w-full fixed z-50 bg-(--bg-primary)">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link href={'/'} className="flex gap-0.5 items-center">
          <Image src={'/assets/logo.png'} alt="Read Buddy" width={42} height={26}/>
          <span className="logo-text">Read Buddy</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          {navItems.map(({label, href}) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            
            return (
              <Link href={href} key={label} className={cn("nav-link-base", isActive ? "nav-link-active" : "text-black hover:opacity-70")}>
                {label}
              </Link>
            )
          })}

          <Show when="signed-out">
            <SignInButton>
              <button className="nav-btn">Sign In</button>
            </SignInButton>
            <SignUpButton>
              <button className="btn-primary text-sm px-4! py-2!">Sign Up</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <div className="nav-user-link">
            <UserButton />
            {user?.firstName && (
              <Link href={'/subscription'} className="nav-user-name">
                {user.firstName}
              </Link>
            )}

            </div>
          </Show>
        </nav>

      </div>
    </header>
  )
}

export default Navbar