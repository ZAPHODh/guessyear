'use client';

import { usePathname } from 'next/navigation';
import Navbar from "./navbar";
import { User } from '@prisma/client';

interface HeaderWrapperProps {
    headerText: {
        daily: string;
        lobby: string;
        login: string;
        account: string;
        about: string;
        out: string;
        settings: string;
        profile: string;
    };
    user: User | null;
}

export default function HeaderWrapper({ headerText, user }: HeaderWrapperProps) {
    const pathname = usePathname();

    if (pathname.includes('/daily')) {
        return null;
    }

    return (
        <header className="h-20 w-full">
            <div className="container h-full mx-auto px-4">
                <Navbar headerText={headerText} user={user} />
            </div>
        </header>
    );
}