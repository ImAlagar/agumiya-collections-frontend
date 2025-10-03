// src/components/admin/contact/ContactFilters.js
import React from 'react';
import AdvancedFilters from '../../shared/AdvancedFilters';
import { contactFilterConfig } from '../../../config/filterConfigs';

const ContactFilters = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <AdvancedFilters
      config={contactFilterConfig}
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
    />
  );
};

export default ContactFilters;