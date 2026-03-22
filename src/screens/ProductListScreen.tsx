// Product List screen for React Native mobile app
// Uses shared contracts and mobile-specific components

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  ScrollView,
} from 'react-native';
import { useProducts, useCart } from '../store/useProductStore';
import { Product, COLORS, SPACING, TYPOGRAPHY } from '@pos-mikia/shared';
import { useNavigation } from '@react-navigation/native';

export default function ProductListScreen() {
  const navigation = useNavigation();
  const {
    products,
    isLoading,
    error,
    pagination,
    filters,
    fetchProducts,
    searchProducts,
    setFilters,
    clearError,
  } = useProducts();

  const { addToCart, isInCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery);
    } else {
      fetchProducts();
    }
  }, [searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoading) {
      fetchProducts({
        page: pagination.page + 1,
        limit: pagination.limit,
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleBarcodeScan = () => {
    navigation.navigate('BarcodeScanner');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleAddToCart(item)}
    >
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require('../assets/placeholder-product.png')
        }
        style={styles.productImage}
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.productSku}>
          SKU: {item.sku}
        </Text>
        
        <Text style={styles.productStock}>
          Stock: {item.stock}
        </Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>
            Rp {item.price.toLocaleString('id-ID')}
          </Text>
          
          {isInCart(item.id) && (
            <View style={styles.inCartBadge}>
              <Text style={styles.inCartText}>In Cart</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image
        source={require('../assets/empty-products.png')}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search terms'
          : 'Add some products to get started'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {searchQuery && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.barcodeButton}
          onPress={handleBarcodeScan}
        >
          <Text style={styles.barcodeButtonText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.errorDismiss}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.primary,
  },
  clearButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.sm,
  },
  clearText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text.secondary,
  },
  barcodeButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  barcodeButtonText: {
    fontSize: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: '#fef2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  errorText: {
    flex: 1,
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  errorDismiss: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  productList: {
    padding: SPACING.sm,
  },
  productCard: {
    flex: 1,
    margin: SPACING.sm,
    backgroundColor: COLORS.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.background.secondary,
  },
  productInfo: {
    padding: SPACING.sm,
  },
  productName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  productSku: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  productStock: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    flex: 1,
  },
  inCartBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inCartText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: '#fff',
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  loadingFooter: {
    padding: SPACING.md,
    alignItems: 'center',
  },
});
