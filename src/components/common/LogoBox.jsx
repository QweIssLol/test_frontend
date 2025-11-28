export default function LogoBox({ size = "md", className = "", children }) {
  const base = "flex items-center justify-center bg-white border px-1";
  const dims = size === "sm" ? "w-[32px] h-[20px]" : "w-[52px] h-[34px]";
  return (
    <div className={`${base} ${dims} ${className}`.trim()}>{children}</div>
  );
}
