import { FooterMain } from "@/components/base/footer/footer-main";
import { Navbar } from "@/components/base/navbar/navbar-main";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      < Navbar/>
      {children}
      < FooterMain/>
    </div>
  );
}
