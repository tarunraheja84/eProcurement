import { Calendar } from 'primereact/calendar';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <div>
      <Calendar
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
        value={value}
        onChange={(e:any) => onChange(e.value)}
        showIcon
        dateFormat="dd/mm/yy"
        showTime={false}
        readOnlyInput={false}
      />
    </div>
  );
};

export default DatePicker;
