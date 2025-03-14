type DateFilterButtonsProps = {
  SelectedDate: string;
  setSelectedDate: (date: string) => void;
  buttonName: string;
  DateChange: number; // Positive for next days, negative for previous days
  Side: "left" | "right";
};

export default function DateFilterButtons({
  SelectedDate,
  setSelectedDate,
  buttonName,
  DateChange,
  Side
}: DateFilterButtonsProps) {
  const handleDateChange = () => {
    const currentDate = new Date(SelectedDate);
    currentDate.setDate(currentDate.getDate() + DateChange);
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  return (
    <button
      onClick={handleDateChange}
      className={`border bg-dashboardSidebar py-2 px-6 hover:bg-dashboardPrimaryHelper transition-colors duration-300 ${
        Side === "left" ? "rounded-l-full" : "rounded-r-full"
      }`}
    >
      {buttonName}
    </button>
  );
}
