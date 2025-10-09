"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Menu, X, User as UserIcon, Settings, LogOut, Bell, MessageSquare } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User } from "@/types"
import { getInitials } from "@/lib/utils"
import { logout } from "@/app/[locale]/actions"
import { useCurrentLocale } from "@/locales/client"
import { siteConfig } from "@/config/site"

interface NavbarProps {
    user: User | null
    headerText: {
        daily: string,
        lobby: string,
        login: string
        account: string
        about: string
        out: string,
        profile: string,
        settings: string
    }
}

export default function Navbar({ user, headerText }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const locale = useCurrentLocale()

    return (
        <nav className="flex h-full items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/" className="text-2xl font-bold text-foreground">
                    {siteConfig(locale).name}
                </Link>


                <div className="hidden md:flex items-center gap-6">
                    <Link href="/daily" className="text-foreground hover:text-primary transition-colors">
                        {headerText.daily}
                    </Link>
                </div>
            </div>

            {user ? (
                <div className="hidden md:flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="w-4 h-4" />
                        {1 > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                            >
                                {1}
                            </Badge>
                        )}
                    </Button>

                    <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                    </Button>



                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name || 'user'} />
                                    <AvatarFallback>
                                        {user.name ? getInitials(user.name, 2) : getInitials(user.email ?? "", 2)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>{headerText.profile}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>{headerText.settings}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={async () => {
                                await logout();
                            }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{headerText.out}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (

                <div className="hidden md:flex items-center gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/login">
                            {headerText.login}
                        </Link>
                    </Button>
                </div>
            )}
            <button
                className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isMobileMenuOpen && (
                <div className="absolute top-20 left-0 right-0 bg-card border-b shadow-lg md:hidden">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/daily"
                                className="text-foreground hover:text-primary transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {headerText.daily}
                            </Link>

                            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 py-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.picture as string} alt={user.name || "User"} />
                                                <AvatarFallback>
                                                    {user.name ? getInitials(user.name, 2) : getInitials(user.email ?? "", 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>

                                        <Button className="w-full" onClick={
                                            async () => {
                                                await logout();
                                            }
                                        }>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sair
                                        </Button> */
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outline" className="w-full bg-transparent" asChild>
                                            <Link href="/login">

                                                {headerText.login}

                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </div >
            )
            }
        </nav >
    )
}
