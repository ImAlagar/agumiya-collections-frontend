// src/components/common/CalendarFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';

const CalendarFilter = ({ 
  onDateRangeChange, 
  initialRange = 'thisMonth',
  isLoading = false,
  position = 'left',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef(null);

  // Time period categories matching the image
  const timePeriods = [
    { 
      category: 'Last 30 days', 
      ranges: [
        { value: 'last30Days', label: 'Last 30 Days', getDate: () => {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 30);
          return { start, end };
        }}
      ]
    },
    { 
      category: 'This week', 
      ranges: [
        { value: 'thisWeek', label: 'This Week', getDate: () => {
          const start = new Date();
          start.setDate(start.getDate() - start.getDay());
          start.setHours(0, 0, 0, 0);
          const end = new Date();
          end.setHours(23, 59, 59, 999);
          return { start, end };
        }}
      ]
    },
    { 
      category: 'Last week', 
      ranges: [
        { value: 'lastWeek', label: 'Last Week', getDate: () => {
          const end = new Date();
          end.setDate(end.getDate() - end.getDay() - 1);
          end.setHours(23, 59, 59, 999);
          const start = new Date(end);
          start.setDate(start.getDate() - 6);
          start.setHours(0, 0, 0, 0);
          return { start, end };
        }}
      ]
    },
    { 
      category: 'This month', 
      ranges: [
        { value: 'thisMonth', label: 'This Month', getDate: () => {
          const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
          const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
          end.setHours(23, 59, 59, 999);
          return { start, end };
        }}
      ]
    },
    { 
      category: 'Last month', 
      ranges: [
        { value: 'lastMonth', label: 'Last Month', getDate: () => {
          const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
          const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
          end.setHours(23, 59, 59, 999);
          return { start, end };
        }}
      ]
    },
    { 
      category: 'Last 3 months', 
      ranges: [
        { value: 'last3Months', label: 'Last 3 Months', getDate: () => {
          const end = new Date();
          const start = new Date();
          start.setMonth(start.getMonth() - 3);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          return { start, end };
        }}
      ]
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle range selection
  const handleRangeSelect = (range) => {
    setSelectedRange(range.value);
    const dateRange = range.getDate();
    onDateRangeChange({
      range: range.value,
      startDate: dateRange.start,
      endDate: dateRange.end,
      label: range.label
    });
    setIsOpen(false);
  };

  // Generate calendar days for a specific month and year
  const generateCalendarDays = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const startingDay = firstDay.getDay();
    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  // Get current range label
  const getCurrentRangeLabel = () => {
    for (const period of timePeriods) {
      const range = period.ranges.find(r => r.value === selectedRange);
      if (range) return range.label;
    }
    return 'Select Date Range';
  };

  // Generate calendars for current and next month (like in the image)
  const currentMonthDays = generateCalendarDays(currentMonth.getMonth(), currentMonth.getFullYear());
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  const nextMonthDays = generateCalendarDays(nextMonth.getMonth(), nextMonth.getFullYear());

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[180px] justify-between hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 disabled:opacity-50"
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span className="truncate">{getCurrentRangeLabel()}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} mt-2 w-[800px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 z-50 overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  Select Date Range
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex">
              {/* Left Panel - Time Periods */}
              <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4">
                <div className="space-y-6">
                  {timePeriods.map((period) => (
                    <div key={period.category} className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {period.category}
                      </h4>
                      <div className="space-y-1">
                        {period.ranges.map((range) => (
                          <button
                            key={range.value}
                            onClick={() => handleRangeSelect(range)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedRange === range.value
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel - Calendars */}
              <div className="w-2/3 p-4">
                <div className="flex space-x-8">
                  {/* Current Month Calendar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {currentMonthDays.map((date, index) => {
                        const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                        const isToday = date.toDateString() === new Date().toDateString();
                        
                        return (
                          <div
                            key={index}
                            className={`text-center text-xs p-2 rounded ${
                              !isCurrentMonth 
                                ? 'text-gray-400 dark:text-gray-600' 
                                : isToday
                                ? 'bg-blue-500 text-white font-medium'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {date.getDate()}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next Month Calendar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-center mb-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {nextMonthDays.map((date, index) => {
                        const isCurrentMonth = date.getMonth() === nextMonth.getMonth();
                        const isToday = date.toDateString() === new Date().toDateString();
                        
                        return (
                          <div
                            key={index}
                            className={`text-center text-xs p-2 rounded ${
                              !isCurrentMonth 
                                ? 'text-gray-400 dark:text-gray-600' 
                                : isToday
                                ? 'bg-blue-500 text-white font-medium'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {date.getDate()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Custom Range Section */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-3">
                    Custom range
                  </h4>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Start date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        End date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarFilter;