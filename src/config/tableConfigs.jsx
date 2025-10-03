// src/config/tableConfigs.js
import { 
  Package, User, Mail, Calendar, ShoppingCart, 
  CreditCard, Truck, Image as ImageIcon, MessageSquare,
  CheckCircle, XCircle, Clock, Eye, Edit3
} from 'lucide-react';
import ProductDetails from '../components/admin/products/ProductDetails';
import UserDetails from '../components/admin/user/UserDetails';
import OrderDetails from '../components/admin/order/OrderDetails';
import ContactDetails from '../components/admin/contact/ContactDetails';

// Common formatters
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Product Table Configuration
export const productTableConfig = {
  entityName: 'products',
  detailsComponent: ProductDetails,
  
  columns: [
    {
      key: 'name',
      header: 'Product',
      type: 'text',
      minWidth: '250px',
      className: 'flex items-center gap-3'
    },
    {
      key: 'category',
      header: 'Category',
      type: 'badge',
      options: [
        { value: 'T-Shirts', label: 'T-Shirts', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        { value: 'Hoodies', label: 'Hoodies', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
        { value: 'Accessories', label: 'Accessories', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
      ]
    },
    {
      key: 'price',
      header: 'Price',
      type: 'currency'
    },
    {
      key: 'inStock',
      header: 'Inventory',
      type: 'status',
      options: [
        { value: true, label: 'In Stock', color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
        { value: false, label: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' }
      ]
    },
    {
      key: 'printifyVariants',
      header: 'Variants',
      type: 'text',
      format: (value) => value?.length || 0
    },
    {
      key: 'images',
      header: 'Media',
      type: 'text',
      format: (value) => value?.length || 0
    },
    {
      key: 'createdAt',
      header: 'Created',
      type: 'date'
    }
  ],

  mobile: {
    avatar: {
      key: 'images.0',
      type: 'image'
    },
    title: {
      key: 'name',
      type: 'text'
    },
    subtitle: {
      key: 'category',
      type: 'text'
    },
    status: {
      key: 'inStock',
      type: 'badge',
      options: [
        { value: true, label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        { value: false, label: 'Inactive', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
      ]
    },
    details: [
      {
        key: 'price',
        label: 'Price',
        type: 'currency'
      },
      {
        key: 'inStock',
        label: 'Inventory',
        type: 'text',
        format: (value) => value ? 'In Stock' : 'Out of Stock'
      },
      {
        key: 'printifyVariants',
        label: 'Variants',
        type: 'text',
        format: (value) => value?.length || 0
      },
      {
        key: 'images',
        label: 'Media',
        type: 'text',
        format: (value) => value?.length || 0
      }
    ],
    footer: {
      left: {
        key: 'createdAt',
        type: 'date'
      }
    }
  },

  emptyState: {
    icon: Package,
    title: 'No products found',
    description: 'Try adjusting your filters or sync new products.'
  }
};

// User Table Configuration
export const userTableConfig = {
  entityName: 'users',
  detailsComponent: UserDetails,
  
  columns: [
    {
      key: 'name',
      header: 'User',
      type: 'text',
      minWidth: '250px',
      className: 'flex items-center gap-3'
    },
    {
      key: 'isActive',
      header: 'Status',
      type: 'status',
      options: [
        { value: true, label: 'Active', color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
        { value: false, label: 'Inactive', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' }
      ]
    },
    {
      key: 'email',
      header: 'Email',
      type: 'text'
    },
    {
      key: 'orders',
      header: 'Orders',
      type: 'text',
      format: (value) => value?.length || 0
    },
    {
      key: 'createdAt',
      header: 'Registered',
      type: 'date'
    }
  ],

  mobile: {
    avatar: {
      render: (user) => (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      )
    },
    title: {
      key: 'name',
      type: 'text'
    },
    subtitle: {
      key: 'email',
      type: 'text'
    },
    status: {
      key: 'isActive',
      type: 'badge',
      options: [
        { value: true, label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        { value: false, label: 'Inactive', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
      ]
    },
    details: [
      {
        key: 'emailVerified',
        label: 'Email Status',
        type: 'badge',
        options: [
          { value: true, label: 'Verified', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
          { value: false, label: 'Unverified', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
        ]
      },
      {
        key: 'orders',
        label: 'Orders',
        type: 'text',
        format: (value) => value?.length || 0
      },
      {
        key: 'id',
        label: 'User ID',
        type: 'text',
        format: (value) => value ? value.slice(-8) : 'N/A'
      }
    ],
    footer: {
      left: {
        key: 'createdAt',
        type: 'date'
      }
    }
  },

  emptyState: {
    icon: User,
    title: 'No users found',
    description: 'Try adjusting your search criteria or filters'
  }
};

// Order Table Configuration
export const orderTableConfig = {
  entityName: 'orders',
  detailsComponent: OrderDetails,
  
  columns: [
    {
      key: 'id',
      header: 'Order',
      type: 'text',
      minWidth: '250px',
      className: 'flex items-center gap-3',
      format: (value, order) => order.orderNumber ? `#${order.orderNumber}` : `#${value?.slice(-8)}`
    },
    {
      key: 'shippingAddress',
      header: 'Customer',
      type: 'text',
      format: (value) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
    },
    {
      key: 'createdAt',
      header: 'Date',
      type: 'date',
      format: formatDateTime
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      type: 'currency'
    },
    {
      key: 'fulfillmentStatus',
      header: 'Status',
      type: 'badge',
      options: [
        { value: 'PENDING', label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
        { value: 'CONFIRMED', label: 'Confirmed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle },
        { value: 'PROCESSING', label: 'Processing', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
        { value: 'SHIPPED', label: 'Shipped', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200', icon: Truck },
        { value: 'DELIVERED', label: 'Delivered', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
        { value: 'CANCELLED', label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle }
      ]
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      type: 'badge',
      options: [
        { value: 'PENDING', label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
        { value: 'PAID', label: 'Paid', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        { value: 'FAILED', label: 'Failed', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
        { value: 'REFUNDED', label: 'Refunded', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
      ]
    }
  ],

  mobile: {
    avatar: {
      render: (order) => (
        order.items?.[0]?.product?.images?.[0] ? (
          <img 
            src={order.items[0].product.images[0]} 
            alt="Product" 
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Package className="w-5 h-5 text-gray-400" />
          </div>
        )
      )
    },
    title: {
      key: 'id',
      type: 'text',
      format: (value, order) => order.orderNumber ? `#${order.orderNumber}` : `#${value?.slice(-8)}`
    },
    subtitle: {
      key: 'items',
      type: 'text',
      format: (value) => `${value?.length || 0} item(s)`
    },
    status: {
      key: 'fulfillmentStatus',
      type: 'badge',
      options: [
        { value: 'PENDING', label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
        { value: 'CONFIRMED', label: 'Confirmed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        { value: 'SHIPPED', label: 'Shipped', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
        { value: 'DELIVERED', label: 'Delivered', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        { value: 'CANCELLED', label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
      ]
    },
    details: [
      {
        key: 'shippingAddress',
        label: 'Customer',
        type: 'text',
        format: (value) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
      },
      {
        key: 'totalAmount',
        label: 'Amount',
        type: 'currency'
      },
      {
        key: 'paymentStatus',
        label: 'Payment',
        type: 'badge',
        options: [
          { value: 'PENDING', label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
          { value: 'PAID', label: 'Paid', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
          { value: 'FAILED', label: 'Failed', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
        ]
      }
    ],
    footer: {
      left: {
        key: 'createdAt',
        type: 'date',
        format: formatDateTime
      }
    }
  },

  emptyState: {
    icon: Package,
    title: 'No orders found',
    description: 'Try adjusting your filters or check back later for new orders.'
  }
};

// Contact Table Configuration
export const contactTableConfig = {
  entityName: 'contacts',
  detailsComponent: ContactDetails,
  
  columns: [
    {
      key: 'name',
      header: 'Contact',
      type: 'text',
      minWidth: '200px',
      className: 'flex items-center gap-3'
    },
    {
      key: 'inquiryType',
      header: 'Type & Status',
      type: 'badge',
      options: [
        { value: 'GENERAL', label: 'General', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
        { value: 'ORDER_SUPPORT', label: 'Order Support', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        { value: 'PRODUCT_QUESTION', label: 'Product Question', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        { value: 'COMPLAINT', label: 'Complaint', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
      ]
    },
    {
      key: 'subject',
      header: 'Subject',
      type: 'text',
      minWidth: '250px'
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      type: 'date',
      format: formatDateTime
    }
  ],

  mobile: {
    avatar: {
      render: (contact) => (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      )
    },
    title: {
      key: 'name',
      type: 'text'
    },
    subtitle: {
      key: 'email',
      type: 'text'
    },
    status: {
      key: 'status',
      type: 'badge',
      options: [
        { value: 'PENDING', label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
        { value: 'IN_PROGRESS', label: 'In Progress', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        { value: 'RESOLVED', label: 'Resolved', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        { value: 'CLOSED', label: 'Closed', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
      ]
    },
    details: [
      {
        key: 'inquiryType',
        label: 'Type',
        type: 'badge',
        options: [
          { value: 'GENERAL', label: 'General', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
          { value: 'ORDER_SUPPORT', label: 'Order Support', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
          { value: 'PRODUCT_QUESTION', label: 'Product Question', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
        ]
      },
      {
        key: 'scheduleCallback',
        label: 'Callback',
        type: 'text',
        format: (value) => value ? 'Requested' : 'No'
      }
    ],
    footer: {
      left: {
        key: 'createdAt',
        type: 'date',
        format: formatDateTime
      }
    }
  },

  emptyState: {
    icon: Mail,
    title: 'No contacts found',
    description: 'Try adjusting your search criteria or filters'
  }
};