export default function AdSlot({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <div
        className="bg-slate-50/80 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm"
        style={{
          minHeight:
            format === "horizontal"
              ? 90
              : format === "vertical"
                ? 600
                : 250,
          width: "100%",
          maxWidth: 728,
        }}
      >
        <div className="text-center">
          <p className="font-medium text-slate-400">AdSense 广告位</p>
          <p className="text-xs mt-1 text-slate-300">{slot}</p>
        </div>
      </div>
    </div>
  );
}
