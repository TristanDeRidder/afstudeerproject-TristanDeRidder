export default function DashboardCard({data, title} : {data: any, title: string}) {
    return (
      <div className="bg-accentLight p-4 rounded-lg w-1/3 h-full">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-xl">{data}</p>
      </div>
    );
}