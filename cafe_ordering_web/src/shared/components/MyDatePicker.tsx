import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface MyDatePickerProps {
  label: string;
  onValueChanged?: (date: Date | null) => void;
  slotProps?: any;
}

export const MyDatePicker: React.FC<MyDatePickerProps> = ({ label, onValueChanged, slotProps }) => {
  const [value, setValue] = React.useState<Date | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newValue: Date | null, context) => { 
          setValue(newValue);
          onValueChanged && onValueChanged(newValue); 
        }}
        slots={{ textField: TextField }}
        slotProps={slotProps}
      />
    </LocalizationProvider>
  );
};

interface MyDateTimePickerProps {
  label: string;
  onValueChanged?: (date: Date | null) => void;
  slotProps?: any;
}

export const MyDateTimePicker: React.FC<MyDateTimePickerProps> = ({ label, onValueChanged, slotProps }) => {
  const [value, setValue] = React.useState<Date | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={(newValue: Date | null) => {
          setValue(newValue);
          onValueChanged && onValueChanged(newValue);
        }}
        slots={{ textField: TextField }}
        slotProps={slotProps}
      />
    </LocalizationProvider>
  );
};
