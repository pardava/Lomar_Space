import { Inter, Instrument_Serif } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ed-sans",
  weight: ["300", "400", "500"],
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-ed-serif",
  weight: "400",
  style: ["normal", "italic"],
});