export default function PrimaryTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      {subtitle && <h3 className="text-xl mt-2">{subtitle}</h3>}
    </div>
  );
}
