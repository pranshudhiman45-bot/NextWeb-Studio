interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : ""}>
      <span
        className={align === "center" ? "eyebrow justify-center" : "eyebrow"}
      >
        {eyebrow}
      </span>
      <h2 className="section-title mt-6">{title}</h2>
      {description ? (
        <p className="muted-copy mt-6 max-w-2xl text-base sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
