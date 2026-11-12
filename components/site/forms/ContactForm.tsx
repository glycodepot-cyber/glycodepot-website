"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Check, AlertCircle, Send } from "lucide-react";
import { BrandButton } from "@/components/primitives";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { contactPage } from "@/lib/content";
import { CONTACT_MARKETING_CONSENT_TEXT } from "@/lib/content/consent";
import { submitContact } from "@/lib/cart/actions";
import { HoneypotField, useFormGuard } from "@/components/site/forms/FormGuard";

const fields = contactPage.form.fields;

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const consentId = useId();
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    subject: fields.subject.options[0],
    message: "",
  });
  const [marketingConsent, setMarketingConsent] = useState(false);
  const formGuard = useFormGuard();
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key as keyof FormErrors]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!emailRegex.test(values.email)) next.email = "Enter a valid email.";
    if (values.message.trim().length < 10)
      next.message = "Add a few more details so we can route this correctly.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setSubmitError(null);
    const result = await submitContact({
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
      marketingConsent,
      guard: formGuard.read(),
    });
    if (result.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setSubmitError(result.error);
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-success)] bg-[var(--color-success)]/5 p-8"
      >
        <span className="grid size-11 place-items-center rounded-full bg-[var(--color-success)] text-white">
          <Check className="size-5" />
        </span>
        <h3 className="type-h3 text-[var(--color-foreground)]">
          {contactPage.form.successTitle}
        </h3>
        <p className="text-[15px] text-[var(--color-muted-foreground)]">
          {contactPage.form.successBody}
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-5">
      <HoneypotField inputRef={formGuard.hpRef} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label={fields.name.label}
          error={errors.name}
        >
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder={fields.name.placeholder}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>
        <Field
          id="email"
          label={fields.email.label}
          error={errors.email}
        >
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={fields.email.placeholder}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
      </div>

      <Field id="subject" label={fields.subject.label}>
        <select
          id="subject"
          name="subject"
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-foreground)] outline-none transition-colors hover:border-[var(--color-border-strong)] focus:border-[var(--color-brand)]"
        >
          {fields.subject.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label={fields.message.label} error={errors.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={fields.message.placeholder}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3 text-sm leading-relaxed text-[var(--color-foreground)] outline-none transition-colors",
            "placeholder:text-[var(--color-muted)]",
            "hover:border-[var(--color-border-strong)] focus:border-[var(--color-brand)]",
          )}
        />
      </Field>

      <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-muted-background,transparent)] p-4">
        <div className="flex gap-2.5">
          <input
            id={consentId}
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand)]"
          />
          <label
            htmlFor={consentId}
            className="text-[13px] leading-relaxed text-[var(--color-muted-foreground)]"
          >
            {CONTACT_MARKETING_CONSENT_TEXT}
          </label>
        </div>
        <p className="text-[12px] leading-relaxed text-[var(--color-muted)]">
          You don&rsquo;t need to tick this for us to answer you — we&rsquo;ll
          reply either way. We use your details to handle your enquiry and keep
          a record of it; see our{" "}
          <Link
            href="/legal/privacy"
            className="underline underline-offset-2 hover:text-[var(--color-brand)]"
          >
            privacy notice
          </Link>{" "}
          for how long we keep it and how to ask for a copy or its deletion.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <BrandButton type="submit" disabled={status === "loading"}>
          <Send className="size-4" />
          {status === "loading" ? "Sending…" : contactPage.form.submitLabel}
        </BrandButton>
        <p className="text-[13px] text-[var(--color-muted)]">
          We reply within one business day.
        </p>
      </div>

      {submitError ? (
        <p
          role="alert"
          className="flex items-start gap-1.5 text-[13px] text-[var(--color-danger)]"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {submitError}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[14px] font-medium text-[var(--color-foreground)]">
        {label}
      </Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-[13px] text-[var(--color-danger)]"
        >
          <AlertCircle className="size-3.5" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}
