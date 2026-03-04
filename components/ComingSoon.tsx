export default function ComingSoon({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
      <div className="max-w-5xl">
        <div className="mb-4">
          <div className="text-[22px] font-bold text-black">{title}</div>
          {subtitle && <div className="text-[13px] text-black/50 mt-1">{subtitle}</div>}
        </div>
        <div className="rounded-xl border border-[#d1d1d6] bg-white p-10 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[16px] font-semibold text-black">{title}</div>
            <div className="text-[13px] text-black/50 mt-2">Dolazi uskoro – stranica je u izradi</div>
          </div>
        </div>
      </div>
    );
  }