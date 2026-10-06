import SidebarLayout from "@/components/SidebarLayout";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
