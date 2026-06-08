import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://atelier-furniture.com";
const TITLE = "Atelier — Premium Furniture Manufacturing";
const DESCRIPTION =
  "Atelier crafts premium furniture manufacturing solutions for residential, commercial and custom projects. Bespoke wardrobes, modular kitchens and engineered cabinetry — designed and built under one roof.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Atelier Furniture",
  },
  description: DESCRIPTION,
  keywords: [
    "furniture manufacturing",
    "custom furniture",
    "modular kitchens",
    "bespoke wardrobes",
    "engineered cabinetry",
    "commercial fit-outs",
    "luxury furniture",
    "turnkey interiors",
  ],
  authors: [{ name: "Atelier Furniture" }],
  creator: "Atelier Furniture",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Atelier Furniture",
    locale: "en_IN",
    images: [
      {
        url: "/renders/wardrobe-hero.jpg",
        width: 1600,
        height: 1280,
        alt: "Custom modular wardrobe crafted by Atelier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/renders/wardrobe-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Manufacturing",
};

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Atelier Furniture Manufacturing",
      url: SITE_URL,
      description: DESCRIPTION,
      foundingDate: "2000",
      areaServed: "Worldwide",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressCountry: "IN",
      },
      sameAs: [],
    },
    {
      "@type": ["LocalBusiness", "FurnitureStore"],
      "@id": `${SITE_URL}/#business`,
      name: "Atelier Furniture Manufacturing",
      image: `${SITE_URL}/renders/wardrobe-hero.jpg`,
      url: SITE_URL,
      priceRange: "₹₹₹",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressCountry: "IN",
      },
      makesOffer: [
        "Custom Wardrobe Systems",
        "Modular Kitchens",
        "Engineered Cabinetry",
        "Commercial Fit-outs",
        "Bespoke Furniture",
      ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name } })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Atelier Furniture",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper">{children}</body>
    </html>
  );
}
