import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    color: '#FFFFFF',
  },
  titleBlue: {
    color: '#001EFE',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  networkButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  networkIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  networkSpinner: {
    marginLeft: 8,
  },
  checkmarkContainer: {
    marginLeft: 'auto',
  },
  checkmark: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  darkWalletButton: {
    backgroundColor: '#333',
  },
  walletButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  darkWalletButtonText: {
    color: '#fff',
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressContainer: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  darkText: {
    color: '#fff',
  },
  disconnectButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  darkDisconnectButton: {
    backgroundColor: '#ef4444',
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  darkDisconnectButtonText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  heroTitleBlue: {
    color: '#001EFE',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#CCCCCC',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  darkCard: {
    backgroundColor: '#181818',
    borderColor: '#333',
  },
  cardHeader: {
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  darkCardHeader: {
    backgroundColor: '#222',
    borderBottomColor: '#333',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  infoGrid: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  infoItem: {
    width: '100%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  infoValue: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  darkInfoValue: {
    backgroundColor: '#222',
    borderColor: '#333',
  },
  infoValueText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  darkInfoValueText: {
    color: '#AAAAAA',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  executeButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoader: {
    marginRight: 8,
  },
  executeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notConnectedContainer: {
    alignItems: 'center',
    padding: 24,
  },
  notConnectedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  notConnectedSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 16,
    textAlign: 'center',
  },
  darkSubText: {
    color: '#AAAAAA',
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  responseContainer: {
    marginBottom: 16,
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  responseData: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  responseScrollView: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  darkResponseData: {
    backgroundColor: '#222',
    borderColor: '#333',
  },
  responseText: {
    fontSize: 14,
    color: '#AAAAAA',
    fontFamily: 'SpaceMono',
  },
  darkResponseText: {
    color: '#AAAAAA',
  },
  toggleResponseButton: {
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: 4,
  },
  toggleResponseText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionContainer: {
    marginBottom: 16,
  },
  transactionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  transactionData: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  darkTransactionData: {
    backgroundColor: '#222',
    borderColor: '#333',
  },
  transactionText: {
    fontSize: 14,
    color: '#AAAAAA',
    fontFamily: 'SpaceMono',
    flex: 1,
  },
  darkTransactionText: {
    color: '#AAAAAA',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Event styles
  eventContainer: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16
  },
  eventHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  eventLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 70,
    color: '#AAAAAA',
  },
  eventValue: {
    fontSize: 14,
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#FFFFFF',
  },

  viewTxButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  viewTxButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  darkModalContent: {
    backgroundColor: '#181818',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  networkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  darkNetworkOption: {
    backgroundColor: '#222',
  },
  selectedNetworkOption: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  darkSelectedNetworkOption: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  networkOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#FFFFFF',
  },
  selectedNetworkText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#222',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  darkCloseButton: {
    backgroundColor: '#222',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  darkCloseButtonText: {
    color: '#FFFFFF',
  },
  krnlModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  krnlModalContent: {
    backgroundColor: '#181818',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  darkKrnlModalContent: {
    backgroundColor: '#181818',
  },
  krnlModalLoader: {
    marginBottom: 16,
  },
  krnlModalStep: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  
  // Decoded Response styles
  decodedGrid: {
    flexDirection: 'column',
  },
  decodedItem: {
    marginBottom: 12,
  },
  decodedLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#AAAAAA',
  },
  decodedValue: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  darkDecodedValue: {
    backgroundColor: '#222',
    borderColor: '#333',
  },
  decodedValueText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'SpaceMono',
  },
  darkDecodedValueText: {
    color: '#FFFFFF',
  },
});

export default styles;