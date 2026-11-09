type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Renders a JSON-LD block. `<` is escaped so a stray character in content can
 * never close the script tag early.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
