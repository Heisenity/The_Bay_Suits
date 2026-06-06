export default function Loading() {
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#fbfaf7]">
      <div className="text-center">
        <div className="estate-loader mx-auto" aria-hidden="true">
          <span className="estate-loader-roof" />
          <span className="estate-loader-home">
            <i />
            <i />
            <i />
          </span>
          <span className="estate-loader-key" />
        </div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.28em] text-ink/45">
          Preparing your stay
        </p>
      </div>
    </div>
  );
}
