import Container from "./Container";

export default function Footer() {
  return (
    <footer className="w-full py-10">
      <Container className="text-[0.6875rem]">
        Copyright © 1995-2025 eBay Inc. All Rights Reserved.{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebayinc.com/accessibility/"
        >
          Accessibility
        </a>
        ,{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebay.com/help/policies/member-behaviour-policies/user-agreement?id=4259"
        >
          User Agreement
        </a>
        ,{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebay.com/help/policies/member-behaviour-policies/user-privacy-notice-privacy-policy?id=4260"
        >
          Privacy
        </a>
        ,{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebayinc.com/company/privacy-center/privacy-notice/consumer-health-data-privacy-policy/"
        >
          Consumer Health Data
        </a>
        ,{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://pages.ebay.com/payment/2.0/terms.html"
        >
          Payments Terms of Use
        </a>
        ,{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebay.com/help/policies/member-behaviour-policies/ebay-cookie-notice?id=4267"
        >
          Cookies
        </a>
        ,{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebayinc.com/company/privacy-center/privacy-notice/state-privacy-disclosures/#california"
        >
          CA Privacy Notice
        </a>
        ,{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebay.com/adchoice/ccpa"
        >
          Your Privacy Choices
        </a>{" "}
        and{" "}
        <a
          className="underline text-[rgb(0,58,165)]"
          href="https://www.ebay.com/adchoice"
        >
          AdChoice
          <span className="font-bold border-2 rounded-full px-1 scale-50">
            i
          </span>
        </a>
      </Container>
    </footer>
  );
}
