import DateFilterButtons from "./DateFilterButtons";

type DatepickerProps = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
};

export default function Datepicker({
  selectedDate,
  setSelectedDate,
  showDatePicker,
  setShowDatePicker,
}: DatepickerProps) {
  return (
    <div className="flex items-center">
      <DateFilterButtons
        setSelectedDate={setSelectedDate}
        setShowDatePicker={() => {}}
        buttonName="Eergisteren"
        DateChange={2}
        Side="left"
      />
      <div className="relative border-y border-accent py-2 px-6 hover:bg-accent transition-colors duration-300">
        <button onClick={() => setShowDatePicker(!showDatePicker)}>
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString("en-GB")
            : "Select a date"}
        </button>

        {showDatePicker && (
          <div className="absolute top-full mt-2 bg-secondary border rounded-md shadow-md p-4 z-10">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowDatePicker(false);
              }}
              // className="border rounded p-2 w-full"
            />
          </div>
        )}
      </div>
      <DateFilterButtons
        setSelectedDate={setSelectedDate}
        setShowDatePicker={() => {}}
        buttonName="Gisteren"
        DateChange={1}
        Side="right"
      />
    </div>
  );
}
