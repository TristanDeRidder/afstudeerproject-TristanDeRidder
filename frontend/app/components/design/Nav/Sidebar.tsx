import {
  House,
  Bolt,
  Inbox,
  BookOpen,
  Smartphone,
  CreditCard,
  List,
} from "lucide-react";

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

interface SidebarItem {
  title: string;
  url: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  House,
  Bolt,
  Inbox,
  BookOpen,
  Smartphone,
  CreditCard,
  List,
};

const customOrder = [
  "Home",
  "Contacts",
  "Devices",
  "Invoices",
  "Order",
  "Repairorders",
  "Detail",
];

export function AppSidebar({ items }: { items: SidebarItem[] }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .sort((a, b) => {
                  const indexA = customOrder.indexOf(a.title);
                  const indexB = customOrder.indexOf(b.title);

                  return (
                    (indexA !== -1 ? indexA : 999) -
                    (indexB !== -1 ? indexB : 999)
                  );
                })
                .map((item) => {
                  const IconComponent = iconMap[item.icon] || List;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
