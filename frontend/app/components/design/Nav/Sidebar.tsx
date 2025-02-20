import { useEffect, useState } from "react";
import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

// API
import { getSidebars } from "../../../core/modules/sidebar/api";

export function AppSidebar() {
  const [items, setItems] = useState<{ title: string; url: string }[]>([]);

  useEffect(() => {
    async function fetchSidebarItems() {
      const response = await getSidebars();
      if (response?.data) {
        setItems(
          response.data.map((item: any) => ({
            title: item.PageTitle,
            url: item.URL,
          }))
        );
      }
    }

    fetchSidebarItems();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
