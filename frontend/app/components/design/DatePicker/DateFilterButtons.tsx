type DateFilterButtonsProps = {
  SelectedDate: string;
  setSelectedDate: (date: string) => void;
  buttonName: string;
  DateChange: number; // Positive for next days, negative for previous days
  Side: "left" | "right";
};

/**
 * A button component that changes the selected date by a specified amount.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.SelectedDate - The currently selected date in ISO format (YYYY-MM-DD).
 * @param {function} props.setSelectedDate - Function to update the selected date.
 * @param {string} props.buttonName - The name to be displayed on the button.
 * @param {number} props.DateChange - The number of days to change the selected date by.
 * @param {string} props.Side - Determines the button's rounded side, either "left" or "right".
 * @returns {JSX.Element} The rendered button component.
 */

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
