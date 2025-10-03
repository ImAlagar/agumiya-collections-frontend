// src/components/admin/user/UserFilters.js
import React from 'react';
import AdvancedFilters from '../../shared/AdvancedFilters';
import { userFilterConfig } from '../../../config/filterConfigs';

const UserFilters = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <AdvancedFilters
      config={userFilterConfig}
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
    />
  );
};

export default UserFilters;