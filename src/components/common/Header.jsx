import Container from "./Container";
import EbayLogo from "../../assets/ebay-logo.svg?react";

export default function Header() {
  return (
    <header className="w-full mt-3">
      <Container className="flex items-end justify-between">
        <div className="flex items-end gap-1">
          <EbayLogo />
          <p className="text-3xl font-bold">Checkout</p>
        </div>
        <div className="text-[0.875rem] font-medium">
          How do you like our checkout?{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://connect.ebay.com/srv/survey/a/cxo.ryp.payments2"
            className="underline"
          >
            Give us feedback
          </a>
        </div>
      </Container>
    </header>
  );
}
