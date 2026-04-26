"use client";

import { useEffect, useMemo, useState } from "react";
import GameScene from "./GameScene";
import { getHintByCount } from "./HintSystem";
import { selectCodeSpot } from "./CodeObject";
import SuccessModal from "./SuccessModal";
import UIOverlay from "./UIOverlay";

const STORAGE_KEYS = {
  discovered: "jeju_treasure_discovered",
  claimedAt: "jeju_treasure_claimed_at",
  sessionCode: "jeju_treasure_code",
} as const;

// Change the event website URL here.
const EVENT_URL = "https://example.com/event";
// Change fixed prize code here when needed. Leave null for random 4 digits.
const FIXED_CODE: string | null = null;
const CLAIM_COOLDOWN_MINUTES = 10;

function createCode() {
  if (FIXED_CODE) return FIXED_CODE;
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function JejuTreasureApp() {
  const [code, setCode] = useState("0000");
  const [discovered, setDiscovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hintCount, setHintCount] = useState(0);

  useEffect(() => {
    const fromSession = sessionStorage.getItem(STORAGE_KEYS.sessionCode);
    if (fromSession) {
      setCode(fromSession);
    } else {
      const fresh = createCode();
      sessionStorage.setItem(STORAGE_KEYS.sessionCode, fresh);
      setCode(fresh);
    }

    const claimedAt = Number(localStorage.getItem(STORAGE_KEYS.claimedAt) || "0");
    const discoveredState = localStorage.getItem(STORAGE_KEYS.discovered) === "true";
    const stillCooling = Date.now() - claimedAt < CLAIM_COOLDOWN_MINUTES * 60 * 1000;
    if (discoveredState && stillCooling) {
      setDiscovered(true);
    }
  }, []);

  useEffect(() => {
    if (discovered) return;
    const id = window.setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, [discovered]);

  const seed = useMemo(() => Number(code) || 0, [code]);
  const codeSpot = useMemo(() => selectCodeSpot(seed), [seed]);

  const onDiscover = () => {
    setDiscovered(true);
    setShowSuccess(true);
    localStorage.setItem(STORAGE_KEYS.discovered, "true");
    localStorage.setItem(STORAGE_KEYS.claimedAt, String(Date.now()));
  };

  const timerLabel = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6 md:py-10">
      <div className="rounded-3xl bg-gradient-to-r from-[#d7f3ff] via-[#ffeef7] to-[#fff4d9] p-6 shadow-lg">
        <h1 className="text-2xl font-black text-slate-800 md:text-4xl">제주 보물찾기 3D 이벤트</h1>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          바다, 감귤밭, 돌담 마을을 탐험하고 숨겨진 4자리 경품 번호를 찾아보세요.
        </p>
      </div>

      <UIOverlay timerLabel={timerLabel} hint={getHintByCount(hintCount)} onHint={() => setHintCount((v) => v + 1)} found={discovered} />

      <GameScene code={code} codeSpot={codeSpot} onDiscovered={onDiscover} discovered={discovered} />

      {showSuccess && <SuccessModal code={code} onClose={() => setShowSuccess(false)} eventUrl={EVENT_URL} />}
    </section>
  );
}
