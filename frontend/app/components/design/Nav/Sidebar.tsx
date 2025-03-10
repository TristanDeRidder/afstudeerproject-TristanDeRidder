interface SidebarItem {
  title: string;
  url: string;
  icon: string;
}



const customOrder = [
  "Home",
  "Contacts",
  "Devices",
  "Invoices",
  "Order",
  "Repairorders",
  "Detail",
  "Website"
];

export function AppSidebar({ items }: { items: SidebarItem[] }) {

}
