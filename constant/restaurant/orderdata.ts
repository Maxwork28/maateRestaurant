// Order data constants
export const orderData = {
  orders: [
    {
      id: 1,
      uniqueKey: 'order_1_1',
      price: '202.00',
      date: 'June 1, 2020',
      time: '08:22AM',
      status: 'Order in',
      address: 'Elm Street, 23',
      menuItems: [
        {
          id: 1,
          name: 'Pepperoni Pizza',
          image: '../../../../assets/images/burger.jpg',
          price: '5.59',
          quantity: 2,
        },
        {
          id: 2,
          name: 'Cheese Burger',
          image: '../../../../assets/images/burger.jpg',
          price: '4.99',
          quantity: 1,
        },
      ],
    },
    {
      id: 2,
      uniqueKey: 'order_1_2',
      price: '310.00',
      date: 'June 1, 2020',
      time: '09:10AM',
      status: 'Prepared',
      address: 'Sunset Boulevard, 45',
      menuItems: [
        {
          id: 3,
          name: 'Veggie Burger',
          image: '../../../../assets/images/burger.jpg',
          price: '3.99',
          quantity: 3,
        },
      ],
    },
    {
      id: 3,
      uniqueKey: 'order_1_3',
      price: '450.00',
      date: 'June 1, 2020',
      time: '10:15AM',
      status: 'Delivered',
      address: 'Maple Avenue, 12',
      menuItems: [
        {
          id: 4,
          name: 'Grilled Sandwich',
          image: '../../../../assets/images/burger.jpg',
          price: '6.59',
          quantity: 2,
        },
        {
          id: 5,
          name: 'Pasta Alfredo',
          image: '../../../../assets/images/burger.jpg',
          price: '8.99',
          quantity: 1,
        },
      ],
    },
    {
      id: 4,
      uniqueKey: 'order_1_4',
      price: '202.00',
      date: 'June 1, 2020',
      time: '08:22AM',
      status: 'Order in',
      address: 'Elm Street, 23',
      menuItems: [
        {
          id: 1,
          name: 'Pepperoni Pizza',
          image: '../../../../assets/images/burger.jpg',
          price: '8.99',
          quantity: 6,
        },
        {
          id: 2,
          name: 'Cheese Burger',
          image: '../../../../assets/images/burger.jpg',
          price: '4.99',
          quantity: 1,
        },
      ],
    },
    {
      id: 5,
      uniqueKey: 'order_1_5',
      price: '202.00',
      date: 'June 1, 2020',
      time: '08:22AM',
      status: 'Order in',
      address: 'Elm Street, 23',
      menuItems: [
        {
          id: 1,
          name: 'Pepperoni Pizza',
          image: '../../../../assets/images/burger.jpg',
          price: '8.99',
          quantity: 6,
        },
        {
          id: 2,
          name: 'Cheese Burger',
          image: '../../../../assets/images/burger.jpg',
          price: '4.99',
          quantity: 1,
        },
      ],
    }
  ],
};

// User data constants
export const userData = {
  name: 'Ruby Roben',
  memberSince: '2020',
  avatar: './assets/images/user-profile.png',
};

// Order status constants
export const orderStatus = {
  ORDER_IN: 'Order in',
  PREPARED: 'Prepared',
  DELIVERED: 'Delivered',
};

// Order details general constants
export const orderDetails = {
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
};

// Time constants
export const timeInfo = {
  estimationTime: '10 Min',
  paymentTime: '10 Min',
};
