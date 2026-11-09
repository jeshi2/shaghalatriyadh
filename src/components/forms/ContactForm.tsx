"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { services } from "@/content/services";
import { buildWhatsAppUrl, composeWhatsAppMessage } from "@/lib/whatsapp";
import {
  contactFormLimits,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/validation";

const emptyValues: ContactFormValues = {
  name: "",
  phone: "",
  service: "",
  area: "",
  details: "",
};

const OTHER_SERVICE = "other";

type Status = "idle" | "submitting" | "sent";

/**
 * The site has no backend, so the form composes a WhatsApp message and hands
 * the visitor over to WhatsApp, where they can review it before sending.
 * Nothing is stored or transmitted anywhere else.
 */
export function ContactForm() {
  const t = useTranslations("contactForm");
  const tErrors = useTranslations("contactForm.errors");
  const tServices = useTranslations("services");
  const tWhatsApp = useTranslations("whatsapp.form");

  const formId = useId();
  const [values, setValues] = useState<ContactFormValues>(emptyValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const allowedServices = [
    ...services.map((service) => service.slug),
    OTHER_SERVICE,
  ];

  function fieldId(field: keyof ContactFormValues) {
    return `${formId}-${field}`;
  }

  function errorId(field: keyof ContactFormValues) {
    return `${formId}-${field}-error`;
  }

  function update(field: keyof ContactFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear the error as soon as the visitor edits the field again.
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  }

  function serviceLabel(slug: string) {
    return slug === OTHER_SERVICE
      ? t("serviceOther")
      : tServices(`${slug}.name`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateContactForm(values, allowedServices);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first invalid field so the error is announced.
      const firstField = Object.keys(nextErrors)[0] as keyof ContactFormValues;
      document.getElementById(fieldId(firstField))?.focus();
      return;
    }

    setStatus("submitting");

    const message = composeWhatsAppMessage([
      tWhatsApp("greeting", { name: values.name.trim() }),
      tWhatsApp("serviceLine", { service: serviceLabel(values.service) }),
      values.area.trim() && tWhatsApp("areaLine", { area: values.area.trim() }),
      values.phone.trim() &&
        tWhatsApp("phoneLine", { phone: values.phone.trim() }),
      tWhatsApp("detailsLine", { details: values.details.trim() }),
    ]);

    const url = buildWhatsAppUrl({ message });
    setSentUrl(url);
    setStatus("sent");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const describedBy = (field: keyof ContactFormValues) =>
    errors[field] ? errorId(field) : undefined;

  const inputClasses =
    "w-full rounded-card border border-ink-300 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 aria-[invalid=true]:border-brand-700";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("name")} className="font-semibold">
          {t("nameLabel")}
        </label>
        <input
          id={fieldId("name")}
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name")}
          placeholder={t("namePlaceholder")}
          maxLength={contactFormLimits.nameMax}
          className={inputClasses}
        />
        {errors.name ? (
          <p
            id={errorId("name")}
            className="text-sm font-medium text-brand-700"
          >
            {tErrors(errors.name)}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("service")} className="font-semibold">
          {t("serviceLabel")}
        </label>
        <select
          id={fieldId("service")}
          name="service"
          value={values.service}
          onChange={(event) => update("service", event.target.value)}
          aria-invalid={errors.service ? true : undefined}
          aria-describedby={describedBy("service")}
          className={inputClasses}
        >
          <option value="">{t("servicePlaceholder")}</option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {tServices(`${service.slug}.name`)}
            </option>
          ))}
          <option value={OTHER_SERVICE}>{t("serviceOther")}</option>
        </select>
        {errors.service ? (
          <p
            id={errorId("service")}
            className="text-sm font-medium text-brand-700"
          >
            {tErrors(errors.service)}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={fieldId("phone")} className="font-semibold">
            {t("phoneLabel")}
          </label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone")}
            placeholder={t("phonePlaceholder")}
            className={inputClasses}
          />
          {errors.phone ? (
            <p
              id={errorId("phone")}
              className="text-sm font-medium text-brand-700"
            >
              {tErrors(errors.phone)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={fieldId("area")} className="font-semibold">
            {t("areaLabel")}
          </label>
          <input
            id={fieldId("area")}
            name="area"
            type="text"
            value={values.area}
            onChange={(event) => update("area", event.target.value)}
            aria-invalid={errors.area ? true : undefined}
            aria-describedby={describedBy("area")}
            placeholder={t("areaPlaceholder")}
            maxLength={contactFormLimits.areaMax}
            className={inputClasses}
          />
          {errors.area ? (
            <p
              id={errorId("area")}
              className="text-sm font-medium text-brand-700"
            >
              {tErrors(errors.area)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={fieldId("details")} className="font-semibold">
          {t("detailsLabel")}
        </label>
        <textarea
          id={fieldId("details")}
          name="details"
          rows={5}
          value={values.details}
          onChange={(event) => update("details", event.target.value)}
          aria-invalid={errors.details ? true : undefined}
          aria-describedby={describedBy("details")}
          placeholder={t("detailsPlaceholder")}
          maxLength={contactFormLimits.detailsMax}
          className={inputClasses}
        />
        {errors.details ? (
          <p
            id={errorId("details")}
            className="text-sm font-medium text-brand-700"
          >
            {tErrors(errors.details)}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        variant="whatsapp"
        size="lg"
        disabled={status === "submitting"}
      >
        <WhatsAppIcon className="text-[1.15em]" />
        {status === "submitting" ? t("submitting") : t("submit")}
      </Button>

      <p className="text-xs text-ink-500">{t("privacyNote")}</p>

      {/* Announced on completion; the link covers blocked pop-ups. */}
      <div role="status" aria-live="polite" className="text-sm text-ink-600">
        {status === "sent" && sentUrl ? (
          <>
            <p>{t("success")}</p>
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-whatsapp-dark underline"
            >
              {t("successFallback")}
            </a>
          </>
        ) : null}
      </div>
    </form>
  );
}
