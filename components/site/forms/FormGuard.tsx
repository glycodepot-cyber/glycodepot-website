"use client";

import { useEffect, useId, useRef } from "react";
import type { FormGuard } from "@/lib/spam/guard";

const HONEYPOT_FIELD = "website_url";

/**
 * Anti-bot helpers for public forms. Pair <HoneypotField /> inside the <form>
 * with `read()` at submit time and pass the result to the Server Action, which
 * checks it with `spamReason()` from lib/spam/guard.
 */
export function useFormGuard() {
  const startedAt = useRef<number | null>(null);
  const hp = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAt.current === null) startedAt.current = Date.now();
  }, []);

  function read(): FormGuard {
    return { hp: hp.current?.value ?? "", t: startedAt.current ?? undefined };
  }

  return { hpRef: hp, read };
}

/**
 * Visually hidden, unreachable by keyboard, ignored by screen readers and
 * password managers. Real visitors never fill it; form-filling bots do.
 */
export function HoneypotField({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const id = `${HONEYPOT_FIELD}-${useId()}`;
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
    >
      <label htmlFor={id}>Leave this field empty</label>
      <input
        ref={inputRef}
        id={id}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        defaultValue=""
      />
    </div>
  );
}
