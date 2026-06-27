export default function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-xl">
      <p
        className="text-xs font-mono tracking-widest uppercase mb-3"
        style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
      >
        {label}
      </p>
      <h2
        className="text-2xl md:text-3xl font-bold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
