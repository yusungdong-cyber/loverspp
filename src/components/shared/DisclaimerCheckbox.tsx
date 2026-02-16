"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DISCLAIMER_TEXT } from "@/lib/constants";

interface DisclaimerCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function DisclaimerCheckbox({ checked, onCheckedChange }: DisclaimerCheckboxProps) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id="disclaimer"
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor="disclaimer" className="text-sm text-yellow-800 leading-relaxed cursor-pointer">
          {DISCLAIMER_TEXT}{" "}
          위 내용을 이해하고 동의합니다. 모든 거래 관련 판단과 책임은 거래 당사자에게 있음을 확인합니다.
        </Label>
      </div>
    </div>
  );
}
