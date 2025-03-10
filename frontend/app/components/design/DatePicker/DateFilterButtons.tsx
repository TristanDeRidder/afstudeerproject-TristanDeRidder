type DateFilterButtonsProps = {
  setSelectedDate: (date: string) => void;
  setShowDatePicker: (show: boolean) => void;
  buttonName: string;
  DateChange: number;
  Side: string;
};

export default function DateFilterButtons({
  setSelectedDate,
  setShowDatePicker,
  buttonName,
  DateChange,
  Side
}: DateFilterButtonsProps) {
  const handleDateChange = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    setSelectedDate(date.toISOString().split("T")[0]);
    setShowDatePicker(false);
  };

  return (
      <button
        onClick={() => handleDateChange(DateChange)}
        className={`border bg-dashboardSidebar py-2 px-6 hover:bg-dashboardPrimaryHelper transition-colors duration-300 ${
          Side === "left" ? "rounded-l-full" : "rounded-r-full"
        }`}
      >
        {buttonName}
      </button>
  );
}
