export default function PrimaryTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center w-9/12 md:w-2/3 lg:w-1/2 mx-auto">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
        {title}
      </h1>
      {subtitle && <h3 className="text-xl mt-2">{subtitle}</h3>}
    </div>
  );
}
