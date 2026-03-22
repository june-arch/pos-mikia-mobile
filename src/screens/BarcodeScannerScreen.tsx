// Barcode Scanner screen for React Native mobile app
// Uses Expo Camera for barcode detection

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCart, useProductCatalog } from '../store/useProductStore';
import { COLORS, SPACING, TYPOGRAPHY } from '@pos-mikia/shared';

export default function BarcodeScannerScreen({ navigation }: any) {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { addToCart } = useCart();
  const { getProductByBarcode } = useProductCatalog();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (!isScanning) return;

    setIsScanning(false);
    setScannedData(data);
    
    // Vibrate on successful scan
    Vibration.vibrate(100);

    try {
      // Find product by barcode
      const product = await getProductByBarcode(data);
      
      if (product) {
        // Product found - add to cart
        Alert.alert(
          'Product Found',
          `${product.name}\nPrice: Rp ${product.price.toLocaleString('id-ID')}\n\nAdd to cart?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                resetScanner();
              },
            },
            {
              text: 'Add to Cart',
              onPress: () => {
                addToCart(product);
                Alert.alert('Success', `${product.name} added to cart!`);
                resetScanner();
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        // Product not found
        Alert.alert(
          'Product Not Found',
          `No product found with barcode: ${data}`,
          [
            {
              text: 'Scan Again',
              onPress: resetScanner,
            },
            {
              text: 'Manual Entry',
              onPress: () => {
                navigation.navigate('Products', { barcodeSearch: data });
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to scan barcode. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: resetScanner,
          },
        ]
      );
    }
  };

  const resetScanner = () => {
    setIsScanning(true);
    setScannedData(null);
  };

  const toggleFlash = () => {
    // Flash toggle functionality would go here
    Alert.alert('Flash', 'Flash toggle not implemented yet');
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera permission to scan barcodes.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Denied</Text>
          <Text style={styles.permissionText}>
            Please enable camera access in your device settings to use barcode scanning.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
        }}
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
      >
        {/* Scanner Overlay */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <View style={styles.topOverlay} />
          
          {/* Middle section with scanning frame */}
          <View style={styles.middleSection}>
            <View style={styles.leftOverlay} />
            
            {/* Scanning frame */}
            <View style={styles.scanningFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scanning line animation */}
              {isScanning && (
                <View style={styles.scanningLine} />
              )}
              
              <Text style={styles.scanningText}>
                Align barcode within frame
              </Text>
            </View>
            
            <View style={styles.rightOverlay} />
          </View>
          
          {/* Bottom overlay */}
          <View style={styles.bottomOverlay}>
            <Text style={styles.scannedData}>
              {scannedData ? `Scanned: ${scannedData}` : 'Ready to scan...'}
            </Text>
          </View>
        </View>
      </CameraView>
      
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFlash}
        >
          <Text style={styles.controlButtonText}>🔦</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={resetScanner}
        >
          <Text style={styles.controlButtonText}>🔄</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.controlButtonText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleSection: {
    flexDirection: 'row',
    height: 250,
  },
  leftOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  rightOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scanningFrame: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanningLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    // Animation would be added here
  },
  scanningText: {
    position: 'absolute',
    bottom: -30,
    color: '#fff',
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedData: {
    color: '#fff',
    fontSize: TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    padding: SPACING.sm,
  },
  controls: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  controlButtonText: {
    fontSize: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  permissionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
