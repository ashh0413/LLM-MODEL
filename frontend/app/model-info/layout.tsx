import SidebarLayout from "@/components/SidebarLayout";

export default function ModelInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
