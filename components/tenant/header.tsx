"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/modules/auth/auth.actions";
import { TenantUserContext } from "@/modules/tenant/tenant-user.model";
import {
  CircleUserRoundIcon,
  NotepadTextIcon,
  PowerIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";

interface TenantHeaderProps {
  profile: TenantUserContext;
}

const profileMenu = [
  { name: "Profile", icon: CircleUserRoundIcon, href: "/profile" },
  { name: "Reports", icon: NotepadTextIcon, href: "/reports" },
  { name: "Settings", icon: SettingsIcon, href: "/settings" },
];

export const TenantHeader = ({ profile }: TenantHeaderProps) => {
  const handleLogout = async () => {
    await signOut();
    redirect("/login");
  };

  return (
    <header className="h-15 border-b flex items-center px-6">
      <div>header</div>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto">
          <Avatar className="rounded-sm">
            <AvatarImage
              src="http://baiki.test/images/profile.webp"
              alt="@evilrabbit"
              className="rounded-sm"
            />
            <AvatarFallback>BK</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 px-2">
          <DropdownMenuLabel className="px-0">
            <div className="flex gap-2 bg-accent/80 p-4 rounded-sm items-center">
              <div className="h-10 w-10 relative flex items-center">
                <Image
                  src="http://baiki.test/images/profile.webp"
                  alt="Profile"
                  fill
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div>
                <p className="text-sm text-gray-900">{profile.user.name}</p>
                <p className="capitalize">{profile.user.role.toLowerCase()}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          {profileMenu.map(({ href, icon: Icon, name }) => (
            <DropdownMenuItem
              key={name}
              asChild
              className="py-2 px-4 my-1 text-gray-700 focus:bg-app-light-primary/50  focus:text-app-brand-primary"
            >
              <Link href={href} className="flex items-center gap-2 ">
                <Icon />
                <span>{name}</span>
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="py-2 px-4 my-1 text-app-system-danger focus:bg-app-light-danger/50 focus:text-app-system-danger flex items-center gap-2"
          >
            <PowerIcon />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
