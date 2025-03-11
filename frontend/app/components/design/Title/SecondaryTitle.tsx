export default function SecondaryTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mt-10 mb-3 md:mb-4 lg:mb-5">
      <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold">{title}</h2>
      {subtitle && (
        <h3 className="text-lg md:text-xl lg:text-xl mt-2">{subtitle}</h3>
      )}
    </div>
  );
}
