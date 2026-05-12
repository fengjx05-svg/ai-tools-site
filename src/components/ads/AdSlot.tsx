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
        className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm"
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
          <p className="font-medium">广告位</p>
          <p className="text-xs mt-1">AdSense Slot: {slot}</p>
        </div>
      </div>
    </div>
  );
}
