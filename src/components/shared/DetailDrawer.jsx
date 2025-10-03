// src/components/shared/DetailDrawer.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  FileText,
  Edit3,
  Save,
  Loader
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const DetailDrawer = ({
  // Content
  title,
  subtitle,
  data,
  
  // Configuration
  config,
  
  // State
  isOpen = true,
  onClose,
  onSave,
  onEdit,
  
  // UI
  isLoading = false,
  isEditing = false,
  onToggleEdit,
  
  // Customization
  size = 'default', // 'default' | 'large' | 'full'
  showHeader = true,
  showFooter = true,
  className = ''
}) => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeTab, setActiveTab] = useState(config?.tabs?.[0]?.id || 'overview');
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Get size classes
  const getSizeClasses = () => {
    const sizes = {
      default: isMobile ? 'max-w-full' : isTablet ? 'max-w-2xl' : 'max-w-2xl',
      large: isMobile ? 'max-w-full' : isTablet ? 'max-w-3xl' : 'max-w-3xl',
      full: 'max-w-full'
    };
    return sizes[size] || sizes.default;
  };

  // Theme classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          container: 'bg-gray-900 border-gray-700 text-white',
          card: 'bg-gray-800 border-gray-700',
          header: 'bg-gray-800 border-gray-700',
          footer: 'bg-gray-800 border-gray-700',
          tab: {
            container: 'bg-gray-800',
            active: 'bg-blue-600 text-white',
            inactive: 'text-gray-300 hover:text-white hover:bg-gray-700'
          },
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
            danger: 'bg-red-600 hover:bg-red-700 text-white'
          },
          text: {
            primary: 'text-white',
            secondary: 'text-gray-300',
            muted: 'text-gray-400'
          }
        };
      case 'smokey':
        return {
          container: 'bg-gray-800 border-gray-600 text-gray-100',
          card: 'bg-gray-700 border-gray-600',
          header: 'bg-gray-700 border-gray-600',
          footer: 'bg-gray-700 border-gray-600',
          tab: {
            container: 'bg-gray-700',
            active: 'bg-blue-500 text-white',
            inactive: 'text-gray-300 hover:text-white hover:bg-gray-600'
          },
          button: {
            primary: 'bg-blue-500 hover:bg-blue-600 text-white',
            secondary: 'bg-gray-600 hover:bg-gray-500 text-white',
            danger: 'bg-red-500 hover:bg-red-600 text-white'
          },
          text: {
            primary: 'text-gray-100',
            secondary: 'text-gray-300',
            muted: 'text-gray-400'
          }
        };
      default:
        return {
          container: 'bg-white border-gray-200 text-gray-900',
          card: 'bg-gray-50 border-gray-200',
          header: 'bg-white border-gray-200',
          footer: 'bg-white border-gray-200',
          tab: {
            container: 'bg-gray-100',
            active: 'bg-blue-500 text-white',
            inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          },
          button: {
            primary: 'bg-blue-500 hover:bg-blue-600 text-white',
            secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
            danger: 'bg-red-500 hover:bg-red-600 text-white'
          },
          text: {
            primary: 'text-gray-900',
            secondary: 'text-gray-600',
            muted: 'text-gray-500'
          }
        };
    }
  };

  const themeClasses = getThemeClasses();

  // Responsive grid classes
  const getGridClasses = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2';
  };

  // Handle field changes in edit mode
  const handleFieldChange = (fieldKey, value) => {
    setLocalData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  // Save changes
  const handleSave = async () => {
    if (onSave) {
      await onSave(localData);
    }
    if (onToggleEdit) {
      onToggleEdit(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setLocalData(data);
    if (onToggleEdit) {
      onToggleEdit(false);
    }
  };

  // Render field based on type
  const renderField = (field, value) => {
    const { type, key, label, options, placeholder, format } = field;

    const formattedValue = format ? format(value) : value;

    switch (type) {
      case 'text':
        return isEditing ? (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        ) : (
          <span>{formattedValue || 'N/A'}</span>
        );

      case 'textarea':
        return isEditing ? (
          <textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        ) : (
          <span className="whitespace-pre-wrap">{formattedValue || 'N/A'}</span>
        );

      case 'select':
        return isEditing ? (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <span>{options?.find(opt => opt.value === value)?.label || formattedValue || 'N/A'}</span>
        );

      case 'badge':
        const badgeConfig = options?.find(opt => opt.value === value) || {};
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeConfig.className}`}>
            {badgeConfig.icon && <badgeConfig.icon className="w-3 h-3 mr-1" />}
            {badgeConfig.label || value}
          </span>
        );

      case 'currency':
        return <span>{formattedValue}</span>;

      case 'date':
        return <span>{formattedValue}</span>;

      case 'image':
        return (
          <div className="relative">
            <img
              src={value}
              alt={label}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/api/placeholder/300/200';
              }}
            />
          </div>
        );

      default:
        return <span>{formattedValue || 'N/A'}</span>;
    }
  };

  // Render section
  const renderSection = (section) => {
    const { title, fields, layout = 'grid' } = section;

    return (
      <section key={title} className="space-y-4">
        {title && (
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h4>
        )}
        
        {layout === 'grid' ? (
          <div className={`grid ${getGridClasses()} gap-4`}>
            {fields.map(field => (
              <div key={field.key} className={`p-4 rounded-lg ${themeClasses.card}`}>
                <label className="block text-sm font-semibold opacity-75 mb-2">
                  {field.label}
                </label>
                <div className="text-sm">
                  {renderField(field, localData[field.key])}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map(field => (
              <div key={field.key} className={`p-3 rounded-lg ${themeClasses.card}`}>
                <label className="block text-sm font-semibold opacity-75 mb-2">
                  {field.label}
                </label>
                <div className="text-sm">
                  {renderField(field, localData[field.key])}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // Render tab content
  const renderTabContent = (tabId) => {
    const tab = config?.tabs?.find(t => t.id === tabId);
    if (!tab) return null;

    return (
      <div className="space-y-6">
        {tab.sections?.map(section => renderSection(section))}
        {tab.customContent && tab.customContent(localData, isEditing, handleFieldChange)}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={`
        fixed inset-y-0 right-0 w-full 
        ${getSizeClasses()}
        ${themeClasses.container} 
        border-l shadow-2xl overflow-hidden flex flex-col z-50
        ${className}
      `}
    >
      {/* Header */}
      {showHeader && (
        <div className={`p-4 sm:p-6 border-b ${themeClasses.header} flex-shrink-0`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {isMobile && (
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg transition-colors ${themeClasses.button.secondary} flex-shrink-0`}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold truncate">
                    {config?.header?.title?.(localData) || title}
                  </h3>
                  {subtitle && (
                    <p className={`text-xs sm:text-sm ${themeClasses.text.muted} mt-1 truncate`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {!isMobile && (
              <div className="flex items-center gap-2">
                {onToggleEdit && (
                  <motion.button
                    onClick={() => onToggleEdit(!isEditing)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg transition-colors ${themeClasses.button.secondary}`}
                  >
                    {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                  </motion.button>
                )}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg transition-colors ${themeClasses.button.secondary}`}
                >
                  <X size={20} />
                </motion.button>
              </div>
            )}
          </div>

          {/* Tabs */}
          {config?.tabs && (
            <div className={`flex p-1 rounded-lg ${themeClasses.tab.container}`}>
              {config.tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex-1 min-w-0 py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md 
                      transition-all flex items-center justify-center gap-1 sm:gap-2
                      ${activeTab === tab.id ? themeClasses.tab.active : themeClasses.tab.inactive}
                    `}
                  >
                    <IconComponent size={isMobile ? 12 : 14} />
                    <span className="truncate">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className={`p-3 sm:p-4 border-t ${themeClasses.footer} flex-shrink-0`}>
          <div className="flex gap-2 sm:gap-3">
            {config?.footer?.actions?.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium ${themeClasses.button[action.type] || themeClasses.button.secondary}`}
              >
                {action.icon && <action.icon size={isMobile ? 14 : 16} />}
                {isMobile ? action.mobileLabel || action.label : action.label}
              </motion.button>
            ))}
            
            {isEditing && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center text-xs sm:text-sm font-medium ${themeClasses.button.primary} disabled:opacity-50`}
                >
                  {isLoading && <Loader className="w-4 h-4 animate-spin mr-2" />}
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center text-xs sm:text-sm font-medium ${themeClasses.button.secondary}`}
                >
                  Cancel
                </motion.button>
              </>
            )}

            {isMobile && !isEditing && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`py-2 px-4 rounded-lg transition-all flex items-center justify-center text-xs sm:text-sm font-medium ${themeClasses.button.primary}`}
              >
                Done
              </motion.button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DetailDrawer;