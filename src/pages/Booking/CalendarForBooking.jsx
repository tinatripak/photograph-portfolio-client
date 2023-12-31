import React from "react";
import Calendar from "react-calendar";
import "./CalendarForBooking.css";
import "react-calendar/dist/Calendar.css";

const CalendarForBooking = ({ handleDateChange, date, isDateDisabled }) => {
  return (
    <Calendar
      onChange={handleDateChange}
      value={date}
      locale="en-En"
      minDate={new Date()}
      tileDisabled={isDateDisabled}
    />
  );
};

export default CalendarForBooking;
