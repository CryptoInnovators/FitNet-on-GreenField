"use client"
import { About } from "@/components/About";
import { Cta } from "@/components/Cta";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Newsletter } from "@/components/Newsletter";
import { Pricing } from "@/components/Pricing";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Services } from "@/components/Services";
import { Sponsors } from "@/components/Sponsors";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  bscGreenfield,
  bscTestnet
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { greenFieldChain } from "@/config/wallet";
import { Navbar } from "@/components/Navbar";
import { GreenFieldContextProvider } from "@/context/GreenFieldContext";
import BucketPage from "@/components/Bucket";
import ObjectPage from "@/components/Object";
import GreenFieldPage from "./greenField";
import { Toaster } from "@/components/ui/toaster";

function App() {

  const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [bscTestnet, greenFieldChain],
    ssr: true,
  });

  const queryClient = new QueryClient();


  return (
    <>

      {/* <GreenFieldPage /> */}

      {/* <BucketPage /> */}
      {/* <ObjectPage /> */}
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />

    </>
  );
}

export default App;
