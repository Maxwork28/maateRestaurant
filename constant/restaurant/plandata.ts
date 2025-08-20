// constants/planData.js
export const PLAN_DATA = {
  plans: [
    {
      id: 1,
      planid :'basic@',
      name: 'Basic Plan',
      price: 440,
      currency: '₹',
      period: '1 week',
      features: [
        { 
          id: 1, 
          name: 'Add Meal By your choice', 
          details: 'Add extra meals to your weekly plan' 
        },
        { 
          id: 2, 
          name: 'Customize Your Plan', 
          details: 'Customize meals according to your preferences' 
        }
      ]
    },
    {
      id: 2,
      planid :'moderate@',
      name: 'Moderate Plan',
      price: 440,
      currency: '₹',
      period: '1 week',
      features: [
        { 
          id: 1, 
          name: 'Add Meal Options', 
          details: 'Add extra meals to your weekly plan' 
        },
        { 
          id: 2, 
          name: 'Customize Your Plan', 
          details: 'Customize meals according to your preferences' 
        }
      ]
    },
    {
      id: 3,
      name: 'Premium Plan',
      planid :'premium@',
      price: 440,
      currency: '₹',
      period: '2 week',
      features: [
        { 
          id: 1, 
          name: 'Add Meal Options', 
          details: 'Add extra meals to your weekly plan' 
        },
        { 
          id: 2, 
          name: 'Customize Your Plan', 
          details: 'Customize meals according to your preferences' 
        }
      ]
    }
  ]
};