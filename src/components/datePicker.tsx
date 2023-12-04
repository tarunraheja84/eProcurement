import { Calendar } from 'primereact/calendar';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <div>
      <Calendar
        className="w-full md:w-1/3 border border-custom-red rounded py-2 px-3 outline-none"
        value={value}
        onChange={(e:any) => onChange(e.value)}
        showIcon
        dateFormat="dd/mm/yy"
        showTime={false}
        readOnlyInput={false}
        minDate={new Date()}
      />
    </div>
  );
};

export default DatePicker;
