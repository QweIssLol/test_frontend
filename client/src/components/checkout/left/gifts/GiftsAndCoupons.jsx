const GiftsAndCoupons = () => {
  return (
    <div className="py-8 border-b border-b-[rgb(229,229,229)]">
      <p className="text-2xl font-bold pb-6">Gift cards and coupons</p>
      <p className="text-[0.875rem] pb-1">
        Apply coupons or add eBay gift cards to your account. Once added, gift cards can't be removed.
      </p>
      <div className="flex gap-4 items-start mt-4">
        <input type="text" placeholder="Enter code:" className="px-4 pb-2 pt-4 border border-gray-700 rounded-xl" />
        <button className="cursor-not-allowed rounded-3xl bg-[rgb(199,199,199)] text-white px-10 font-bold h-12">Apply</button>
      </div>
    </div>
  );
};

export default GiftsAndCoupons;


