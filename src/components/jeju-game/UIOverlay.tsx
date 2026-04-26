"use client";

type Props = {
  timerLabel: string;
  hint: string;
  onHint: () => void;
  found: boolean;
};

export default function UIOverlay({ timerLabel, hint, onHint, found }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">탐험 시간: {timerLabel}</p>
        <button
          onClick={onHint}
          className="rounded-full bg-[#87c8ff] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={found}
        >
          힌트 보기
        </button>
      </div>

      <div className="rounded-2xl bg-[#f6fbff] px-4 py-3 text-sm text-slate-700 shadow-sm">
        💡 {hint}
      </div>
    </div>
  );
}
