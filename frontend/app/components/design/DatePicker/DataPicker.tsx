import DateFilterButtons from "./DateFilterButtons";

type DatepickerProps = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
};

/**
 * Datepicker component that allows users to select a date and navigate between dates.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.selectedDate - The currently selected date.
 * @param {Function} props.setSelectedDate - Function to update the selected date.
 * @param {boolean} props.showDatePicker - Boolean to control the visibility of the date picker.
 * @param {Function} props.setShowDatePicker - Function to toggle the visibility of the date picker.
 *
 * @returns {JSX.Element} The rendered Datepicker component.
 */
export default function Datepicker({
  selectedDate,
  setSelectedDate,
  showDatePicker,
  setShowDatePicker,
}: DatepickerProps) {

  return (
    <div className="flex items-center">
      <DateFilterButtons
        SelectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        buttonName="-1 dag"
        DateChange={-1}
        Side="left"
      />
      <div className="relative border-y bg-dashboardSidebar py-2 px-6 hover:bg-dashboardPrimaryHelper transition-colors duration-300">
        <button onClick={() => setShowDatePicker(!showDatePicker)}>
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString("nl-BE")
            : "Select a date"}
        </button>

        {showDatePicker && (
          <div className="absolute top-full mt-2 bg-dashboardBg border rounded-md shadow-md p-4 z-10">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowDatePicker(false);
              }}
              className="dashboardBg"
            />
          </div>
        )}
      </div>
      <DateFilterButtons
        SelectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        buttonName="+1 dag"
        DateChange={1}
        Side="right"
      />
    </div>
  );
}
