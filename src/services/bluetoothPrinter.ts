// Bluetooth Printer service for React Native mobile app
// Handles Bluetooth printer discovery and receipt printing

import { BluetoothPrinter, PrintJob, COLORS, PRINTER } from '@pos-mikia/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class BluetoothPrinterService {
  private printers: BluetoothPrinter[] = [];
  private currentPrinter: BluetoothPrinter | null = null;

  // Discover available Bluetooth printers
  async discoverPrinters(): Promise<BluetoothPrinter[]> {
    try {
      // In a real implementation, this would use:
      // - react-native-bluetooth-classic
      // - react-native-ble-manager
      // - expo-bluetooth
      
      // For demo purposes, return mock printers
      const mockPrinters: BluetoothPrinter[] = [
        {
          id: 'printer_1',
          name: 'EPSON TM-T20',
          address: '00:11:22:33:44:55',
          isConnected: false,
        },
        {
          id: 'printer_2',
          name: 'Star TSP100',
          address: '66:77:88:99:AA:BB',
          isConnected: false,
        },
        {
          id: 'printer_3',
          name: 'Citizen CT-S310',
          address: 'CC:DD:EE:FF:00:11',
          isConnected: false,
        },
      ];

      this.printers = mockPrinters;
      return mockPrinters;
    } catch (error) {
      console.error('Failed to discover printers:', error);
      return [];
    }
  }

  // Get discovered printers
  getPrinters(): BluetoothPrinter[] {
    return this.printers;
  }

  // Connect to a printer
  async connectToPrinter(printerId: string): Promise<boolean> {
    try {
      const printer = this.printers.find(p => p.id === printerId);
      if (!printer) {
        throw new Error('Printer not found');
      }

      // In a real implementation, this would establish Bluetooth connection
      // For demo purposes, simulate connection
      printer.isConnected = true;
      printer.lastConnected = new Date().toISOString();
      
      this.currentPrinter = printer;
      
      // Save connected printer
      await this.saveConnectedPrinter(printer);
      
      return true;
    } catch (error) {
      console.error('Failed to connect to printer:', error);
      return false;
    }
  }

  // Disconnect from current printer
  async disconnectPrinter(): Promise<void> {
    if (this.currentPrinter) {
      this.currentPrinter.isConnected = false;
      this.currentPrinter = null;
      
      // Clear saved printer
      await AsyncStorage.removeItem('connected_printer');
    }
  }

  // Get currently connected printer
  getCurrentPrinter(): BluetoothPrinter | null {
    return this.currentPrinter;
  }

  // Print receipt
  async printReceipt(orderData: any): Promise<boolean> {
    if (!this.currentPrinter || !this.currentPrinter.isConnected) {
      throw new Error('No printer connected');
    }

    try {
      const receiptText = this.generateReceiptText(orderData);
      
      // In a real implementation, this would send to Bluetooth printer
      // For demo purposes, just log the receipt
      console.log('Printing receipt:', receiptText);
      
      return true;
    } catch (error) {
      console.error('Failed to print receipt:', error);
      return false;
    }
  }

  // Generate receipt text
  private generateReceiptText(orderData: any): string {
    const {
      storeName = 'MIKIA BOUTIQUE',
      storeAddress = '',
      storePhone = '',
      customerName = 'Customer',
      items = [],
      totalAmount = 0,
      paymentMethod = 'CASH',
      taxAmount = 0,
    } = orderData;

    let receipt = '';
    
    // Header
    receipt += this.centerText(storeName.toUpperCase()) + '\n';
    if (storeAddress) {
      receipt += this.centerText(storeAddress) + '\n';
    }
    if (storePhone) {
      receipt += this.centerText(`Tel: ${storePhone}`) + '\n';
    }
    receipt += this.centerText('='.repeat(PRINTER.maxCharsPerLine)) + '\n\n';
    
    // Customer info
    receipt += `Customer: ${customerName}\n`;
    receipt += `Date: ${new Date().toLocaleString('id-ID')}\n`;
    receipt += '-'.repeat(PRINTER.maxCharsPerLine) + '\n\n';
    
    // Items
    receipt += this.centerText('ITEMS') + '\n';
    receipt += '-'.repeat(PRINTER.maxCharsPerLine) + '\n';
    
    items.forEach((item: any) => {
      const name = item.product.name || 'Product';
      const quantity = item.quantity || 1;
      const price = item.product.price || 0;
      const total = price * quantity;
      
      receipt += `${name}\n`;
      receipt += `  ${quantity} x Rp ${price.toLocaleString('id-ID')} = Rp ${total.toLocaleString('id-ID')}\n`;
    });
    
    receipt += '-'.repeat(PRINTER.maxCharsPerLine) + '\n\n';
    
    // Totals
    receipt += `Subtotal: Rp ${totalAmount.toLocaleString('id-ID')}\n`;
    receipt += `Tax (10%): Rp ${taxAmount.toLocaleString('id-ID')}\n`;
    receipt += '-'.repeat(PRINTER.maxCharsPerLine) + '\n';
    receipt += `TOTAL: Rp ${(totalAmount + taxAmount).toLocaleString('id-ID')}\n\n`;
    
    // Payment
    receipt += `Payment: ${paymentMethod}\n`;
    receipt += `Paid: Rp ${(totalAmount + taxAmount).toLocaleString('id-ID')}\n`;
    receipt += `Change: Rp 0\n\n`;
    
    // Footer
    receipt += '-'.repeat(PRINTER.maxCharsPerLine) + '\n';
    receipt += this.centerText('Thank you for shopping!') + '\n';
    receipt += this.centerText('Please come again') + '\n\n';
    
    return receipt;
  }

  // Helper function to center text
  private centerText(text: string): string {
    const padding = Math.floor((PRINTER.maxCharsPerLine - text.length) / 2);
    return ' '.repeat(Math.max(0, padding)) + text;
  }

  // Save connected printer to storage
  private async saveConnectedPrinter(printer: BluetoothPrinter): Promise<void> {
    try {
      await AsyncStorage.setItem('connected_printer', JSON.stringify(printer));
    } catch (error) {
      console.error('Failed to save connected printer:', error);
    }
  }

  // Load connected printer from storage
  async loadConnectedPrinter(): Promise<BluetoothPrinter | null> {
    try {
      const printerData = await AsyncStorage.getItem('connected_printer');
      if (printerData) {
        const printer = JSON.parse(printerData) as BluetoothPrinter;
        this.currentPrinter = printer;
        return printer;
      }
    } catch (error) {
      console.error('Failed to load connected printer:', error);
    }
    return null;
  }

  // Check if printer is available
  async isPrinterAvailable(): Promise<boolean> {
    if (!this.currentPrinter) {
      await this.loadConnectedPrinter();
    }
    
    return this.currentPrinter?.isConnected || false;
  }

  // Test print
  async testPrint(): Promise<boolean> {
    if (!this.currentPrinter || !this.currentPrinter.isConnected) {
      throw new Error('No printer connected');
    }

    try {
      const testReceipt = {
        storeName: 'MIKIA BOUTIQUE',
        storeAddress: 'Test Address',
        storePhone: '0812-3456-7890',
        customerName: 'Test Customer',
        items: [
          {
            product: { name: 'Test Product', price: 10000 },
            quantity: 2,
          },
        ],
        totalAmount: 20000,
        paymentMethod: 'CASH',
        taxAmount: 2000,
      };

      return await this.printReceipt(testReceipt);
    } catch (error) {
      console.error('Test print failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const bluetoothPrinterService = new BluetoothPrinterService();

// Export default
export default bluetoothPrinterService;
