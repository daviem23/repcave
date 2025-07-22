import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFitnessProfile } from '../hooks/useDatabase';
import Header from '../components/Header';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProfile } = useFitnessProfile();
  const [searchParams] = useSearchParams();
  const isRegenerate = searchParams.get('regenerate') === 'true';
  
  const [currentStep, setCurrentStep] = useState(isRegenerate ? 0 : 0);
  const [formData, setFormData] = useState({
    pushupLevel: '',
    squatLevel: '',
    effortLevel: '',
    equipment: [] as string[],
    workoutDuration: '',
  });

  const steps = [
    {
      title: 'How many push-ups can you do?',
      type: 'single',
      key: 'pushupLevel',
      options: ['0–5', '6–15', '16–30', '31+'],
    },
    {
      title: 'How many squats can you do?',
      type: 'single',
      key: 'squatLevel',
      options: ['0–5', '6–15', '16–30', '31+'],
    },
    {
      title: 'How do you feel after ten push-ups and ten squats?',
      type: 'single',
      key: 'effortLevel',
      options: [
        'I barely broke a sweat — felt easy',
        'Breathing a little heavy, but I could do more',
        'That was tough — needed real effort',
        "I'm wiped out — that was my limit",
      ],
    },
    {
      title: 'What equipment do you have access to?',
      type: 'multi',
      key: 'equipment',
      options: [
        'Bodyweight only',
        'Dumbbells or kettlebells',
        'Resistance bands',
        'Full gym or barbell setup',
        'DIY (e.g. backpack, chair, etc.)',
      ],
    },
    {
      title: 'How long do you want each workout to last?',
      type: 'single',
      key: 'workoutDuration',
      options: [
        '10-20 minutes (quick & efficient)',
        '30 minutes (balanced)',
        '45 minutes (moderate intensity)',
        '60 minutes (longer sessions / advanced)',
      ],
    },
  ];

  const currentStepData = steps[currentStep];
  const totalSteps = steps.length;
  const displayStep = isRegenerate ? currentStep : currentStep + 1;

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.key]: value,
    }));
  };

  const handleMultiSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(value)
        ? prev.equipment.filter(item => item !== value)
        : [...prev.equipment, value],
    }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Generate plan
      console.log('Generating plan with:', formData);
      
      // Save fitness profile to database
      try {
        await createProfile({
          pushupLevel: formData.pushupLevel as '0-5' | '6-15' | '16-30' | '31+',
          squatLevel: formData.squatLevel as '0-5' | '6-15' | '16-30' | '31+',
          effortLevel: mapEffortLevel(formData.effortLevel),
          equipment: formData.equipment,
          workoutDuration: mapWorkoutDuration(formData.workoutDuration),
          goals: ['Build Muscle', 'Stay Consistent'], // Default goals
        });
        
        console.log('Fitness profile saved successfully');
      } catch (error) {
        console.error('Error saving fitness profile:', error);
        // Continue to plan even if profile save fails
      }
      
      navigate('/plan');
    }
  };

  // Helper functions to map form values to database enums
  const mapEffortLevel = (effort: string): 'easy' | 'moderate' | 'tough' | 'limit' => {
    if (effort.includes('barely broke a sweat')) return 'easy';
    if (effort.includes('Breathing a little heavy')) return 'moderate';
    if (effort.includes('That was tough')) return 'tough';
    return 'limit';
  };

  const mapWorkoutDuration = (duration: string): '10-20' | '30' | '45' | '60' => {
    if (duration.includes('10-20')) return '10-20';
    if (duration.includes('30 minutes')) return '30';
    if (duration.includes('45')) return '45';
    return '60';
  };

  const isStepValid = () => {
    const value = formData[currentStepData.key as keyof typeof formData];
    if (currentStepData.type === 'multi') {
      return (value as string[]).length > 0;
    }
    return value && value.toString().trim() !== '';
  };

  return (
    <div>
      <Header 
        title={isRegenerate ? 'Update Your Plan' : `Welcome, ${user?.user_metadata?.name || 'User'}!`} 
        showBack={true}
      />
      
      <div className="p-4 min-h-screen flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-text-light mb-2">
            <span>Step {displayStep} of {totalSteps}</span>
            <span>{Math.round((displayStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-background-alternate rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(displayStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-dark mb-8">
            {currentStepData.title}
          </h1>

          {currentStepData.type === 'single' && (
            <div className="space-y-3">
              {currentStepData.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleInputChange(option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    formData[currentStepData.key as keyof typeof formData] === option
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border hover:border-primary hover:bg-primary-light'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData[currentStepData.key as keyof typeof formData] === option
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {formData[currentStepData.key as keyof typeof formData] === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentStepData.type === 'multi' && (
            <div className="space-y-3">
              {currentStepData.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect(option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    formData.equipment.includes(option)
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border hover:border-primary hover:bg-primary-light'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 ${
                      formData.equipment.includes(option)
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {formData.equipment.includes(option) && (
                        <div className="w-full h-full bg-white scale-50 rounded-sm" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-6 py-3 text-text-light hover:text-text-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all ${
              isStepValid()
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-background-alternate text-text-light cursor-not-allowed'
            }`}
          >
            <span>
              {currentStep === totalSteps - 1 
                ? (isRegenerate ? 'Update Plan' : 'Build My Plan')
                : 'Next'
              }
            </span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
      //     effortLevel: formData.effortLevel,
      //     equipment: formData.equipment,
      //     workoutDuration: formData.workoutDuration,
      //     goals: ['Build Muscle', 'Stay Consistent'], // Default goals
      //   });
      // }
      
      navigate('/plan');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const isStepValid = () => {
    const value = formData[currentStepData.key as keyof typeof formData];
    if (currentStepData.type === 'multi') {
      return (value as string[]).length > 0;
    }
    return value && value.toString().trim() !== '';
  };

  return (
    <div>
      <Header 
        title={isRegenerate ? 'Update Your Plan' : 'Let\'s Get Started'} 
        showBack={true}
      />
      
      <div className="p-4 min-h-screen flex flex-col">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-text-light mb-2">
            <span>Step {displayStep} of {totalSteps}</span>
            <span>{Math.round((displayStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-background-alternate rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(displayStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-dark mb-8">
            {currentStepData.title}
          </h1>

          {currentStepData.type === 'text' && (
            <input
              type="text"
              value={formData[currentStepData.key as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter your name..."
              className="w-full p-4 text-lg border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              autoFocus
            />
          )}

          {currentStepData.type === 'single' && (
            <div className="space-y-3">
              {currentStepData.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleInputChange(option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    formData[currentStepData.key as keyof typeof formData] === option
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border hover:border-primary hover:bg-primary-light'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData[currentStepData.key as keyof typeof formData] === option
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {formData[currentStepData.key as keyof typeof formData] === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentStepData.type === 'multi' && (
            <div className="space-y-3">
              {currentStepData.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect(option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    formData.equipment.includes(option)
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border hover:border-primary hover:bg-primary-light'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 ${
                      formData.equipment.includes(option)
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {formData.equipment.includes(option) && (
                        <div className="w-full h-full bg-white scale-50 rounded-sm" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-6 py-3 text-text-light hover:text-text-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all ${
              isStepValid()
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-background-alternate text-text-light cursor-not-allowed'
            }`}
          >
            <span>
              {currentStep === totalSteps - 1 
                ? (isRegenerate ? 'Update Plan' : 'Build My Plan')
                : 'Next'
              }
            </span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;