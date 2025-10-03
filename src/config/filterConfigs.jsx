// src/config/filterConfigs.js
export const orderFilterConfig = {
  mobileTitle: "Order Filters",
  gridColumns: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  
  fields: [
    {
      type: 'search',
      key: 'search',
      placeholder: "Search orders by ID, customer name, email, or product...",
    },
    {
      type: 'select',
      key: 'status',
      label: 'Order Status',
      options: [
        { value: 'all', label: 'All Statuses', color: 'gray', icon: '📊' },
        { value: 'pending', label: 'Pending', color: 'yellow', icon: '⏳' },
        { value: 'confirmed', label: 'Confirmed', color: 'blue', icon: '✅' },
        { value: 'processing', label: 'Processing', color: 'indigo', icon: '⚙️' },
        { value: 'shipped', label: 'Shipped', color: 'purple', icon: '🚚' },
        { value: 'delivered', label: 'Delivered', color: 'green', icon: '📦' },
        { value: 'cancelled', label: 'Cancelled', color: 'red', icon: '❌' }
      ]
    },
    {
      type: 'select',
      key: 'paymentStatus',
      label: 'Payment Status',
      options: [
        { value: 'all', label: 'All Payments', color: 'gray', icon: '💳' },
        { value: 'pending', label: 'Pending', color: 'yellow', icon: '⏳' },
        { value: 'paid', label: 'Paid', color: 'green', icon: '💰' },
        { value: 'failed', label: 'Failed', color: 'red', icon: '❌' },
        { value: 'refunded', label: 'Refunded', color: 'orange', icon: '↩️' }
      ]
    },
    {
      type: 'sort',
      key: 'sortBy',
      label: 'Sort By',
      options: [
        { value: 'createdAt', label: 'Order Date', icon: '📅' },
        { value: 'updatedAt', label: 'Last Updated', icon: '🔄' },
        { value: 'totalAmount', label: 'Total Amount', icon: '💰' },
        { value: 'customerName', label: 'Customer Name', icon: '👤' }
      ]
    }
  ],

  tabs: [
    {
      id: 'status',
      label: 'Status',
      icon: '📊',
      fields: [
        {
          type: 'select',
          key: 'status',
          label: 'Order Status',
          options: [
            { value: 'all', label: 'All Statuses', color: 'gray', icon: '📊' },
            { value: 'pending', label: 'Pending', color: 'yellow', icon: '⏳' },
            { value: 'confirmed', label: 'Confirmed', color: 'blue', icon: '✅' },
            { value: 'processing', label: 'Processing', color: 'indigo', icon: '⚙️' },
            { value: 'shipped', label: 'Shipped', color: 'purple', icon: '🚚' },
            { value: 'delivered', label: 'Delivered', color: 'green', icon: '📦' },
            { value: 'cancelled', label: 'Cancelled', color: 'red', icon: '❌' }
          ]
        }
      ]
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: '💳',
      fields: [
        {
          type: 'select',
          key: 'paymentStatus',
          label: 'Payment Status',
          options: [
            { value: 'all', label: 'All Payments', color: 'gray', icon: '💳' },
            { value: 'pending', label: 'Pending', color: 'yellow', icon: '⏳' },
            { value: 'paid', label: 'Paid', color: 'green', icon: '💰' },
            { value: 'failed', label: 'Failed', color: 'red', icon: '❌' },
            { value: 'refunded', label: 'Refunded', color: 'orange', icon: '↩️' }
          ]
        }
      ]
    },
    {
      id: 'sort',
      label: 'Sort',
      icon: '🔀',
      fields: [
        {
          type: 'sort',
          key: 'sortBy',
          label: 'Sort Options',
          options: [
            { value: 'createdAt', label: 'Order Date', icon: '📅' },
            { value: 'updatedAt', label: 'Last Updated', icon: '🔄' },
            { value: 'totalAmount', label: 'Total Amount', icon: '💰' },
            { value: 'customerName', label: 'Customer Name', icon: '👤' }
          ]
        }
      ]
    }
  ],

  getActiveFilters: (filters) => {
    const activeFilters = [];
    
    if (filters.search) {
      activeFilters.push({
        type: 'search',
        value: 'search',
        label: `Search: "${filters.search}"`,
        color: 'blue',
        onRemove: () => ({ search: '' })
      });
    }
    
    if (filters.status !== 'all') {
      const option = orderFilterConfig.fields[1].options.find(opt => opt.value === filters.status);
      activeFilters.push({
        type: 'status',
        value: filters.status,
        label: option?.label,
        color: option?.color,
        onRemove: () => ({ status: 'all' })
      });
    }
    
    if (filters.paymentStatus !== 'all') {
      const option = orderFilterConfig.fields[2].options.find(opt => opt.value === filters.paymentStatus);
      activeFilters.push({
        type: 'payment',
        value: filters.paymentStatus,
        label: option?.label,
        color: option?.color,
        onRemove: () => ({ paymentStatus: 'all' })
      });
    }
    
    return activeFilters;
  },

  getChipIcon: (type, value) => {
    const icons = {
      search: '🔍',
      status: '📊',
      payment: '💳'
    };
    return icons[type] || '📊';
  }
};

export const productFilterConfig = {
  mobileTitle: "Product Filters",
  gridColumns: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  
  fields: [
    {
      type: 'search',
      key: 'search',
      placeholder: "Search products by name, SKU, or description...",
    },
    {
      type: 'select',
      key: 'category',
      label: 'Category',
      options: [
        { value: 'All', label: 'All Categories', color: 'gray', icon: '📊' },
        { value: 'T-Shirts', label: 'T-Shirts', color: 'blue', icon: '👕' },
        { value: 'Hoodies', label: 'Hoodies', color: 'purple', icon: '🧥' },
        { value: 'Accessories', label: 'Accessories', color: 'green', icon: '🎒' }
        // Add more categories as needed
      ]
    },
    {
      type: 'select',
      key: 'inStock',
      label: 'Stock Status',
      options: [
        { value: 'all', label: 'All Stock', color: 'gray', icon: '📊' },
        { value: 'true', label: 'In Stock', color: 'green', icon: '✅' },
        { value: 'false', label: 'Out of Stock', color: 'red', icon: '❌' }
      ]
    },
    {
      type: 'sort',
      key: 'sortBy',
      label: 'Sort By',
      options: [
        { value: 'name', label: 'Name', icon: '📝' },
        { value: 'price', label: 'Price', icon: '💰' },
        { value: 'createdAt', label: 'Date Added', icon: '📅' },
        { value: 'stock', label: 'Stock Level', icon: '📦' },
        { value: 'updatedAt', label: 'Last Updated', icon: '🔄' }
      ]
    }
  ],

  tabs: [
    {
      id: 'category',
      label: 'Category',
      icon: '🏷️',
      fields: [
        {
          type: 'select',
          key: 'category',
          label: 'Product Category',
          options: [
            { value: 'All', label: 'All Categories', color: 'gray', icon: '📊' },
            { value: 'T-Shirts', label: 'T-Shirts', color: 'blue', icon: '👕' },
            { value: 'Hoodies', label: 'Hoodies', color: 'purple', icon: '🧥' },
            { value: 'Accessories', label: 'Accessories', color: 'green', icon: '🎒' }
          ]
        }
      ]
    },
    {
      id: 'stock',
      label: 'Stock',
      icon: '📦',
      fields: [
        {
          type: 'select',
          key: 'inStock',
          label: 'Stock Status',
          options: [
            { value: 'all', label: 'All Stock', color: 'gray', icon: '📊' },
            { value: 'true', label: 'In Stock', color: 'green', icon: '✅' },
            { value: 'false', label: 'Out of Stock', color: 'red', icon: '❌' }
          ]
        }
      ]
    },
    {
      id: 'sort',
      label: 'Sort',
      icon: '🔀',
      fields: [
        {
          type: 'sort',
          key: 'sortBy',
          label: 'Sort Options',
          options: [
            { value: 'name', label: 'Name', icon: '📝' },
            { value: 'price', label: 'Price', icon: '💰' },
            { value: 'createdAt', label: 'Date Added', icon: '📅' },
            { value: 'stock', label: 'Stock Level', icon: '📦' },
            { value: 'updatedAt', label: 'Last Updated', icon: '🔄' }
          ]
        }
      ]
    }
  ],

  getActiveFilters: (filters) => {
    const activeFilters = [];
    
    if (filters.search) {
      activeFilters.push({
        type: 'search',
        value: 'search',
        label: `Search: "${filters.search}"`,
        color: 'blue',
        onRemove: () => ({ search: '' })
      });
    }
    
    if (filters.category !== 'All') {
      activeFilters.push({
        type: 'category',
        value: filters.category,
        label: `Category: ${filters.category}`,
        color: 'purple',
        onRemove: () => ({ category: 'All' })
      });
    }
    
    if (filters.inStock !== 'all') {
      const option = productFilterConfig.fields[2].options.find(opt => opt.value === filters.inStock);
      activeFilters.push({
        type: 'stock',
        value: filters.inStock,
        label: `Stock: ${filters.inStock === 'true' ? 'In Stock' : 'Out of Stock'}`,
        color: option?.color,
        onRemove: () => ({ inStock: 'all' })
      });
    }
    
    return activeFilters;
  },

  getChipIcon: (type, value) => {
    const icons = {
      search: '🔍',
      category: '🏷️',
      stock: '📦'
    };
    return icons[type] || '📊';
  }
};

export const userFilterConfig = {
  mobileTitle: "User Filters",
  gridColumns: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  
  fields: [
    {
      type: 'search',
      key: 'search',
      placeholder: "Search users by name or email...",
    },
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status', color: 'gray', icon: '📊' },
        { value: 'active', label: 'Active', color: 'green', icon: '✅' },
        { value: 'inactive', label: 'Inactive', color: 'red', icon: '❌' }
      ]
    },
    {
      type: 'sort',
      key: 'sortBy',
      label: 'Sort By',
      options: [
        { value: 'createdAt', label: 'Registration Date', icon: '📅' },
        { value: 'name', label: 'Name', icon: '👤' },
        { value: 'email', label: 'Email', icon: '📧' }
      ]
    }
  ],

  tabs: [
    {
      id: 'status',
      label: 'Status',
      icon: '📊',
      fields: [
        {
          type: 'select',
          key: 'status',
          label: 'User Status',
          options: [
            { value: 'all', label: 'All Status', color: 'gray', icon: '📊' },
            { value: 'active', label: 'Active', color: 'green', icon: '✅' },
            { value: 'inactive', label: 'Inactive', color: 'red', icon: '❌' }
          ]
        }
      ]
    },
    {
      id: 'sort',
      label: 'Sort',
      icon: '🔀',
      fields: [
        {
          type: 'sort',
          key: 'sortBy',
          label: 'Sort Options',
          options: [
            { value: 'createdAt', label: 'Registration Date', icon: '📅' },
            { value: 'name', label: 'Name', icon: '👤' },
            { value: 'email', label: 'Email', icon: '📧' }
          ]
        }
      ]
    }
  ],

  getActiveFilters: (filters) => {
    const activeFilters = [];
    
    if (filters.search) {
      activeFilters.push({
        type: 'search',
        value: 'search',
        label: `Search: "${filters.search}"`,
        color: 'blue',
        onRemove: () => ({ search: '' })
      });
    }
    
    if (filters.status !== 'all') {
      const option = userFilterConfig.fields[1].options.find(opt => opt.value === filters.status);
      activeFilters.push({
        type: 'status',
        value: filters.status,
        label: option?.label,
        color: option?.color,
        onRemove: () => ({ status: 'all' })
      });
    }
    
    return activeFilters;
  },

  getChipIcon: (type, value) => {
    const icons = {
      search: '🔍',
      status: '📊'
    };
    return icons[type] || '📊';
  }
};

export const contactFilterConfig = {
  mobileTitle: "Contact Filters",
  gridColumns: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  
  fields: [
    {
      type: 'search',
      key: 'search',
      placeholder: "Search by name, email, or subject...",
    },
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status', color: 'gray', icon: '📊' },
        { value: 'PENDING', label: 'Pending', color: 'yellow', icon: '⏳' },
        { value: 'IN_PROGRESS', label: 'In Progress', color: 'blue', icon: '⚙️' },
        { value: 'RESOLVED', label: 'Resolved', color: 'green', icon: '✅' },
        { value: 'CLOSED', label: 'Closed', color: 'gray', icon: '🔒' },
        { value: 'SPAM', label: 'Spam', color: 'red', icon: '🚫' }
      ]
    },
    {
      type: 'select',
      key: 'inquiryType',
      label: 'Inquiry Type',
      options: [
        { value: 'all', label: 'All Types', color: 'gray', icon: '📊' },
        { value: 'GENERAL', label: 'General', color: 'blue', icon: '💬' },
        { value: 'ORDER_SUPPORT', label: 'Order Support', color: 'purple', icon: '🛒' },
        { value: 'PRODUCT_QUESTION', label: 'Product Question', color: 'green', icon: '❓' },
        { value: 'SHIPPING', label: 'Shipping', color: 'orange', icon: '🚚' },
        { value: 'RETURNS', label: 'Returns', color: 'yellow', icon: '↩️' },
        { value: 'COMPLAINT', label: 'Complaint', color: 'red', icon: '😠' },
        { value: 'FEEDBACK', label: 'Feedback', color: 'indigo', icon: '💡' },
        { value: 'OTHER', label: 'Other', color: 'gray', icon: '📝' }
      ]
    },
    {
      type: 'sort',
      key: 'sortBy',
      label: 'Sort By',
      options: [
        { value: 'createdAt', label: 'Date', icon: '📅' },
        { value: 'name', label: 'Name', icon: '👤' },
        { value: 'email', label: 'Email', icon: '📧' },
        { value: 'subject', label: 'Subject', icon: '💬' }
      ]
    }
  ],

  tabs: [
    {
      id: 'status',
      label: 'Status',
      icon: '📊',
      fields: [
        {
          type: 'select',
          key: 'status',
          label: 'Inquiry Status',
          options: [
            { value: 'all', label: 'All Status', color: 'gray', icon: '📊' },
            { value: 'PENDING', label: 'Pending', color: 'yellow', icon: '⏳' },
            { value: 'IN_PROGRESS', label: 'In Progress', color: 'blue', icon: '⚙️' },
            { value: 'RESOLVED', label: 'Resolved', color: 'green', icon: '✅' },
            { value: 'CLOSED', label: 'Closed', color: 'gray', icon: '🔒' },
            { value: 'SPAM', label: 'Spam', color: 'red', icon: '🚫' }
          ]
        }
      ]
    },
    {
      id: 'type',
      label: 'Type',
      icon: '🏷️',
      fields: [
        {
          type: 'select',
          key: 'inquiryType',
          label: 'Inquiry Type',
          options: [
            { value: 'all', label: 'All Types', color: 'gray', icon: '📊' },
            { value: 'GENERAL', label: 'General', color: 'blue', icon: '💬' },
            { value: 'ORDER_SUPPORT', label: 'Order Support', color: 'purple', icon: '🛒' },
            { value: 'PRODUCT_QUESTION', label: 'Product Question', color: 'green', icon: '❓' },
            { value: 'SHIPPING', label: 'Shipping', color: 'orange', icon: '🚚' },
            { value: 'RETURNS', label: 'Returns', color: 'yellow', icon: '↩️' },
            { value: 'COMPLAINT', label: 'Complaint', color: 'red', icon: '😠' },
            { value: 'FEEDBACK', label: 'Feedback', color: 'indigo', icon: '💡' },
            { value: 'OTHER', label: 'Other', color: 'gray', icon: '📝' }
          ]
        }
      ]
    },
    {
      id: 'sort',
      label: 'Sort',
      icon: '🔀',
      fields: [
        {
          type: 'sort',
          key: 'sortBy',
          label: 'Sort Options',
          options: [
            { value: 'createdAt', label: 'Date', icon: '📅' },
            { value: 'name', label: 'Name', icon: '👤' },
            { value: 'email', label: 'Email', icon: '📧' },
            { value: 'subject', label: 'Subject', icon: '💬' }
          ]
        }
      ]
    }
  ],

  getActiveFilters: (filters) => {
    const activeFilters = [];
    
    if (filters.search) {
      activeFilters.push({
        type: 'search',
        value: 'search',
        label: `Search: "${filters.search}"`,
        color: 'blue',
        onRemove: () => ({ search: '' })
      });
    }
    
    if (filters.status !== 'all') {
      const option = contactFilterConfig.fields[1].options.find(opt => opt.value === filters.status);
      activeFilters.push({
        type: 'status',
        value: filters.status,
        label: option?.label,
        color: option?.color,
        onRemove: () => ({ status: 'all' })
      });
    }
    
    if (filters.inquiryType !== 'all') {
      const option = contactFilterConfig.fields[2].options.find(opt => opt.value === filters.inquiryType);
      activeFilters.push({
        type: 'type',
        value: filters.inquiryType,
        label: option?.label,
        color: option?.color,
        onRemove: () => ({ inquiryType: 'all' })
      });
    }
    
    return activeFilters;
  },

  getChipIcon: (type, value) => {
    const icons = {
      search: '🔍',
      status: '📊',
      type: '🏷️'
    };
    return icons[type] || '📊';
  }
};