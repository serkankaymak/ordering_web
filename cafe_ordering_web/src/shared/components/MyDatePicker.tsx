"use client";
import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface MyDatePickerProps {
  label: string;
  onValueChanged?: (date: Date | null) => void;
  slotProps?: any;
  valueAsUtc?: string | Date;
}

export const MyDatePicker: React.FC<MyDatePickerProps> = ({
  label,
  onValueChanged,
  slotProps,
  valueAsUtc,
}) => {
  // İlk değer olarak valueAsUtc parametresini Date'e çevirip kullanıyoruz
  const [value, setValue] = React.useState<Date | null>(
    valueAsUtc ? (typeof valueAsUtc === "string" ? new Date(valueAsUtc) : valueAsUtc) : null
  );

  // Eğer valueAsUtc prop'u değişirse, state'i güncelliyoruz
  React.useEffect(() => {
    if (valueAsUtc) {
      const newDate = typeof valueAsUtc === "string" ? new Date(valueAsUtc) : valueAsUtc;
      setValue(newDate);
    }
  }, [valueAsUtc]);

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
  valueAsUtc?: string | Date;
}

export const MyDateTimePicker: React.FC<MyDateTimePickerProps> = ({
  label,
  onValueChanged,
  slotProps,
  valueAsUtc,
}) => {
  const [value, setValue] = React.useState<Date | null>(
    valueAsUtc ? (typeof valueAsUtc === "string" ? new Date(valueAsUtc) : valueAsUtc) : null
  );

  React.useEffect(() => {
    if (valueAsUtc) {
      const newDate = typeof valueAsUtc === "string" ? new Date(valueAsUtc) : valueAsUtc;
      setValue(newDate);
    }
  }, [valueAsUtc]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={(newValue: Date | null) => {
          setValue(newValue);
          onValueChanged && onValueChanged(newValue);
        }}
        slots={{ textField: (params) => <TextField {...params} /> }}
        slotProps={slotProps}
      />
    </LocalizationProvider>
  );
};
