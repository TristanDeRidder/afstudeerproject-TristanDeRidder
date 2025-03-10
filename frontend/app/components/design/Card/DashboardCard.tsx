export default function DashboardCard({data, title, subtitle} : {data: any, title: string, subtitle?: string}) {
    return (
      <div className="bg-dashboardSidebar px-4 py-6 rounded-lg w-1/3 h-full flex flex-col gap-5">
        <div className="flex items-center gap-2">
        <h4 className="text-lg font-semibold">{title}</h4>
        {subtitle && <p className="text-sm bg-dashboardPrimaryHelper text-dashboardText rounded-full px-2">{subtitle}</p>}
        </div>
        <p className="text-4xl">{data}</p>
      </div>
    );
};