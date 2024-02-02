import MainLayout from "@/components/MainLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode; // 使用React.ReactNode类型来定义children
}) {
  return <MainLayout>{children}</MainLayout>;
}
