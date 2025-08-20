import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Button,
  Chip,
  Icon,
  Searchbar,
  Text
} from 'react-native-paper';
import { styles } from "../css/restaurant/notification-screen";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #12345 has been placed by John Doe',
      time: '2 minutes ago',
      isRead: false,
      priority: 'high',
      data: { orderId: '12345', customerName: 'John Doe', amount: 45.50 }
    },
    {
      id: 2,
      type: 'subscription',
      title: 'Premium Subscription Activated',
      message: 'Sarah Johnson has upgraded to Premium plan',
      time: '15 minutes ago',
      isRead: false,
      priority: 'medium',
      data: { userId: 'user_789', plan: 'Premium', duration: '1 year' }
    },
    {
      id: 3,
      type: 'order',
      title: 'Order Completed',
      message: 'Order #12340 has been successfully delivered',
      time: '1 hour ago',
      isRead: true,
      priority: 'low', // Added missing priority
      data: { orderId: '12340', status: 'delivered' }
    },
    {
      id: 5,
      type: 'order',
      title: 'Order Cancelled',
      message: 'Order #12338 was cancelled by the customer',
      time: '3 hours ago',
      isRead: true,
      priority: 'medium',
      data: { orderId: '12338', reason: 'Customer request' }
    },
    {
      id: 6,
      type: 'subscription',
      title: 'Subscription Renewal',
      message: 'Emma Wilson renewed her Gold subscription',
      time: '5 hours ago',
      isRead: false,
      priority: 'low',
      data: { userId: 'user_123', plan: 'Gold', renewal: true }
    }
  ]);
  const router = useRouter();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNotificationClick = (notification : any) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Handle navigation based on notification type
    switch (notification.type) {
      case 'order':
        console.log(`Navigating to order page for order: ${notification.data.orderId}`);
        router.push('/(restaurant)/orders');
        break;
      case 'subscription':
        console.log(`Navigating to subscription page for user: ${notification.data.userId}`);
        router.push('/(restaurant)/subscriptions');
        break;
      default:
        console.log('Default notification action');
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id : any) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setNotifications(prev => prev.filter(n => n.id !== id))
        }
      ]
    );
  };

  const getNotificationIcon = (type : any) => {
    switch (type) {
      case 'order':
        return 'package-variant';
      case 'subscription':
        return 'credit-card';
      default:
        return 'bell';
    }
  };

  const getIconColor = (type : any, priority : any) => {
    if (priority === 'high') return '#EF4444';
    if (priority === 'medium') return '#F59E0B';
    return '#3B82F6';
  };

  const getBackgroundColor = (type : any, isRead : any) => {
    if (isRead) return '#F9FAFB';
    
    switch (type) {
      case 'order':
        return '#F0FDF4';
      case 'subscription':
        return '#FAF5FF';
      default:
        return '#F9FAFB';
    }
  };

  const getBorderColor = (type : any, isRead : any) => {
    if (isRead) return 'transparent';
    
    switch (type) {
      case 'order':
        return '#10B981';
      case 'subscription':
        return '#8B5CF6';
      default:
        return 'transparent';
    }
  };

  // Helper function to get priority chip styling
  const getPriorityChipStyle = (priority : any) => {
    switch (priority) {
      case 'high':
        return {
          backgroundColor: '#FEE2E2',
          textColor: '#DC2626'
        };
      case 'medium':
        return {
          backgroundColor: '#FEF3C7',
          textColor: '#D97706'
        };
      case 'low':
        return {
          backgroundColor: '#E0F2FE',
          textColor: '#0369A1'
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          textColor: '#6B7280'
        };
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return !n.isRead && matchesSearch;
    return n.type === filter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Updated filter buttons to show only order and subscription related filters
  const filterButtons = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
    { key: 'subscription', label: 'Subscriptions', count: notifications.filter(n => n.type === 'subscription').length }
  ];

  const renderNotificationItem = ({ item } : any) => {
    const priorityStyle = getPriorityChipStyle(item.priority);
    
    return (
      <TouchableOpacity
        onPress={() => handleNotificationClick(item)}
        style={[
          styles.notificationCard,
          { 
            backgroundColor: getBackgroundColor(item.type, item.isRead),
            borderLeftColor: getBorderColor(item.type, item.isRead),
            borderLeftWidth: item.isRead ? 0 : 4,
          }
        ]}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: getIconColor(item.type, item.priority) + '20' }
            ]}>
              <Icon 
                source={getNotificationIcon(item.type)} 
                color={getIconColor(item.type, item.priority)} 
                size={24} 
              />
            </View>
            
            <View style={styles.contentContainer}>
              <View style={styles.titleRow}>
                <Text style={[
                  styles.notificationTitle,
                  { fontWeight: item.isRead ? '500' : '700' }
                ]}>
                  {item.title}
                </Text>
                <View style={styles.metaContainer}>
                  {item.priority && (
                    <Chip 
                      style={[
                        styles.priorityChip,
                        { backgroundColor: priorityStyle.backgroundColor }
                      ]} 
                      textStyle={[
                        styles.priorityText,
                        { color: priorityStyle.textColor }
                      ]}
                      compact
                    >
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </Chip>
                  )}
                  {!item.isRead && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
              </View>
              
              <Text style={styles.notificationMessage}>
                {item.message}
              </Text>

              {/* Additional Info */}
              {item.type === 'order' && item.data.amount && (
                <View style={styles.orderInfo}>
                  <Text style={styles.orderDetail}>
                    Order #{item.data.orderId}
                  </Text>
                  <Text style={styles.orderAmount}>
                    ${item.data.amount}
                  </Text>
                </View>
              )}

              {item.type === 'subscription' && item.data.plan && (
                <View style={styles.subscriptionInfo}>
                  <Icon source="credit-card" size={16} color="#8B5CF6" />
                  <Text style={styles.subscriptionDetail}>
                    {item.data.plan} Plan
                  </Text>
                </View>
              )}

              <View style={styles.footerRow}>
                <View style={styles.timeContainer}>
                  <Icon source="clock-outline" size={16} color="#6B7280" />
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                
                <TouchableOpacity
                  onPress={() => deleteNotification(item.id)}
                  style={styles.deleteButton}
                >
                  <Icon source="close" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <StatusBar backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Icon source="bell" color="#fff" size={24} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSubtitle}>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </Text>
            </View>
          </View>
          {unreadCount > 0 && (
            <Button
              mode="contained"
              onPress={markAllAsRead}
              style={styles.markAllButton}
              labelStyle={styles.markAllButtonLabel}
            >
              Mark all read
            </Button>
          )}
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search notifications..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#6B7280"
          placeholderTextColor="black"
          inputStyle={{color:'black'}}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {filterButtons.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[
                styles.filterButton,
                filter === tab.key && styles.filterButtonActive
              ]}
            >
              <Text style={[
                styles.filterButtonText,
                filter === tab.key && styles.filterButtonTextActive
              ]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={[
                  styles.filterBadge,
                  filter === tab.key && styles.filterBadgeActive
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    filter === tab.key && styles.filterBadgeTextActive
                  ]}>
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon source="bell-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </Text>
          </View>
        }
      />

      {/* Bottom Summary */}
      {filteredNotifications.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryText}>
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <View style={styles.unreadIndicator} />
                <Text style={styles.statText}>{unreadCount} unread</Text>
              </View>
              <View style={styles.statItem}>
                <Icon source="check-circle" size={16} color="#10B981" />
                <Text style={styles.statText}>{notifications.length - unreadCount} read</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};



export default NotificationScreen;