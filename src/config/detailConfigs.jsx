// src/config/detailConfigs.js
import { 
  ShoppingCart, User, Package, Truck, 
  Image as 
 Layers, CheckCircle, XCircle,
  Clock, MessageSquare, FileText,
  ExternalLink
} from 'lucide-react';

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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Order Configuration
export const orderDetailConfig = {
  header: {
    title: (data) => `Order Details - ${data.orderNumber ? `#${data.orderNumber}` : `#${data.id?.slice(-8)}`}`
  },
  
  tabs: [
    {
      id: 'overview',
      label: 'Overview',
      icon: ShoppingCart,
      sections: [
        {
          title: 'Order Summary',
          layout: 'grid',
          fields: [
            {
              key: 'orderNumber',
              label: 'Order ID',
              type: 'text',
              format: (value) => value ? `#${value}` : 'N/A'
            },
            {
              key: 'createdAt',
              label: 'Order Date',
              type: 'date',
              format: formatDate
            },
            {
              key: 'fulfillmentStatus',
              label: 'Status',
              type: 'badge',
              options: [
                { value: 'PENDING', label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', icon: Clock },
                { value: 'CONFIRMED', label: 'Confirmed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: CheckCircle },
                { value: 'PROCESSING', label: 'Processing', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', icon: Clock },
                { value: 'SHIPPED', label: 'Shipped', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300', icon: Truck },
                { value: 'DELIVERED', label: 'Delivered', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: CheckCircle },
                { value: 'CANCELLED', label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', icon: XCircle }
              ]
            },
            {
              key: 'totalAmount',
              label: 'Total Amount',
              type: 'currency',
              format: formatCurrency
            }
          ]
        },
        {
          title: 'Payment Details',
          layout: 'grid',
          fields: [
            {
              key: 'paymentStatus',
              label: 'Payment Status',
              type: 'badge',
              options: [
                { value: 'PENDING', label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
                { value: 'PAID', label: 'Paid', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
                { value: 'FAILED', label: 'Failed', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' },
                { value: 'REFUNDED', label: 'Refunded', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' }
              ]
            },
            {
              key: 'paymentMethod',
              label: 'Payment Method',
              type: 'text'
            }
          ]
        }
      ]
    },
    {
      id: 'customer',
      label: 'Customer',
      icon: User,
      sections: [
        {
          title: 'Customer Information',
          layout: 'grid',
          fields: [
            {
              key: 'shippingAddress.firstName',
              label: 'First Name',
              type: 'text'
            },
            {
              key: 'shippingAddress.lastName',
              label: 'Last Name',
              type: 'text'
            },
            {
              key: 'shippingAddress.email',
              label: 'Email',
              type: 'text'
            },
            {
              key: 'shippingAddress.phone',
              label: 'Phone',
              type: 'text'
            }
          ]
        }
      ]
    },
    {
      id: 'items',
      label: 'Items',
      icon: Package,
      customContent: (data) => (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Order Items ({data.items?.length || 0})</h4>
          {data.items?.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <span>{item.product?.name}</span>
                <span>{formatCurrency(item.price)} x {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ],

  footer: {
    actions: [
      {
        label: 'Print Order',
        mobileLabel: 'Print',
        icon: FileText,
        type: 'secondary',
        onClick: () => window.print()
      }
    ]
  }
};

// Product Configuration
export const productDetailConfig = {
  header: {
    title: (data) => data.name
  },
  
  tabs: [
    {
      id: 'overview',
      label: 'Overview',
      icon: Package,
      sections: [
        {
          title: 'Product Information',
          layout: 'grid',
          fields: [
            {
              key: 'name',
              label: 'Product Name',
              type: 'text'
            },
            {
              key: 'price',
              label: 'Price',
              type: 'currency',
              format: formatCurrency
            },
            {
              key: 'category',
              label: 'Category',
              type: 'text'
            },
            {
              key: 'inStock',
              label: 'Stock Status',
              type: 'badge',
              options: [
                { value: true, label: 'In Stock', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
                { value: false, label: 'Out of Stock', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
              ]
            }
          ]
        },
        {
          title: 'Description',
          layout: 'stack',
          fields: [
            {
              key: 'description',
              label: 'Product Description',
              type: 'textarea',
              format: stripHtml
            }
          ]
        }
      ]
    },
    {
      id: 'variants',
      label: 'Variants',
      icon: Layers,
      customContent: (data) => (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Product Variants ({data.printifyVariants?.length || 0})</h4>
          {data.printifyVariants?.map((variant, index) => (
            <div key={variant.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span>{variant.title}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  variant.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {variant.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {formatCurrency(variant.price)} • SKU: {variant.sku}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ],

  footer: {
    actions: [
      {
        label: 'View Live Product',
        mobileLabel: 'View Live',
        icon: ExternalLink,
        type: 'primary',
        onClick: (data) => window.open(`/products/${data.id}`, '_blank')
      }
    ]
  }
};

// User Configuration
export const userDetailConfig = {
  header: {
    title: (data) => data.name
  },
  
  tabs: [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      sections: [
        {
          title: 'Personal Information',
          layout: 'grid',
          fields: [
            {
              key: 'name',
              label: 'Full Name',
              type: 'text'
            },
            {
              key: 'email',
              label: 'Email',
              type: 'text'
            },
            {
              key: 'phone',
              label: 'Phone',
              type: 'text'
            },
            {
              key: 'isActive',
              label: 'Status',
              type: 'badge',
              options: [
                { value: true, label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: CheckCircle },
                { value: false, label: 'Inactive', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', icon: XCircle }
              ]
            }
          ]
        },
        {
          title: 'Account Details',
          layout: 'grid',
          fields: [
            {
              key: 'createdAt',
              label: 'Registered',
              type: 'date',
              format: formatDate
            },
            {
              key: 'emailVerified',
              label: 'Email Verified',
              type: 'badge',
              options: [
                { value: true, label: 'Verified', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
                { value: false, label: 'Unverified', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' }
              ]
            }
          ]
        }
      ]
    }
  ],

  footer: {
    actions: [
      {
        label: 'View Orders',
        mobileLabel: 'Orders',
        icon: ShoppingCart,
        type: 'secondary',
        onClick: (data) => console.log('View orders for:', data.id)
      }
    ]
  }
};

// Contact Configuration
export const contactDetailConfig = {
  header: {
    title: (data) => data.name
  },
  
  tabs: [
    {
      id: 'details',
      label: 'Details',
      icon: MessageSquare,
      sections: [
        {
          title: 'Contact Information',
          layout: 'grid',
          fields: [
            {
              key: 'name',
              label: 'Full Name',
              type: 'text'
            },
            {
              key: 'email',
              label: 'Email',
              type: 'text'
            },
            {
              key: 'phone',
              label: 'Phone',
              type: 'text'
            },
            {
              key: 'inquiryType',
              label: 'Inquiry Type',
              type: 'badge',
              options: [
                { value: 'GENERAL', label: 'General', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' },
                { value: 'ORDER_SUPPORT', label: 'Order Support', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
                { value: 'PRODUCT_QUESTION', label: 'Product Question', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
                { value: 'COMPLAINT', label: 'Complaint', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
              ]
            }
          ]
        },
        {
          title: 'Inquiry Details',
          layout: 'stack',
          fields: [
            {
              key: 'subject',
              label: 'Subject',
              type: 'text'
            },
            {
              key: 'message',
              label: 'Message',
              type: 'textarea'
            }
          ]
        }
      ]
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: FileText,
      sections: [
        {
          title: 'Management',
          layout: 'grid',
          fields: [
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'PENDING', label: 'Pending' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'RESOLVED', label: 'Resolved' },
                { value: 'CLOSED', label: 'Closed' }
              ]
            },
            {
              key: 'adminNotes',
              label: 'Admin Notes',
              type: 'textarea',
              placeholder: 'Add internal notes...'
            }
          ]
        }
      ]
    }
  ],

  footer: {
    actions: [
      {
        label: 'Mark as Resolved',
        mobileLabel: 'Resolve',
        icon: CheckCircle,
        type: 'primary',
        onClick: (data) => console.log('Resolve contact:', data.id)
      }
    ]
  }
};