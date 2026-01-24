import { useState } from 'react';

type Period = 'week' | 'month';

interface DateRangeNavigatorParams {
  period: Period;
  getStartDate: (date: Date) => Date;
  getEndDate: (date: Date) => Date;
}

export function useDateRangeNavigator({
  period,
  getStartDate,
  getEndDate,
}: DateRangeNavigatorParams) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const startDate = getStartDate(currentDate);
  const endDate = getEndDate(currentDate);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (period === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (period === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    startDate,
    endDate,
    currentDate,
    handlePrevious,
    handleNext,
    resetToToday,
  };
}