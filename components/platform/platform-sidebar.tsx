"use client";

import { TeamSwitcher } from "@/components/team-switcher";
import { SearchForm } from "@/components/ui/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  enablePlatformSideNav,
  initialPlaformSideNavState,
  platformSideNav,
} from "@/lib/platform-sidenav";
import { cn } from "@/lib/utils";
import { RiExpandUpDownLine, RiLogoutBoxLine } from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

// This is sample data.
const data = {
  teams: [
    {
      name: "Baiki",
      logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png",
    },
  ],
};

export function PlatformSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [toggleSection, setToggleSection] = useState<Record<string, boolean>>(
    initialPlaformSideNavState
  );

  const pathname = usePathname();

  const handleToggleSection = (key: string) => {
    setToggleSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <hr className="border-t border-border mx-2 -mt-px" />
        <SearchForm className="mt-3" />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {platformSideNav.map((item) => (
          <SidebarGroup
            key={item.id}
            className={cn(!enablePlatformSideNav[item.id] && "hidden")}
          >
            {item.title && (
              <Button
                variant="ghost"
                className="flex w-full cursor-pointer px-2"
                onClick={() => handleToggleSection(item.id)}
              >
                <SidebarGroupLabel className="uppercase text-muted-foreground/60">
                  {item.title}
                </SidebarGroupLabel>
                <RiExpandUpDownLine
                  className="ms-auto text-muted-foreground/60"
                  size={20}
                  aria-hidden="true"
                />
              </Button>
            )}
            <SidebarGroupContent
              className={cn(
                "px-2",
                !toggleSection[item.id] && item.title && "hidden"
              )}
            >
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                      isActive={pathname.startsWith(item.url)}
                    >
                      <Link href={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto">
              <RiLogoutBoxLine
                className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                size={22}
                aria-hidden="true"
              />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
