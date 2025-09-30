// components/users/checkout/ProfessionalProgressSteps.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfessionalProgressSteps = ({ currentStep, steps }) => {
  const [direction, setDirection] = useState(1);
  const [prevStep, setPrevStep] = useState(currentStep);

  useEffect(() => {
    setDirection(currentStep > prevStep ? 1 : -1);
    setPrevStep(currentStep);
  }, [currentStep]);

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const iconVariants = {
    inactive: { scale: 0.8, opacity: 0.7 },
    active: { 
      scale: 1.1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    completed: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="w-full  px-4 py-8">
      {/* Main Progress Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Background Glow Effect */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 -mx-8 rounded-2xl pointer-events-none"
        />

        {/* Progress Bar Background */}
        <div className="relative mb-12">
          {/* Main Progress Track */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2 -z-10" />
          
          {/* Animated Progress Fill */}
          <motion.div
            className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transform -translate-y-1/2 -z-10"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.2 
            }}
          />

          {/* Progress Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > stepNumber;
              const isActive = currentStep === stepNumber;
              const isUpcoming = currentStep < stepNumber;

              return (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  className="flex flex-col items-center relative"
                >
                  {/* Step Connector Lines */}
                  {index > 0 && (
                    <div className="absolute top-4 -left-1/2 w-full h-0.5 bg-transparent" />
                  )}

                  {/* Step Circle */}
                  <motion.div
                    className={`
                      relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl border-2 font-semibold text-lg
                      transition-all duration-300 backdrop-blur-sm
                      ${isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600 text-white shadow-lg shadow-green-500/25'
                        : isActive
                        ? 'bg-white/90 dark:bg-gray-800/90 border-blue-500 text-blue-600 shadow-2xl shadow-blue-500/20 backdrop-blur-md'
                        : 'bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 text-gray-400 shadow-sm'
                      }
                    `}
                    variants={iconVariants}
                    initial="inactive"
                    animate={isActive ? "active" : isCompleted ? "completed" : "inactive"}
                    whileHover={{ 
                      scale: 1.05, 
                      transition: { duration: 0.2 } 
                    }}
                  >
                    {/* Step Number/Icon */}
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="completed"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          className="flex items-center justify-center"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="number"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center justify-center"
                        >
                          {isActive ? (
                            <motion.div
                              animate={pulseAnimation}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                            />
                          ) : (
                            stepNumber
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active Step Ring */}
                    {isActive && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-blue-500/30"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-blue-500/20"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [1, 0, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                        />
                      </>
                    )}
                  </motion.div>

                  {/* Step Label Container */}
                  <div className="mt-4 text-center max-w-32">
                    {/* Step Title */}
                    <motion.div
                      className={`
                        text-sm font-semibold transition-colors duration-300
                        ${isCompleted
                          ? 'text-green-600 dark:text-green-400'
                          : isActive
                          ? 'text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-gray-500 dark:text-gray-400'
                        }
                      `}
                      animate={{
                        y: isActive ? [-5, 0] : 0
                      }}
                      transition={{
                        duration: 0.3,
                        delay: isActive ? 0.2 : 0
                      }}
                    >
                      {step.title}
                    </motion.div>

                    {/* Step Description */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xs text-gray-600 dark:text-gray-400 mt-1 overflow-hidden"
                        >
                          {step.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Progress Indicator Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-full h-0.5 -z-10">
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: isCompleted ? '100%' : isActive ? '50%' : '0%' 
                        }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Compact View */}
        <div className="lg:hidden mt-8 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 * direction }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400"
            >
              Step {currentStep} of {steps.length}
            </motion.div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {steps[currentStep - 1]?.title}
            </div>
          </div>
          
          {/* Mobile Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Animated Glow */}
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                animate={{
                  x: ['-100%', '100%', '-100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>

          {/* Current Step Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-desc-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center"
            >
              {steps[currentStep - 1]?.description}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalProgressSteps;