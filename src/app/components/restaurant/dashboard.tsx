import React, { useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { Button, Card, Icon, Text, Menu, TouchableRipple } from "react-native-paper";
import Svg, {
  G,
  Path,
  Rect,
  Text as SvgText
} from 'react-native-svg';
import { dashboardStyles as styles } from "../css/restaurant/restaurantdashboard";

const screenWidth = Dimensions.get("window").width;

const dashboardData = {
  income: 128900,
  expense: 289000,
  incomeChange: 15,
  expenseChange: -10,
  order: {
    total: 425,
    thisMonth: 1324,
    lastMonth: 1324,
    target: 3982,
  },
  barChartData: [230, 410, 390, 20, 340, 490, 730, 810, 950, 430, 210, 130],
  orderStatus: [
    {
      label: "Total Order Complete",
      value: 425,
      icon: require("../../../../assets/images/totalorder.png"),
    },
    {
      label: "Total Order Delivered",
      value: 154,
      icon: require("../../../../assets/images/delivered.png"),
    },
    {
      label: "Total Order Cancelled",
      value: 125,
      icon: require("../../../../assets/images/cancelled.png"),
    },
    {
      label: "Order Pending",
      value: 425,
      icon: require("../../../../assets/images/pending.png"),
    },
  ],
  popularFood: [
    {
      name: "Fast Food",
      population: 763,
      color: "#4285F4",
    },
    {
      name: "Asian Food", 
      population: 763,
      color: "#FB8C00",
    },
    {
      name: "Western Food",
      population: 69,
      color: "#34A853",
    },
  ],
};

// Custom Bar Chart Component
const CustomBarChart = ({ data, width, height } : any) => {
  const maxValue = 1000; // Fixed max value like in the image
  const barWidth = (width - 100) / data.length;
  const chartHeight = height - 80;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Svg width={width} height={height}>
        {/* Y-axis label */}
        <SvgText
          x={20}
          y={height / 2}
          fontSize="12"
          fill="#888"
          textAnchor="middle"
          transform={`rotate(-90, 20, ${height / 2})`}
        >
          ORDER PERFORMANCE
        </SvgText>
        
        {/* Grid Lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <G key={i}>
            <Rect
              x={60}
              y={40 + (i * chartHeight / 10)}
              width={width - 100}
              height={1}
              fill="#f0f0f0"
            />
          </G>
        ))}
        
        {/* Bars */}
        {data.map((value : any, index : any) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x = 60 + (index * barWidth) + (barWidth * 0.1);
          const y = 40 + chartHeight - barHeight;
          
          return (
            <G key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth * 0.8}
                height={barHeight}
                fill="#6C63FF"
                rx={2}
              />
            </G>
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <SvgText
            key={i}
            x={55}
            y={45 + (i * chartHeight / 10)}
            fontSize="10"
            fill="#888"
            textAnchor="end"
          >
            {Math.round((maxValue * (10 - i)) / 10)}
          </SvgText>
        ))}
        
         {/* X-axis timeline */}
         <G>
           {/* Horizontal line with tick marks */}
           {Array.from({ length: 13 }, (_, i) => (
             <G key={i}>
               {/* Tick marks */}
               <Rect
                 x={60 + (i * (width - 120) / 12)}
                 y={height - 35}
                 width={1}
                 height={8}
                 fill="#D3D3D3"
               />
               {/* Main horizontal line segments */}
               {i < 12 && (
                 <Rect
                   x={60 + (i * (width - 120) / 12)}
                   y={height - 30}
                   width={(width - 120) / 12}
                   height={1}
                   fill="#D3D3D3"
                 />
               )}
             </G>
           ))}
           
           {/* DURATION text */}
           <SvgText
             x={width / 2}
             y={height - 20}
             fontSize="12"
             fill="#5A5856"
             textAnchor="middle"
           >
             DURATION
           </SvgText>
           
           {/* Arrow */}
           <Path
             d={`M ${width - 40} ${height - 30} L ${width - 35} ${height - 25} L ${width - 35} ${height - 35} Z`}
             fill="#D3D3D3"
           />
         </G>
      </Svg>
    </View>
  );
};

// Custom Pie Chart Component (Hollow/Donut style)
const CustomPieChart = ({ data, width, height } : any) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2 - 20;
  const innerRadius = outerRadius * 0.6; // Make it hollow
  const total = data.reduce((sum : any, item : any) => sum + item.population, 0);
  
  let currentAngle = 0;
  
  const createArcPath = (centerX : any, centerY : any, outerRadius : any, innerRadius : any, startAngle : any, endAngle : any) => {
    const startOuter = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const endOuter = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const startInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const endInner = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
    
    return [
      "M", startOuter.x, startOuter.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      "L", endInner.x, endInner.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z"
    ].join(" ");
  };
  
  const polarToCartesian = (centerX : any, centerY : any, radius : any, angleInRadians : any) => {
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Svg width={width} height={height}>
        {data.map((item : any, index : any) => {
          const angle = (item.population / total) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const arcPath = createArcPath(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle);
          currentAngle += angle;
          
          return (
            <Path
              key={index}
              d={arcPath}
              fill={item.color}
              stroke="none"
            />
          );
        })}
      </Svg>
    </View>
  );
};


const RestaurantDashboard = () => {
  const { income, expense, incomeChange, expenseChange, order, barChartData } =
    dashboardData;
  const { total, thisMonth, lastMonth, target } = order;
  const progress = target > 0 ? Math.min(1, total / target) : 0;
  
  const [selectedYear, setSelectedYear] = useState("2024");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const yearOptions = ["2024", "2023", "2022", "2021"];

  const handleWithdraw = () => {
    console.log("Withdraw Clicked");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Total Income */}
      <Card style={styles.totalIncomeCard}>
        <Card.Content>
          <Text style={styles.cardLabel}>Total Income</Text>
          <Text style={styles.totalIncomeText}>
            ₹{income.toLocaleString("en-IN")}
          </Text>
        </Card.Content>
      </Card>

      {/* Withdraw Button */}
      <Button
        mode="contained"
        onPress={handleWithdraw}
        style={styles.withdrawBtn}
        labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
        contentStyle={{ paddingVertical: 8 }}
      >
        Withdraw
      </Button>

      {/* Income and Expense */}
      <View style={styles.rowGap}>
        <Card style={[styles.infoCard, styles.greenCard]}>
          <Card.Content>
            <View style={styles.iconRow}>
              <Text style={styles.infoLabel}>Income</Text>
            </View>
            <Text style={styles.infoAmount}>
              ₹{income.toLocaleString("en-IN")}
            </Text>
            <View style={styles.trendRow}>
              <View
                style={[styles.trendCircle, { backgroundColor: "#1AB760" }]}
              >
                <Text style={styles.trendIcon}>↑</Text>
              </View>
              <Text style={[styles.trendText, { color: "#1AB760" }]}>
                +{incomeChange}%
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.infoCard, styles.redCard]}>
          <Card.Content>
            <View style={styles.iconRow}>
              <Text style={styles.expenseLabel}>Expense</Text>
            </View>
            <Text style={styles.infoAmount}>
              ₹{expense.toLocaleString("en-IN")}
            </Text>
            <View style={styles.trendRow}>
              <View
                style={[styles.trendCircle, { backgroundColor: "#E43D3D" }]}
              >
                <Text style={styles.trendIcon}>↓</Text>
              </View>
              <Text style={[styles.trendText, { color: "#E43D3D" }]}>
                -{Math.abs(expenseChange)}%
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
      {/* Order Rate */}
      <Card style={styles.orderCard}>
        <Card.Title
          title="Order Rate"
          titleStyle={styles.cardLabel}
          right={() => (
            <Menu
              visible={dropdownVisible}
              onDismiss={() => setDropdownVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setDropdownVisible(true)}
                  style={styles.yearDropdown}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.yearText}>{selectedYear}</Text>
                    <Icon source="chevron-down" size={14} color="#5A5856" />
                  </View>
                </TouchableRipple>
              }
            >
              {yearOptions.map((year) => (
                <Menu.Item
                  key={year}
                  onPress={() => {
                    setSelectedYear(year);
                    setDropdownVisible(false);
                  }}
                  title={year}
                  titleStyle={styles.menuItemText}
                  style={styles.menuItem}
                />
              ))}
            </Menu>
          )}
        />

        <Card.Content>
          <View style={styles.orderRow}>
            <Card style={styles.orderMainCard}>
              <Card.Content
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Image
                  source={require("../../../../assets/images/totalorder.png")}
                  style={styles.orderImage}
                />
                <View>
                  <Text style={styles.totalOrderLabel}>Total Order</Text>
                  <Text style={styles.totalOrderValue}>{total}</Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.rowGap}>
            <Card style={styles.orderSmallCard}>
              <Card.Content style={{ alignItems: "flex-start" }}>
                <View style={styles.smallCardTopRow}>
                  <View style={styles.orangeCircle}>
                    <View style={styles.orangeCircleInner} />
                  </View>
                  <Text style={styles.smallCardLabel}>This Month</Text>
                </View>
                <Text style={styles.smallCardValue}>{thisMonth}</Text>
              </Card.Content>
            </Card>

            <Card style={styles.orderSmallCard}>
              <Card.Content style={{ alignItems: "flex-start" }}>
                <View style={styles.smallCardTopRow}>
                  <View style={styles.orangeCircle}>
                    <View style={styles.orangeCircleInner} />
                  </View>
                  <Text style={styles.smallCardLabel}>Last Month</Text>
                </View>
                <Text style={styles.smallCardValue}>{lastMonth}</Text>
              </Card.Content>
            </Card>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.targetText}>Target</Text>
              <Text style={styles.progressValue}>{target.toLocaleString()}</Text>
            </View>
            
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>

          {/* Custom Bar Chart */}
          <CustomBarChart 
            data={barChartData} 
            width={screenWidth - 32} 
            height={280} 
          />
        </Card.Content>
      </Card>

      {/* Order Status Overview */}
      <Card style={[styles.orderCard, { marginTop: 16 }]}>
        <Card.Title title="Order Status" titleStyle={styles.cardLabel} />
        <Card.Content>
          <View style={styles.statusGrid}>
            {dashboardData.orderStatus.map((status, index) => (
              <View style={styles.statusItem} key={index}>
                <Image source={status.icon} style={styles.statusIcon} />
                <Text style={styles.statusLabel}>{status.label}</Text>
                <Text style={styles.statusValue}>{status.value}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

       {/* Popular Food Pie Chart */}
       <Card style={[styles.orderCard, { marginTop: 16 }]}>
         <Card.Title title="Popular Food" titleStyle={styles.cardLabel} />
         <Card.Content style={{ alignItems: "center" }}>
           <CustomPieChart 
             data={dashboardData.popularFood} 
             width={screenWidth - 32} 
             height={180} 
           />

           <View style={styles.legendContainer}>
             <Text style={styles.legendTitle}>Legend</Text>
             {dashboardData.popularFood.map((item, idx) => (
               <View style={styles.legendItem} key={idx}>
                 <View
                   style={[styles.legendDot, { backgroundColor: item.color }]}
                 />
                 <Text style={styles.legendLabel}>
                   {item.name} ({Math.round((item.population / 1595) * 100)}%)
                 </Text>
                 <Text style={styles.legendValue}>{item.population}</Text>
               </View>
             ))}
           </View>
         </Card.Content>
       </Card>
    </ScrollView>
  );
};

export default RestaurantDashboard;