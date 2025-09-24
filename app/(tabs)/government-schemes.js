import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function GovernmentSchemesScreen() {
  const router = useRouter();
  const { selectedScheme } = useLocalSearchParams();
  const [expandedScheme, setExpandedScheme] = useState(null);
  const scrollViewRef = useRef(null);
  const schemeRefs = useRef({});

  // Government schemes data
  const governmentSchemes = [
    {
      id: 1,
      name: "PM-KISAN Samman Nidhi",
      category: "Direct Benefit Transfer",
      emoji: "💰",
      shortDescription: "₹6,000 annual income support to farmer families",
      fullDescription: "Under this scheme, all landholding farmer families receive ₹6,000 per year in three equal installments of ₹2,000 each, directly transferred to their bank accounts.",
      benefits: [
        "₹6,000 per year in 3 installments",
        "Direct bank transfer",
        "No paperwork required after registration",
        "Covers all farmer families with cultivable land"
      ],
      eligibility: [
        "All landholding farmer families",
        "Should have cultivable land",
        "Aadhaar card mandatory",
        "Bank account linked with Aadhaar"
      ],
      documents: [
        "Aadhaar Card",
        "Bank Account Details",
        "Land Ownership Documents",
        "Mobile Number"
      ],
      applyLink: "https://pmkisan.gov.in/",
      color: "#4CAF50",
      status: "Active"
    },
    {
      id: 2,
      name: "Pradhan Mantri Fasal Bima Yojana",
      category: "Crop Insurance",
      emoji: "🛡️",
      shortDescription: "Comprehensive crop insurance coverage against natural calamities",
      fullDescription: "This scheme provides insurance coverage and financial support to farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.",
      benefits: [
        "Premium subsidy up to 90%",
        "Coverage for all food crops, oilseeds, annual commercial/horticultural crops",
        "Quick settlement of claims",
        "Use of technology for accurate assessment"
      ],
      eligibility: [
        "All farmers including sharecroppers and tenant farmers",
        "Compulsory for loanee farmers",
        "Voluntary for non-loanee farmers",
        "Must cultivate notified crops in notified areas"
      ],
      documents: [
        "Aadhaar Card",
        "Bank Account Details",
        "Land Records",
        "Sowing Certificate"
      ],
      applyLink: "https://pmfby.gov.in/",
      color: "#2196F3",
      status: "Active"
    },
    {
      id: 3,
      name: "Kisan Credit Card (KCC)",
      category: "Credit Facility",
      emoji: "💳",
      shortDescription: "Easy credit access for agricultural and allied activities",
      fullDescription: "KCC provides farmers with timely access to credit for their cultivation and other needs including consumption requirements at concessional rate of interest.",
      benefits: [
        "Credit up to ₹3 lakh at 7% interest",
        "No collateral required up to ₹1.6 lakh",
        "Flexible repayment based on harvest cycles",
        "Additional credit for allied activities"
      ],
      eligibility: [
        "All farmers including tenant farmers",
        "Minimum age 18 years, maximum 75 years",
        "Should have cultivable land",
        "Good credit history"
      ],
      documents: [
        "KCC Application Form",
        "Identity Proof (Aadhaar)",
        "Address Proof",
        "Land Documents",
        "Income Proof"
      ],
      applyLink: "https://www.nabard.org/content1.aspx?id=1179",
      color: "#FF9800",
      status: "Active"
    },
    {
      id: 4,
      name: "PM Kisan Mandhan Yojana",
      category: "Pension Scheme",
      emoji: "👴",
      shortDescription: "Pension scheme for small and marginal farmers",
      fullDescription: "A voluntary and contributory pension scheme for small and marginal farmers with assured pension of ₹3,000 per month after attaining the age of 60 years.",
      benefits: [
        "₹3,000 monthly pension after 60 years",
        "Family pension provision",
        "Low contribution amount",
        "Government matching contribution"
      ],
      eligibility: [
        "Small and marginal farmers (up to 2 hectares)",
        "Age between 18-40 years",
        "Should not be beneficiary of other pension schemes",
        "Income tax payer excluded"
      ],
      documents: [
        "Aadhaar Card",
        "Bank Account Details",
        "Land Records",
        "Age Proof"
      ],
      applyLink: "https://maandhan.in/",
      color: "#9C27B0",
      status: "Active"
    },
    {
      id: 5,
      name: "Soil Health Card Scheme",
      category: "Soil Testing",
      emoji: "🌱",
      shortDescription: "Free soil testing and health cards for farmers",
      fullDescription: "The scheme aims to provide soil health cards to all farmers to improve soil productivity and consequently the crop yield through judicious use of fertilizers.",
      benefits: [
        "Free soil testing",
        "Customized fertilizer recommendations",
        "Soil health card every 3 years",
        "Improved crop productivity"
      ],
      eligibility: [
        "All farmers",
        "No land size restriction",
        "Both individual and group applications accepted"
      ],
      documents: [
        "Aadhaar Card",
        "Land Records",
        "Contact Details"
      ],
      applyLink: "https://soilhealth.dac.gov.in/",
      color: "#795548",
      status: "Active"
    },
    {
      id: 6,
      name: "PM-KUSUM Solar Scheme",
      category: "Solar Energy",
      emoji: "☀️",
      shortDescription: "Solar pump and grid-connected solar power for farmers",
      fullDescription: "Scheme for installation of solar pumps and grid connected solar power plants in the country to provide energy security to farmers.",
      benefits: [
        "90% subsidy on solar pumps",
        "Additional income from selling surplus power",
        "Reduced electricity bills",
        "Environment friendly"
      ],
      eligibility: [
        "Individual farmers",
        "FPOs, cooperatives, Panchayats",
        "Should have irrigation requirement",
        "Grid connectivity for Component-C"
      ],
      documents: [
        "Land ownership documents",
        "Aadhaar Card",
        "Bank Account Details",
        "Electricity Connection Details"
      ],
      applyLink: "https://mnre.gov.in/solar/schemes/",
      color: "#FFC107",
      status: "Active"
    }
  ];

  // Auto-expand and scroll to selected scheme when navigating from home
  useEffect(() => {
    if (selectedScheme) {
      console.log('📋 Auto-expanding and scrolling to scheme:', selectedScheme);
      const schemeId = parseInt(selectedScheme);
      setExpandedScheme(schemeId);
      
      // Scroll to the selected scheme after a short delay
      setTimeout(() => {
        if (schemeRefs.current[schemeId] && scrollViewRef.current) {
          schemeRefs.current[schemeId].measureLayout(
            scrollViewRef.current.getScrollableNode(),
            (x, y, width, height) => {
              scrollViewRef.current.scrollTo({
                y: y - 100,
                animated: true
              });
            },
            () => {
              console.log('Using fallback scroll');
              scrollViewRef.current.scrollTo({
                y: (schemeId - 1) * 200,
                animated: true
              });
            }
          );
        }
      }, 500);
    }
  }, [selectedScheme]);

  const handleApplyNow = async (scheme) => {
    Alert.alert(
      `Apply for ${scheme.name}`,
      "You will be redirected to the official government website to apply for this scheme.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to Website",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(scheme.applyLink);
              if (supported) {
                await Linking.openURL(scheme.applyLink);
              } else {
                Alert.alert("Error", "Cannot open the website. Please try again later.");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to open the website. Please check your internet connection.");
            }
          }
        }
      ]
    );
  };

  const toggleExpand = (schemeId) => {
    setExpandedScheme(expandedScheme === schemeId ? null : schemeId);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return '#4CAF50';
      case 'Inactive': return '#F44336';
      default: return '#FF9800';
    }
  };

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>🏛️ Government Schemes</Text>
          <Text style={styles.subtitle}>Agricultural Benefits & Support</Text>
        </View>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerIcon}>🇮🇳</Text>
        <View style={styles.infoBannerContent}>
          <Text style={styles.infoBannerTitle}>भारत सरकार की योजनाएं</Text>
          <Text style={styles.infoBannerText}>
            Discover and apply for various government schemes designed to support farmers and boost agricultural growth.
          </Text>
        </View>
      </View>

      {/* Schemes List */}
      <View style={styles.schemesContainer}>
        <Text style={styles.sectionTitle}>📋 Available Schemes ({governmentSchemes.length})</Text>
        
        {governmentSchemes.map((scheme) => (
          <View 
            key={scheme.id} 
            ref={ref => {
              if (ref) {
                schemeRefs.current[scheme.id] = ref;
              }
            }}
            style={styles.schemeCard}
          >
            {/* Scheme Header - ALWAYS VISIBLE WITH CONTENT */}
            <TouchableOpacity 
              style={styles.schemeHeader}
              onPress={() => toggleExpand(scheme.id)}
              activeOpacity={0.7}
            >
              <View style={styles.schemeHeaderLeft}>
                <View style={[styles.schemeEmoji, { backgroundColor: `${scheme.color}20` }]}>
                  <Text style={styles.schemeEmojiText}>{scheme.emoji}</Text>
                </View>
                <View style={styles.schemeHeaderInfo}>
                  <Text style={styles.schemeName}>{scheme.name}</Text>
                  <View style={[styles.schemeCategory, { backgroundColor: `${scheme.color}15` }]}>
                    <Text style={[styles.schemeCategoryText, { color: scheme.color }]}>
                      {scheme.category}
                    </Text>
                  </View>
                  <Text style={styles.schemeShortDesc} numberOfLines={2}>
                    {scheme.shortDescription}
                  </Text>
                </View>
              </View>
              <View style={styles.schemeHeaderRight}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(scheme.status) }]}>
                  <Text style={styles.statusText}>{scheme.status}</Text>
                </View>
                <Text style={styles.expandIcon}>
                  {expandedScheme === scheme.id ? '▼' : '▶'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Expanded Content - ONLY SHOWS WHEN EXPANDED */}
            {expandedScheme === scheme.id && (
              <View style={styles.expandedContent}>
                {/* Full Description */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeading}>📄 About This Scheme</Text>
                  <Text style={styles.sectionText}>{scheme.fullDescription}</Text>
                </View>

                {/* Benefits */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeading}>✅ Key Benefits</Text>
                  {scheme.benefits.map((benefit, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={[styles.bulletPoint, { color: scheme.color }]}>•</Text>
                      <Text style={styles.listText}>{benefit}</Text>
                    </View>
                  ))}
                </View>

                {/* Eligibility */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeading}>👥 Eligibility Criteria</Text>
                  {scheme.eligibility.map((criteria, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={[styles.bulletPoint, { color: scheme.color }]}>•</Text>
                      <Text style={styles.listText}>{criteria}</Text>
                    </View>
                  ))}
                </View>

                {/* Required Documents */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeading}>📋 Required Documents</Text>
                  <View style={styles.documentsGrid}>
                    {scheme.documents.map((doc, index) => (
                      <View key={index} style={[styles.documentChip, { backgroundColor: `${scheme.color}15` }]}>
                        <Text style={[styles.documentText, { color: scheme.color }]}>{doc}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Apply Button */}
                <TouchableOpacity 
                  style={[styles.applyButton, { backgroundColor: scheme.color }]}
                  onPress={() => handleApplyNow(scheme)}
                >
                  <Text style={styles.applyButtonText}>🌐 Apply Now - Official Website</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>📞 Need Help?</Text>
        <Text style={styles.helpText}>
          For any queries regarding government schemes, contact:
        </Text>
        <View style={styles.helpContacts}>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => Linking.openURL('tel:1800-180-1551')}
          >
            <Text style={styles.helpButtonText}>📞 Kisan Call Center: 1800-180-1551</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => Linking.openURL('https://farmer.gov.in/')}
          >
            <Text style={styles.helpButtonText}>🌐 Visit Farmer Portal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#4CAF50",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "#c8e6c9",
    marginTop: 4,
  },
  infoBanner: {
    backgroundColor: "#E8F5E8",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  infoBannerIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  infoBannerText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  schemesContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  schemeCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
  },
  schemeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  schemeEmoji: {
    width: 55,
    height: 55,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 2,
  },
  schemeEmojiText: {
    fontSize: 26,
  },
  schemeHeaderInfo: {
    flex: 1,
  },
  schemeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  schemeCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  schemeCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  schemeShortDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  schemeHeaderRight: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expandIcon: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  section: {
    marginBottom: 20,
    marginTop: 15,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 20,
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  documentChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 5,
  },
  documentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  applyButton: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpSection: {
    backgroundColor: '#FFF3E0',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#FF9800',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF6C00',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  helpContacts: {
    gap: 10,
  },
  helpButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  helpButtonText: {
    color: '#EF6C00',
    fontSize: 14,
    fontWeight: '600',
  },
});
