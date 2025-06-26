import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const EcoWebLogo: React.FC<LogoProps> = ({ 
  size = 80, 
  showText = true, 
  variant = 'light' 
}) => {
  const textColor = variant === 'light' ? '#FFFFFF' : '#2E7D32';
  
  return (
    <View style={styles.logoContainer}>
      <View style={[styles.logoWrapper, { width: size, height: size }]}>
        <LinearGradient
          colors={['#4CAF50', '#2E7D32', '#1B5E20']}
          style={[styles.logoGradient, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 100 100">
            <Defs>
              <SvgLinearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#81C784" />
                <Stop offset="100%" stopColor="#FFFFFF" />
              </SvgLinearGradient>
            </Defs>
            
            <Path
              d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 80 C50 80, 50 45, 50 10 Z"
              fill="url(#leafGradient)"
            />
            
            <Path
              d="M50 15 Q45 35, 40 55 Q42 60, 45 65"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
            
            <Circle cx="70" cy="25" r="8" fill="#FFFFFF" opacity="0.9" />
            <Path
              d="M66 21 L70 25 L74 21 M70 25 L70 29"
              stroke="#4CAF50"
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        </LinearGradient>
      </View>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.brandName, { color: textColor }]}>EcoWeb</Text>
          <Text style={[styles.tagline, { color: textColor, opacity: 0.8 }]}>
            Sustentabilidade Digital
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  logoGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});