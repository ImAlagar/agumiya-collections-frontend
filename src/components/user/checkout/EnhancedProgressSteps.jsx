// components/users/checkout/EnhancedProgressSteps.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EnhancedProgressSteps = ({ currentStep, steps }) => {
  const [prevStep, setPrevStep] = useState(1);
  const [travelingIcon, setTravelingIcon] = useState(steps[0].icon);
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelDirection, setTravelDirection] = useState(1);

  useEffect(() => {
    if (currentStep !== prevStep) {
      const direction = currentStep > prevStep ? 1 : -1;
      setTravelDirection(direction);
      
      // Start traveling animation
      setIsTraveling(true);
      setTravelingIcon(steps[prevStep - 1].icon);
      
      const travelTime = 1000;
      
      setTimeout(() => {
        setIsTraveling(false);
        setPrevStep(currentStep);
      }, travelTime);
    }
  }, [currentStep, prevStep, steps]);

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const floatingAnimation = {
    animate: { 
      y: [-8, 8, -8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-16"
    >
      <div className="flex items-center justify-center relative">
        {/* Background decoration */}
        <motion.div
          initial={{ y: 0 }}
          animate="animate"
          variants={floatingAnimation}
          className="absolute -top-8 -left-8 w-16 h-16 bg-primary-500/10 rounded-full blur-xl"
        />
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isUpcoming = currentStep < step.number;
          const stepPosition = index + 1;

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <motion.div 
                className="flex flex-col items-center relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                {/* Connection Line Background */}
                {index > 0 && (
                  <div className="absolute -left-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-10" />
                )}
                
                {/* Step Circle */}
                <motion.div
                  className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 font-semibold text-xl transition-all duration-500 ${
                    isCompleted
                      ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : isActive
                      ? 'border-primary-500 bg-white dark:bg-gray-800 text-primary-500 shadow-lg'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400'
                  }`}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{
                    type: "tween",
                    duration: 0.3,
                    repeat: isActive ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                >
                  {/* Completed Checkmark */}
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "tween", duration: 0.3 }}
                    >
                      ✓
                    </motion.div>
                  )}
                  
                  {/* Current Step Icon */}
                  {isActive && !isCompleted && (
                    <motion.div
                      key={`active-${step.number}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "tween", duration: 0.3 }}
                    >
                      {step.icon}
                    </motion.div>
                  )}
                  
                  {/* Upcoming Step Icon */}
                  {isUpcoming && (
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.icon}
                    </motion.div>
                  )}
                </motion.div>

                {/* Traveling Icon Animation */}
                {isTraveling && stepPosition === currentStep && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm shadow-lg z-20"
                    initial={{ 
                      scale: 0, 
                      x: travelDirection > 0 ? -50 : 50,
                    }}
                    animate={{ 
                      scale: 1, 
                      x: 0, 
                    }}
                    transition={{
                      type: "tween",
                      duration: 0.3
                    }}
                  >
                    {travelingIcon}
                  </motion.div>
                )}

                {/* Step Labels */}
                <div className="mt-3 text-center">
                  <div className={`text-sm font-semibold transition-colors ${
                    isCompleted || isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </motion.div>
              
              {/* Animated Progress Bar between steps */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 relative h-2">
                  {/* Background Bar */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full" />
                  
                  {/* Progress Fill */}
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: progressPercentage >= (index + 1) * (100 / (steps.length - 1)) 
                        ? '100%' 
                        : '0%' 
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  
                  {/* Traveling Icon Animation between steps */}
                  {isTraveling && (
                    <motion.div
                      className="absolute top-1/2 w-6 h-6 -mt-3 flex items-center justify-center text-white text-xs bg-gradient-to-r from-primary-500 to-purple-500 rounded-full shadow-lg z-10"
                      initial={{ 
                        x: '0%', 
                        scale: 0.8,
                      }}
                      animate={{ 
                        x: travelDirection > 0 ? '100%' : '0%',
                        scale: 1,
                      }}
                      transition={{
                        x: {
                          duration: 0.8,
                          ease: "easeInOut",
                        },
                        scale: {
                          duration: 0.2
                        }
                      }}
                    >
                      {travelingIcon}
                    </motion.div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Progress Bar */}
      <div className="mt-8 lg:hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full shadow-md relative"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Mobile Traveling Icon */}
            {isTraveling && (
              <motion.div
                className="absolute -right-2 -top-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-primary-500 text-xs shadow-lg border"
                initial={{ scale: 0, x: 0 }}
                animate={{ 
                  scale: 1,
                  x: travelDirection > 0 ? '100%' : '0%'
                }}
                transition={{
                  x: {
                    duration: 0.8,
                    ease: "easeInOut"
                  },
                  scale: {
                    duration: 0.3
                  }
                }}
              >
                {travelingIcon}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedProgressSteps;