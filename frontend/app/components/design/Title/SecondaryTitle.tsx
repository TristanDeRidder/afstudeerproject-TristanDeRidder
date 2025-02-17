export default function SecondaryTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold">{title}</h2>
      {subtitle && <h3 className="text-xl mt-2">{subtitle}</h3>}
    </div>
  );
}
