
import './globals.css'
import Header from '@/components/Header';

export const metadata = {
  title: 'WTAC Workforce Calculator',
  description: 'MVP calculator for staffing needs (FTE)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container-narrow">{children}</main>
      </body>
    </html>
  );
}
