import AppFooter from "@/components/layouts/app-layout/app-footer";
import AppHeader from "@/components/layouts/app-layout/app-header";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex flex-1 flex-col pt-16">{children}</main>

      <AppFooter />
    </div>
  );
}
