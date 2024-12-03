export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="mx-12 mt-12">{children}</main>
    </>
  );
}
