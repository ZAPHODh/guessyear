import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { getCurrentSession } from "@/lib/server/auth/session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import LocaleSelector from "./locale-selector";
import { getCurrentLocale, getScopedI18n } from "@/locales/server";
import { logout } from "@/app/[locale]/actions";
import { Button } from "../ui/button";

export default async function AuthButton({
  className
}: {
  className?: string;
}) {
  const { user } = await getCurrentSession();
  const locale = await getCurrentLocale()
  const scopedT = await getScopedI18n("shared");
  if (!user) {
    return (
      <Button asChild size={'icon'}>
        <Link
          href={`/${locale}/login`}
          className={cn(
            "inline-flex items-center ",
            className
          )}
          aria-label="Login"
        >
          {scopedT('login')}
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0",
            className
          )}
          aria-label="User menu"
        >
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="h-full w-full object-cover"
            />
          ) : (
            <Avatar className="h-full w-full rounded-none">
              <AvatarFallback className="text-xs rounded-none">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/profile`}>
              {scopedT('sidebar.profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/settings`}>
              {scopedT('settings')}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LocaleSelector currentLocale={locale} />
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>

          <button onClick={() => logout()} className="w-full flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            {scopedT('logout')}
          </button>

        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}