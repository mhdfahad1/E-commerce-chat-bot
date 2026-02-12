import './globals.css';

export const metadata = {
  title: 'ShopAI – AI-Powered E-commerce Assistant',
  description:
    'A mini AI-powered e-commerce chatbot that helps customers find products, compare prices, and get instant support.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
