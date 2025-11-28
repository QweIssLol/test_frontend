import Container from "../common/Container";
import Payment from "../checkout/left/Payment";
import OrderConfirmation from "../checkout/right/OrderConfirmation";
import ShippingAddress from "../checkout/left/shipping/ShippingAddress";
import ReviewOrder from "../checkout/left/review/ReviewOrder";
import GiftsAndCoupons from "../checkout/left/gifts/GiftsAndCoupons";

export default function Layout() {
  return (
    <section>
      <Container>
        <div className="grid grid-cols-5 gap-4">
          <aside className="col-span-3">
            <Payment />
            <ShippingAddress />
            <ReviewOrder />
            <GiftsAndCoupons />
          </aside>

          <aside className="col-span-2">
            <OrderConfirmation />
          </aside>
        </div>
      </Container>
    </section>
  );
}


