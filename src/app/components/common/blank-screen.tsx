import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

// Global color configuration
const GlobalColors = {
  primary: '#FA4A0C',
  secondary: '#FF6B35',
  background: '#F5F5F5',
  text: '#333333',
  white: '#FFFFFF',
  accent: '#FFB347',
} as const;

// Type definitions
interface CustomCardProps {
  title?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  children?: ReactNode;
}

interface CardStyles {
  container: ViewStyle;
  decorativeLine: ViewStyle;
  title: TextStyle;
  content: ViewStyle;
}

// Component to create scattered dashed lines pattern
const ScatteredDashes: React.FC<{ color: string }> = ({ color }) => {
  // Simplified dash pattern that matches the image better
  const topDashes = [
    // Top row
    { width: 50, marginRight: 8 },
    { width: 8, marginRight: 20 },
    { width: 40, marginRight: 15 },
    { width: 25, marginRight: 0 },
  ];


  const bottomDashes = [
    // Bottom row 1
    { width: 30, marginRight: 8 },
    { width: 8, marginRight: 8 },
    { width: 8, marginRight: 20 },
    { width: 45, marginRight: 8 },
    { width: 8, marginRight: 0 },
  ];


  const renderDashRow = (dashes: { width: number; marginRight: number }[]) => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center',
      marginVertical: 4,
      flexWrap: 'wrap'
    }}>
      {dashes.map((dash, index) => (
        <View
          key={index}
          style={{
            width: dash.width,
            height: 3,
            backgroundColor: color,
            borderRadius: 1.5,
            marginRight: dash.marginRight,
          }}
        />
      ))}
    </View>
  );

  return (
    <>
      <View>
        {renderDashRow(topDashes)}
      </View>
      <View >
        {renderDashRow(bottomDashes)}
      </View>
    </>
  );
};

// Reusable component with global color support
const CustomCard: React.FC<CustomCardProps> = ({
  title = 'MAATE',
  primaryColor = GlobalColors.primary,
  backgroundColor = GlobalColors.background,
  textColor = GlobalColors.text,
  style,
  children
}) => {
  const cardStyles = StyleSheet.create<CardStyles>({
    container: {
      backgroundColor: backgroundColor,
      width: '100%',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      ...style,
    },
    decorativeLine: {
      width: '100%',
      alignItems: 'center',
    },
    title: {
      fontSize: 44,
      fontWeight: '800',
      color: primaryColor,
      letterSpacing: 1,
      textAlign: 'center',
      fontFamily: 'System',
    },
    content: {
      marginTop: 20,
      alignItems: 'center',
    }
  });

  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.decorativeLine}>
        <ScatteredDashes color={primaryColor} />
      </View>
      
      <Text style={cardStyles.title}>{title}</Text>
      
      <View style={cardStyles.decorativeLine}>
        <ScatteredDashes color={primaryColor} />
      </View>
      
      {children && (
        <View style={cardStyles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

// Props for Blankscreen component
interface BlankscreenProps {
  primaryColor?: string;
  backgroundColor?: string;
  title?: string;
}

// Example usage component
const Blankscreen: React.FC<BlankscreenProps> = ({ 
  primaryColor = GlobalColors.primary,
  backgroundColor = GlobalColors.background,
  title = "MAATE"
}) => {
  return (
    <View style={styles.appContainer}>
       <CustomCard 
        title={title}
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};

interface AppStyles {
  appContainer: ViewStyle;
}

const styles = StyleSheet.create<AppStyles>({
  appContainer: {
    flex: 1
  },
});

// Color utility functions with proper typing
export const ColorUtils = {
  // Get color from global palette
  getColor: (colorName: keyof typeof GlobalColors): string => 
    GlobalColors[colorName] || '#000000',
  
  // Update global colors (useful for theming)
  updateGlobalColors: (newColors: Partial<typeof GlobalColors>): void => {
    Object.assign(GlobalColors, newColors);
  },
  
  // Generate color variations
  lighten: (color: string, amount: number = 0.2): string => {
    // Simple color lightening logic
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * amount));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  },
  
  darken: (color: string, amount: number = 0.2): string => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
    const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
};

export { CustomCard, GlobalColors };
export default Blankscreen;