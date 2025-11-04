import Header from "./components/common/Header";
import Layout from "./components/layout/Layout";
import Footer from "./components/common/Footer";
import Banner from "./components/common/Banner";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Header />
      <Banner />
      <Layout />
      <Footer />
    </CartProvider>
  );
}
