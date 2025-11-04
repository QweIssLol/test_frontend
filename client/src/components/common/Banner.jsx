import BannerLogo from "../../assets/paypal-logo.svg?react";
import Container from "./Container";
import LogoBox from "./LogoBox";

export default function Banner() {
  return (
    <div>
      <Container className="overflow-y-hidden gap-3 bg-[rgb(211,239,254)] flex items-center p-4 my-8 text-[0.875rem] h-16 rounded-lg">
        <LogoBox>
          <BannerLogo
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          />
        </LogoBox>
        <div className="banner-graph-content">
          Buy with PayPal. It's fast and simple.
        </div>
      </Container>
    </div>
  );
}
