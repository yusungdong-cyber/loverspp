"use client";

type Props = {
  code: string;
  onClose: () => void;
  eventUrl: string;
};

export default function SuccessModal({ code, onClose, eventUrl }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
        <h3 className="mb-3 text-2xl font-bold text-[#ff7f7f]">축하합니다! 경품 번호를 찾았어요.</h3>
        <p className="mb-4 text-sm text-slate-600">이 번호를 홈페이지 이벤트 페이지에 입력하면 선물을 받을 수 있어요.</p>
        <p className="mb-6 rounded-xl bg-[#fff6d9] px-4 py-3 text-3xl font-black tracking-[0.3em] text-[#7d5a00]">{code}</p>

        <a
          href={`${eventUrl}?code=${code}`}
          target="_blank"
          rel="noreferrer"
          className="mb-2 block w-full rounded-xl bg-[#ff8c8c] px-4 py-3 font-bold text-white"
        >
          경품 받으러 가기
        </a>
        <button className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
