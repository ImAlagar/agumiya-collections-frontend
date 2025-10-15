import React from 'react';

export const StarRating = ({ rating, onRate, size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={onRate ? 'button' : 'div'}
          onClick={() => onRate && onRate(star)}
          className={`${sizes[size]} ${
            onRate ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          }`}
        >
          <svg
            fill={star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
            className={`${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${onRate ? 'hover:text-yellow-300' : ''}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
    </div>
  );
};