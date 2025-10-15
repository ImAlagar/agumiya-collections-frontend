// src/utils/reviewFilters.js
export const filterAndSortReviews = (reviews, filters) => {
  if (!Array.isArray(reviews)) return [];

  let filteredReviews = [...reviews];

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredReviews = filteredReviews.filter(review => 
      (review.title?.toLowerCase().includes(searchTerm)) ||
      (review.comment?.toLowerCase().includes(searchTerm)) ||
      (review.user?.name?.toLowerCase().includes(searchTerm)) ||
      (review.user?.email?.toLowerCase().includes(searchTerm)) ||
      (review.product?.name?.toLowerCase().includes(searchTerm))
    );
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filteredReviews = filteredReviews.filter(review => 
      review.status === filters.status
    );
  }

  // Rating filter
  if (filters.rating && filters.rating !== 'all') {
    filteredReviews = filteredReviews.filter(review => 
      review.rating === parseInt(filters.rating)
    );
  }

  // Sorting
  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = filters.sortOrder || 'desc';

  filteredReviews.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle nested properties
    if (sortBy === 'user') {
      aValue = a.user?.name;
      bValue = b.user?.name;
    } else if (sortBy === 'product') {
      aValue = a.product?.name;
      bValue = b.product?.name;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filteredReviews;
};

export const getDefaultFilters = () => ({
  search: '',
  status: 'all',
  rating: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc'
});