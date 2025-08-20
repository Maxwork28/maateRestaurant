// constant/mealdata.ts

export const MEAL_DATA = {
  weekRanges: [
    { id: 1, range: "Apr 16 - Apr 22" },
    { id: 2, range: "Apr 23 - Apr 29" }
  ],
  plans: [
    {
      id: 1,
      name: 'Basic Plan',
      planid :'basic@',
      isActive: true,
      items: [
        {
          day: "Sunday",
          date: "23",
          items: {
            Breakfast: {
              name: "Oat Meal",
              description: "w/Fresh Fruit",
              calories: 320
            },
            Lunch: {
              name: "Veg Pulao",
              description: "w/Raita & Salad",
              calories: 450
            },
            Dinner: {
              name: "Dal Tadka",
              description: "w/Chapati & Rice",
              calories: 500
            }
          }
        },
        {
          day: "Monday",
          date: "24",
          items: {
            Breakfast: {
              name: "Avocado Toast",
              description: "w/Cheese & Tomato",
              calories: 350
            },
            Lunch: {
              name: "Grilled Chicken",
              description: "w/Mashed Potatoes",
              calories: 420
            },
            Dinner: {
              name: "Paneer Butter Masala",
              description: "w/Naan",
              calories: 540
            }
          }
        },
        {
          day: "Tuesday",
          date: "25",
          items: {
            Breakfast: {
              name: "Poha",
              description: "w/Peanuts & Lemon",
              calories: 300
            },
            Lunch: {
              name: "Rajma Rice",
              description: "Classic North Indian Combo",
              calories: 500
            },
            Dinner: {
              name: "Mixed Veg Curry",
              description: "w/Paratha",
              calories: 460
            }
          }
        },
        {
          day: "Wednesday",
          date: "26",
          items: {
            Breakfast: {
              name: "Idli Sambhar",
              description: "South Indian Classic",
              calories: 310
            },
            Lunch: {
              name: "Fried Rice",
              description: "w/Manchurian Gravy",
              calories: 480
            },
            Dinner: {
              name: "Egg Curry",
              description: "w/Chapati",
              calories: 520
            }
          }
        },
        {
          day: "Thursday",
          date: "27",
          items: {
            Breakfast: {
              name: "Paratha",
              description: "w/Curd & Pickle",
              calories: 380
            },
            Lunch: {
              name: "Chicken Biryani",
              description: "Spicy Hyderabad Style",
              calories: 600
            },
            Dinner: {
              name: "Aloo Gobi",
              description: "w/Chapati",
              calories: 430
            }
          }
        },
        {
          day: "Friday",
          date: "28",
          items: {
            Breakfast: {
              name: "Upma",
              description: "w/Chutney",
              calories: 290
            },
            Lunch: {
              name: "Chole Bhature",
              description: "Punjabi Style",
              calories: 700
            },
            Dinner: {
              name: "Palak Paneer",
              description: "w/Roti",
              calories: 480
            }
          }
        },
        {
          day: "Saturday",
          date: "29",
          items: {
            Breakfast: {
              name: "Cornflakes",
              description: "w/Milk & Fruits",
              calories: 260
            },
            Lunch: {
              name: "Kadhi Rice",
              description: "Light & Healthy",
              calories: 400
            },
            Dinner: {
              name: "Matar Paneer",
              description: "w/Chapati",
              calories: 450
            }
          }
        }
      ]
    },
    {
      id: 2,
      name: 'Moderate Plan',
      planid :'moderate@',

      isActive: true,
      items: [
        {
          day: "Sunday",
          date: "23",
          items: {
            Breakfast: {
              name: "Oat Meal",
              description: "w/Fresh Fruit",
              calories: 320
            },
            Lunch: {
              name: "Veg Pulao",
              description: "w/Raita & Salad",
              calories: 450
            },
            Dinner: {
              name: "Dal Tadka",
              description: "w/Chapati & Rice",
              calories: 500
            }
          }
        },
        {
          day: "Monday",
          date: "24",
          items: {
            Breakfast: {
              name: "Avocado Toast",
              description: "w/Cheese & Tomato",
              calories: 350
            },
            Lunch: {
              name: "Grilled Chicken",
              description: "w/Mashed Potatoes",
              calories: 420
            },
            Dinner: {
              name: "Paneer Butter Masala",
              description: "w/Naan",
              calories: 540
            }
          }
        },
        {
          day: "Tuesday",
          date: "25",
          items: {
            Breakfast: {
              name: "Poha",
              description: "w/Peanuts & Lemon",
              calories: 300
            },
            Lunch: {
              name: "Rajma Rice",
              description: "Classic North Indian Combo",
              calories: 500
            },
            Dinner: {
              name: "Mixed Veg Curry",
              description: "w/Paratha",
              calories: 460
            }
          }
        },
        {
          day: "Wednesday",
          date: "26",
          items: {
            Breakfast: {
              name: "Idli Sambhar",
              description: "South Indian Classic",
              calories: 310
            },
            Lunch: {
              name: "Fried Rice",
              description: "w/Manchurian Gravy",
              calories: 480
            },
            Dinner: {
              name: "Egg Curry",
              description: "w/Chapati",
              calories: 520
            }
          }
        },
        {
          day: "Thursday",
          date: "27",
          items: {
            Breakfast: {
              name: "Paratha",
              description: "w/Curd & Pickle",
              calories: 380
            },
            Lunch: {
              name: "Chicken Biryani",
              description: "Spicy Hyderabad Style",
              calories: 600
            },
            Dinner: {
              name: "Aloo Gobi",
              description: "w/Chapati",
              calories: 430
            }
          }
        },
        {
          day: "Friday",
          date: "28",
          items: {
            Breakfast: {
              name: "Upma",
              description: "w/Chutney",
              calories: 290
            },
            Lunch: {
              name: "Chole Bhature",
              description: "Punjabi Style",
              calories: 700
            },
            Dinner: {
              name: "Palak Paneer",
              description: "w/Roti",
              calories: 480
            }
          }
        },
        {
          day: "Saturday",
          date: "29",
          items: {
            Breakfast: {
              name: "Cornflakes",
              description: "w/Milk & Fruits",
              calories: 260
            },
            Lunch: {
              name: "Kadhi Rice",
              description: "Light & Healthy",
              calories: 400
            },
            Dinner: {
              name: "Matar Paneer",
              description: "w/Chapati",
              calories: 450
            }
          }
        },
          {
          day: "Sunday",
          date: "16",
          items: {
            Breakfast: {
              name: "Protein Pancakes",
              description: "Blueberries & Syrup",
              calories: 380
            },
            Lunch: {
              name: "Grilled Salmon",
              description: "Quinoa & Vegetables",
              calories: 520
            },
            Dinner: {
              name: "Chicken Stir Fry",
              description: "Brown Rice",
              calories: 480
            }
          }
        },
        {
          day: "Monday",
          date: "17",
          items: {
            Breakfast: {
              name: "Greek Yogurt Bowl",
              description: "Granola & Berries",
              calories: 320
            },
            Lunch: {
              name: "Turkey Sandwich",
              description: "Whole Grain Bread",
              calories: 420
            },
            Dinner: {
              name: "Vegetable Curry",
              description: "Jasmine Rice",
              calories: 450
            }
          }
        },
        {
          day: "Tuesday",
          date: "18",
          items: {
            Breakfast: {
              name: "Smoothie Bowl",
              description: "Acai & Granola",
              calories: 340
            },
            Lunch: {
              name: "Chicken Caesar Salad",
              description: "Croutons & Dressing",
              calories: 380
            },
            Dinner: {
              name: "Beef Stir Fry",
              description: "Noodles",
              calories: 520
            }
          }
        },
        {
          day: "Wednesday",
          date: "19",
          items: {
            Breakfast: {
              name: "Omelette",
              description: "Cheese & Vegetables",
              calories: 300
            },
            Lunch: {
              name: "Sushi Bowl",
              description: "Salmon & Avocado",
              calories: 460
            },
            Dinner: {
              name: "Pasta Primavera",
              description: "Seasonal Vegetables",
              calories: 480
            }
          }
        },
        {
          day: "Thursday",
          date: "20",
          items: {
            Breakfast: {
              name: "Chia Seed Pudding",
              description: "Mango & Coconut",
              calories: 280
            },
            Lunch: {
              name: "Quinoa Salad",
              description: "Grilled Chicken",
              calories: 420
            },
            Dinner: {
              name: "Fish Tacos",
              description: "Corn Tortillas",
              calories: 440
            }
          }
        },
        {
          day: "Friday",
          date: "21",
          items: {
            Breakfast: {
              name: "Breakfast Burrito",
              description: "Eggs & Salsa",
              calories: 400
            },
            Lunch: {
              name: "Mediterranean Bowl",
              description: "Hummus & Falafel",
              calories: 480
            },
            Dinner: {
              name: "Grilled Chicken",
              description: "Sweet Potato",
              calories: 460
            }
          }
        },
        {
          day: "Saturday",
          date: "22",
          items: {
            Breakfast: {
              name: "French Toast",
              description: "Strawberries & Cream",
              calories: 420
            },
            Lunch: {
              name: "Poke Bowl",
              description: "Tuna & Rice",
              calories: 500
            },
            Dinner: {
              name: "Vegetable Lasagna",
              description: "Side Salad",
              calories: 520
            }
          }
        }
      ]
    },
     {
      id: 3,
      name: 'Premium Plan',
      planid :'premium@',
      isActive: true,
      items: [
        {
          day: "Sunday",
          date: "23",
          items: {
            Breakfast: {
              name: "Oat Meal",
              description: "w/Fresh Fruit",
              calories: 320
            },
            Lunch: {
              name: "Veg Pulao",
              description: "w/Raita & Salad",
              calories: 450
            },
            Dinner: {
              name: "Dal Tadka",
              description: "w/Chapati & Rice",
              calories: 500
            }
          }
        },
        {
          day: "Monday",
          date: "24",
          items: {
            Breakfast: {
              name: "Avocado Toast",
              description: "w/Cheese & Tomato",
              calories: 350
            },
            Lunch: {
              name: "Grilled Chicken",
              description: "w/Mashed Potatoes",
              calories: 420
            },
            Dinner: {
              name: "Paneer Butter Masala",
              description: "w/Naan",
              calories: 540
            }
          }
        },
        {
          day: "Tuesday",
          date: "25",
          items: {
            Breakfast: {
              name: "Poha",
              description: "w/Peanuts & Lemon",
              calories: 300
            },
            Lunch: {
              name: "Rajma Rice",
              description: "Classic North Indian Combo",
              calories: 500
            },
            Dinner: {
              name: "Mixed Veg Curry",
              description: "w/Paratha",
              calories: 460
            }
          }
        },
        {
          day: "Wednesday",
          date: "26",
          items: {
            Breakfast: {
              name: "Idli Sambhar",
              description: "South Indian Classic",
              calories: 310
            },
            Lunch: {
              name: "Fried Rice",
              description: "w/Manchurian Gravy",
              calories: 480
            },
            Dinner: {
              name: "Egg Curry",
              description: "w/Chapati",
              calories: 520
            }
          }
        },
        {
          day: "Thursday",
          date: "27",
          items: {
            Breakfast: {
              name: "Paratha",
              description: "w/Curd & Pickle",
              calories: 380
            },
            Lunch: {
              name: "Chicken Biryani",
              description: "Spicy Hyderabad Style",
              calories: 600
            },
            Dinner: {
              name: "Aloo Gobi",
              description: "w/Chapati",
              calories: 430
            }
          }
        },
        {
          day: "Friday",
          date: "28",
          items: {
            Breakfast: {
              name: "Upma",
              description: "w/Chutney",
              calories: 290
            },
            Lunch: {
              name: "Chole Bhature",
              description: "Punjabi Style",
              calories: 700
            },
            Dinner: {
              name: "Palak Paneer",
              description: "w/Roti",
              calories: 480
            }
          }
        },
        {
          day: "Saturday",
          date: "29",
          items: {
            Breakfast: {
              name: "Cornflakes",
              description: "w/Milk & Fruits",
              calories: 260
            },
            Lunch: {
              name: "Kadhi Rice",
              description: "Light & Healthy",
              calories: 400
            },
            Dinner: {
              name: "Matar Paneer",
              description: "w/Chapati",
              calories: 450
            }
          }
        }
      ]
    },
  ]
};
