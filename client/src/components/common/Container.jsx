export default function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-[70vw] max-w-[1200px] ${className}`.trim()}>
      {children}
    </div>
  );
}
