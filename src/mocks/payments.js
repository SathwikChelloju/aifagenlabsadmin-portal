/**
 * Centralized Mock Payments & Financial Transactions Dataset
 * Seamlessly cross-references candidate records in users.js.
 * Total records: 54 (42 Successful totaling $8,742.00, 7 Pending, 5 Failed).
 * Matches reference visual layout with authentic payment methods, currencies, and IDs.
 */

export const MOCK_PAYMENTS = [
  {
    "id": "TRX-2026-00124",
    "shortId": "00124",
    "userId": "usr_9104",
    "userName": "Aarav Patel",
    "userEmail": "aarav.p@outlook.com",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+44 7700 900142",
    "userLocation": "London, United Kingdom",
    "amount": 79,
    "usdAmount": 79,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-10-09T20:14:00Z",
    "formattedDate": "Oct 09, 2026 · 8:14 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": "INV-2026-0091",
    "activities": [
      {
        "id": "act_TRX-2026-00124_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 09, 2026 · 8:14 PM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00124_2",
        "title": "Payment Settled",
        "timestamp": "Oct 09, 2026 · 8:14 PM",
        "description": "Funds of $79 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00123",
    "shortId": "00123",
    "userId": "usr_6521",
    "userName": "Ananya Sharma",
    "userEmail": "ananya.s@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98200 12345",
    "userLocation": "Bangalore, India",
    "amount": 1999,
    "usdAmount": 24,
    "currency": "INR",
    "currencySymbol": "₹",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-10-07T18:21:00Z",
    "formattedDate": "Oct 07, 2026 · 6:21 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "AI Mock Interview & Assessment Engine",
    "invoiceNumber": "INV-2026-0090",
    "activities": [
      {
        "id": "act_TRX-2026-00123_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 07, 2026 · 6:21 PM",
        "description": "Checkout initialized for AI Mock Interview & Assessment Engine via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00123_2",
        "title": "Payment Settled",
        "timestamp": "Oct 07, 2026 · 6:21 PM",
        "description": "Funds of ₹1999 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00122",
    "shortId": "00122",
    "userId": "usr_7732",
    "userName": "Carlos Gomez",
    "userEmail": "carlos.g@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+34 91 123 4567",
    "userLocation": "Madrid, Spain",
    "amount": 49,
    "usdAmount": 53,
    "currency": "EUR",
    "currencySymbol": "€",
    "paymentMethod": "PayPal",
    "paymentMethodType": "PayPal",
    "date": "2026-10-05T15:11:00Z",
    "formattedDate": "Oct 05, 2026 · 3:11 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "Basic Career Discovery Membership",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00122_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 05, 2026 · 3:11 PM",
        "description": "Checkout initialized for Basic Career Discovery Membership via PayPal."
      },
      {
        "id": "act_TRX-2026-00122_2",
        "title": "Payment Settled",
        "timestamp": "Oct 05, 2026 · 3:11 PM",
        "description": "Funds of €49 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00121",
    "shortId": "00121",
    "userId": "usr_2910",
    "userName": "Chukwudi Okafor",
    "userEmail": "c.okafor@techlagos.ng",
    "userAvatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+234 802 345 6789",
    "userLocation": "Lagos, Nigeria",
    "amount": 149,
    "usdAmount": 149,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 2245",
    "paymentMethodType": "Visa",
    "date": "2026-10-02T11:44:00Z",
    "formattedDate": "Oct 02, 2026 · 11:44 AM",
    "status": "Successful",
    "plan": "Premium",
    "description": "UK Skilled Worker Placement Retainer",
    "invoiceNumber": "INV-2026-0089",
    "activities": [
      {
        "id": "act_TRX-2026-00121_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 02, 2026 · 11:44 AM",
        "description": "Checkout initialized for UK Skilled Worker Placement Retainer via Visa •••• 2245."
      },
      {
        "id": "act_TRX-2026-00121_2",
        "title": "Payment Settled",
        "timestamp": "Oct 02, 2026 · 11:44 AM",
        "description": "Funds of $149 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00120",
    "shortId": "00120",
    "userId": "usr_3319",
    "userName": "Daisuke Tanaka",
    "userEmail": "tanaka.d@tokyo-it.jp",
    "userAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+81 3 1234 5678",
    "userLocation": "Tokyo, Japan",
    "amount": 12500,
    "usdAmount": 83,
    "currency": "JPY",
    "currencySymbol": "¥",
    "paymentMethod": "JCB •••• 6677",
    "paymentMethodType": "JCB",
    "date": "2026-09-28T14:09:00Z",
    "formattedDate": "Sep 28, 2026 · 2:09 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "Executive Career Sponsorship Track",
    "invoiceNumber": "INV-2026-0088",
    "activities": [
      {
        "id": "act_TRX-2026-00120_1",
        "title": "Transaction Initiated",
        "timestamp": "Sep 28, 2026 · 2:09 PM",
        "description": "Checkout initialized for Executive Career Sponsorship Track via JCB •••• 6677."
      },
      {
        "id": "act_TRX-2026-00120_2",
        "title": "Payment Settled",
        "timestamp": "Sep 28, 2026 · 2:09 PM",
        "description": "Funds of ¥12500 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00119",
    "shortId": "00119",
    "userId": "usr_9401",
    "userName": "Elena Petrova",
    "userEmail": "elena.p@company.ru",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+49 30 123456",
    "userLocation": "Berlin, Germany",
    "amount": 299,
    "usdAmount": 299,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 3321",
    "paymentMethodType": "Mastercard",
    "date": "2026-09-25T16:37:00Z",
    "formattedDate": "Sep 25, 2026 · 4:37 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "Global Visa Placement Guarantee Tier",
    "invoiceNumber": "INV-2026-0087",
    "activities": [
      {
        "id": "act_TRX-2026-00119_1",
        "title": "Transaction Initiated",
        "timestamp": "Sep 25, 2026 · 4:37 PM",
        "description": "Checkout initialized for Global Visa Placement Guarantee Tier via Mastercard •••• 3321."
      },
      {
        "id": "act_TRX-2026-00119_2",
        "title": "Payment Settled",
        "timestamp": "Sep 25, 2026 · 4:37 PM",
        "description": "Funds of $299 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00118",
    "shortId": "00118",
    "userId": "usr_1002",
    "userName": "Lucas Martin",
    "userEmail": "lucas.m@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+1 212 555 0148",
    "userLocation": "New York, USA",
    "amount": 79,
    "usdAmount": 79,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Stripe",
    "paymentMethodType": "Stripe",
    "date": "2026-09-22T09:15:00Z",
    "formattedDate": "Sep 22, 2026 · 9:15 AM",
    "status": "Successful",
    "plan": "Premium",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": "INV-2026-0086",
    "activities": [
      {
        "id": "act_TRX-2026-00118_1",
        "title": "Transaction Initiated",
        "timestamp": "Sep 22, 2026 · 9:15 AM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via Stripe."
      },
      {
        "id": "act_TRX-2026-00118_2",
        "title": "Payment Settled",
        "timestamp": "Sep 22, 2026 · 9:15 AM",
        "description": "Funds of $79 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00117",
    "shortId": "00117",
    "userId": "usr_9182",
    "userName": "Sofia Rossi",
    "userEmail": "sofia.r@company.it",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+39 06 1234567",
    "userLocation": "Rome, Italy",
    "amount": 99,
    "usdAmount": 107,
    "currency": "EUR",
    "currencySymbol": "€",
    "paymentMethod": "Visa •••• 7788",
    "paymentMethodType": "Visa",
    "date": "2026-09-19T13:26:00Z",
    "formattedDate": "Sep 19, 2026 · 1:26 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "ATS Resume Optimization & Global Tailoring",
    "invoiceNumber": "INV-2026-0085",
    "activities": [
      {
        "id": "act_TRX-2026-00117_1",
        "title": "Transaction Initiated",
        "timestamp": "Sep 19, 2026 · 1:26 PM",
        "description": "Checkout initialized for ATS Resume Optimization & Global Tailoring via Visa •••• 7788."
      },
      {
        "id": "act_TRX-2026-00117_2",
        "title": "Payment Settled",
        "timestamp": "Sep 19, 2026 · 1:26 PM",
        "description": "Funds of €99 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00116",
    "shortId": "00116",
    "userId": "usr_5210",
    "userName": "Liam O'Connor",
    "userEmail": "liam.o@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+353 1 234 5678",
    "userLocation": "Dublin, Ireland",
    "amount": 149,
    "usdAmount": 149,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "PayPal",
    "paymentMethodType": "PayPal",
    "date": "2026-09-16T17:03:00Z",
    "formattedDate": "Sep 16, 2026 · 5:03 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": "INV-2026-0084",
    "activities": [
      {
        "id": "act_TRX-2026-00116_1",
        "title": "Transaction Initiated",
        "timestamp": "Sep 16, 2026 · 5:03 PM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via PayPal."
      },
      {
        "id": "act_TRX-2026-00116_2",
        "title": "Payment Settled",
        "timestamp": "Sep 16, 2026 · 5:03 PM",
        "description": "Funds of $149 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00115",
    "shortId": "00115",
    "userId": "usr_1822",
    "userName": "Priya Mehta",
    "userEmail": "priya.m@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98111 22334",
    "userLocation": "Mumbai, India",
    "amount": 999,
    "usdAmount": 12,
    "currency": "INR",
    "currencySymbol": "₹",
    "paymentMethod": "Razorpay",
    "paymentMethodType": "Razorpay",
    "date": "2026-09-12T10:41:00Z",
    "formattedDate": "Sep 12, 2026 · 10:41 AM",
    "status": "Successful",
    "plan": "Basic",
    "description": "AI Resume Ingestion Engine (1M Tokens)",
    "invoiceNumber": "INV-2026-0083",
    "activities": [
      {
        "id": "act_TRX-2026-00115_1",
        "title": "Transaction Initiated",
        "timestamp": "Sep 12, 2026 · 10:41 AM",
        "description": "Checkout initialized for AI Resume Ingestion Engine (1M Tokens) via Razorpay."
      },
      {
        "id": "act_TRX-2026-00115_2",
        "title": "Payment Settled",
        "timestamp": "Sep 12, 2026 · 10:41 AM",
        "description": "Funds of ₹999 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00114",
    "shortId": "00114",
    "userId": "usr_9104",
    "userName": "Aarav Patel",
    "userEmail": "aarav.p@outlook.com",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+44 7700 900142",
    "userLocation": "London, United Kingdom",
    "amount": 149,
    "usdAmount": 149,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-08-28T14:20:00Z",
    "formattedDate": "Aug 28, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": "INV-2026-084",
    "activities": [
      {
        "id": "act_TRX-2026-00114_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 28, 2026 · 2:20 PM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00114_2",
        "title": "Payment Settled",
        "timestamp": "Aug 28, 2026 · 2:20 PM",
        "description": "Funds of $149 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00113",
    "shortId": "00113",
    "userId": "usr_6521",
    "userName": "Ananya Sharma",
    "userEmail": "ananya.s@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98200 12345",
    "userLocation": "Bangalore, India",
    "amount": 450,
    "usdAmount": 450,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-08-27T14:20:00Z",
    "formattedDate": "Aug 27, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "Executive Career Sponsorship Track",
    "invoiceNumber": "INV-2026-083",
    "activities": [
      {
        "id": "act_TRX-2026-00113_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 27, 2026 · 2:20 PM",
        "description": "Checkout initialized for Executive Career Sponsorship Track via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00113_2",
        "title": "Payment Settled",
        "timestamp": "Aug 27, 2026 · 2:20 PM",
        "description": "Funds of $450 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00112",
    "shortId": "00112",
    "userId": "usr_7732",
    "userName": "Carlos Gomez",
    "userEmail": "carlos.g@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+34 91 123 4567",
    "userLocation": "Madrid, Spain",
    "amount": 120,
    "usdAmount": 120,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "PayPal",
    "paymentMethodType": "PayPal",
    "date": "2026-08-26T14:20:00Z",
    "formattedDate": "Aug 26, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "AI Mock Interview & Assessment Engine",
    "invoiceNumber": "INV-2026-082",
    "activities": [
      {
        "id": "act_TRX-2026-00112_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 26, 2026 · 2:20 PM",
        "description": "Checkout initialized for AI Mock Interview & Assessment Engine via PayPal."
      },
      {
        "id": "act_TRX-2026-00112_2",
        "title": "Payment Settled",
        "timestamp": "Aug 26, 2026 · 2:20 PM",
        "description": "Funds of $120 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00111",
    "shortId": "00111",
    "userId": "usr_2910",
    "userName": "Chukwudi Okafor",
    "userEmail": "c.okafor@techlagos.ng",
    "userAvatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+234 802 345 6789",
    "userLocation": "Lagos, Nigeria",
    "amount": 149,
    "usdAmount": 149,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "JCB •••• 6677",
    "paymentMethodType": "JCB",
    "date": "2026-08-25T14:20:00Z",
    "formattedDate": "Aug 25, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "ATS Resume Optimization & Global Tailoring",
    "invoiceNumber": "INV-2026-081",
    "activities": [
      {
        "id": "act_TRX-2026-00111_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 25, 2026 · 2:20 PM",
        "description": "Checkout initialized for ATS Resume Optimization & Global Tailoring via JCB •••• 6677."
      },
      {
        "id": "act_TRX-2026-00111_2",
        "title": "Payment Settled",
        "timestamp": "Aug 25, 2026 · 2:20 PM",
        "description": "Funds of $149 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00110",
    "shortId": "00110",
    "userId": "usr_3319",
    "userName": "Daisuke Tanaka",
    "userEmail": "tanaka.d@tokyo-it.jp",
    "userAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+81 3 1234 5678",
    "userLocation": "Tokyo, Japan",
    "amount": 499,
    "usdAmount": 499,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Stripe",
    "paymentMethodType": "Stripe",
    "date": "2026-08-24T14:20:00Z",
    "formattedDate": "Aug 24, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "Global Visa Placement Guarantee Tier",
    "invoiceNumber": "INV-2026-080",
    "activities": [
      {
        "id": "act_TRX-2026-00110_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 24, 2026 · 2:20 PM",
        "description": "Checkout initialized for Global Visa Placement Guarantee Tier via Stripe."
      },
      {
        "id": "act_TRX-2026-00110_2",
        "title": "Payment Settled",
        "timestamp": "Aug 24, 2026 · 2:20 PM",
        "description": "Funds of $499 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00109",
    "shortId": "00109",
    "userId": "usr_9401",
    "userName": "Elena Petrova",
    "userEmail": "elena.p@company.ru",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+49 30 123456",
    "userLocation": "Berlin, Germany",
    "amount": 99,
    "usdAmount": 99,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Razorpay",
    "paymentMethodType": "Razorpay",
    "date": "2026-08-23T14:20:00Z",
    "formattedDate": "Aug 23, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "Basic Career Discovery Membership",
    "invoiceNumber": "INV-2026-079",
    "activities": [
      {
        "id": "act_TRX-2026-00109_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 23, 2026 · 2:20 PM",
        "description": "Checkout initialized for Basic Career Discovery Membership via Razorpay."
      },
      {
        "id": "act_TRX-2026-00109_2",
        "title": "Payment Settled",
        "timestamp": "Aug 23, 2026 · 2:20 PM",
        "description": "Funds of $99 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00108",
    "shortId": "00108",
    "userId": "usr_1002",
    "userName": "Lucas Martin",
    "userEmail": "lucas.m@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+1 212 555 0148",
    "userLocation": "New York, USA",
    "amount": 79,
    "usdAmount": 79,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-08-22T14:20:00Z",
    "formattedDate": "Aug 22, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "International Visa Filing Expediter",
    "invoiceNumber": "INV-2026-078",
    "activities": [
      {
        "id": "act_TRX-2026-00108_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 22, 2026 · 2:20 PM",
        "description": "Checkout initialized for International Visa Filing Expediter via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00108_2",
        "title": "Payment Settled",
        "timestamp": "Aug 22, 2026 · 2:20 PM",
        "description": "Funds of $79 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00107",
    "shortId": "00107",
    "userId": "usr_9182",
    "userName": "Sofia Rossi",
    "userEmail": "sofia.r@company.it",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+39 06 1234567",
    "userLocation": "Rome, Italy",
    "amount": 450,
    "usdAmount": 450,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-08-21T14:20:00Z",
    "formattedDate": "Aug 21, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "UK Skilled Worker Placement Retainer",
    "invoiceNumber": "INV-2026-077",
    "activities": [
      {
        "id": "act_TRX-2026-00107_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 21, 2026 · 2:20 PM",
        "description": "Checkout initialized for UK Skilled Worker Placement Retainer via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00107_2",
        "title": "Payment Settled",
        "timestamp": "Aug 21, 2026 · 2:20 PM",
        "description": "Funds of $450 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00106",
    "shortId": "00106",
    "userId": "usr_5210",
    "userName": "Liam O'Connor",
    "userEmail": "liam.o@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+353 1 234 5678",
    "userLocation": "Dublin, Ireland",
    "amount": 499,
    "usdAmount": 499,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "PayPal",
    "paymentMethodType": "PayPal",
    "date": "2026-08-20T14:20:00Z",
    "formattedDate": "Aug 20, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "AI Resume Ingestion Engine (1M Tokens)",
    "invoiceNumber": "INV-2026-076",
    "activities": [
      {
        "id": "act_TRX-2026-00106_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 20, 2026 · 2:20 PM",
        "description": "Checkout initialized for AI Resume Ingestion Engine (1M Tokens) via PayPal."
      },
      {
        "id": "act_TRX-2026-00106_2",
        "title": "Payment Settled",
        "timestamp": "Aug 20, 2026 · 2:20 PM",
        "description": "Funds of $499 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00105",
    "shortId": "00105",
    "userId": "usr_1822",
    "userName": "Priya Mehta",
    "userEmail": "priya.m@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98111 22334",
    "userLocation": "Mumbai, India",
    "amount": 120,
    "usdAmount": 120,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "JCB •••• 6677",
    "paymentMethodType": "JCB",
    "date": "2026-08-19T14:20:00Z",
    "formattedDate": "Aug 19, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": "INV-2026-075",
    "activities": [
      {
        "id": "act_TRX-2026-00105_1",
        "title": "Transaction Initiated",
        "timestamp": "Aug 19, 2026 · 2:20 PM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via JCB •••• 6677."
      },
      {
        "id": "act_TRX-2026-00105_2",
        "title": "Payment Settled",
        "timestamp": "Aug 19, 2026 · 2:20 PM",
        "description": "Funds of $120 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00104",
    "shortId": "00104",
    "userId": "usr_9104",
    "userName": "Aarav Patel",
    "userEmail": "aarav.p@outlook.com",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+44 7700 900142",
    "userLocation": "London, United Kingdom",
    "amount": 120,
    "usdAmount": 120,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Stripe",
    "paymentMethodType": "Stripe",
    "date": "2026-07-18T14:20:00Z",
    "formattedDate": "Jul 18, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "Executive Career Sponsorship Track",
    "invoiceNumber": "INV-2026-074",
    "activities": [
      {
        "id": "act_TRX-2026-00104_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 18, 2026 · 2:20 PM",
        "description": "Checkout initialized for Executive Career Sponsorship Track via Stripe."
      },
      {
        "id": "act_TRX-2026-00104_2",
        "title": "Payment Settled",
        "timestamp": "Jul 18, 2026 · 2:20 PM",
        "description": "Funds of $120 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00103",
    "shortId": "00103",
    "userId": "usr_6521",
    "userName": "Ananya Sharma",
    "userEmail": "ananya.s@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98200 12345",
    "userLocation": "Bangalore, India",
    "amount": 450,
    "usdAmount": 450,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Razorpay",
    "paymentMethodType": "Razorpay",
    "date": "2026-07-17T14:20:00Z",
    "formattedDate": "Jul 17, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "AI Mock Interview & Assessment Engine",
    "invoiceNumber": "INV-2026-073",
    "activities": [
      {
        "id": "act_TRX-2026-00103_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 17, 2026 · 2:20 PM",
        "description": "Checkout initialized for AI Mock Interview & Assessment Engine via Razorpay."
      },
      {
        "id": "act_TRX-2026-00103_2",
        "title": "Payment Settled",
        "timestamp": "Jul 17, 2026 · 2:20 PM",
        "description": "Funds of $450 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00102",
    "shortId": "00102",
    "userId": "usr_7732",
    "userName": "Carlos Gomez",
    "userEmail": "carlos.g@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+34 91 123 4567",
    "userLocation": "Madrid, Spain",
    "amount": 299,
    "usdAmount": 299,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-07-16T14:20:00Z",
    "formattedDate": "Jul 16, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "ATS Resume Optimization & Global Tailoring",
    "invoiceNumber": "INV-2026-072",
    "activities": [
      {
        "id": "act_TRX-2026-00102_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 16, 2026 · 2:20 PM",
        "description": "Checkout initialized for ATS Resume Optimization & Global Tailoring via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00102_2",
        "title": "Payment Settled",
        "timestamp": "Jul 16, 2026 · 2:20 PM",
        "description": "Funds of $299 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00101",
    "shortId": "00101",
    "userId": "usr_2910",
    "userName": "Chukwudi Okafor",
    "userEmail": "c.okafor@techlagos.ng",
    "userAvatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+234 802 345 6789",
    "userLocation": "Lagos, Nigeria",
    "amount": 249,
    "usdAmount": 249,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-07-15T14:20:00Z",
    "formattedDate": "Jul 15, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "Global Visa Placement Guarantee Tier",
    "invoiceNumber": "INV-2026-071",
    "activities": [
      {
        "id": "act_TRX-2026-00101_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 15, 2026 · 2:20 PM",
        "description": "Checkout initialized for Global Visa Placement Guarantee Tier via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00101_2",
        "title": "Payment Settled",
        "timestamp": "Jul 15, 2026 · 2:20 PM",
        "description": "Funds of $249 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00100",
    "shortId": "00100",
    "userId": "usr_3319",
    "userName": "Daisuke Tanaka",
    "userEmail": "tanaka.d@tokyo-it.jp",
    "userAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+81 3 1234 5678",
    "userLocation": "Tokyo, Japan",
    "amount": 120,
    "usdAmount": 120,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "PayPal",
    "paymentMethodType": "PayPal",
    "date": "2026-07-14T14:20:00Z",
    "formattedDate": "Jul 14, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "Basic Career Discovery Membership",
    "invoiceNumber": "INV-2026-070",
    "activities": [
      {
        "id": "act_TRX-2026-00100_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 14, 2026 · 2:20 PM",
        "description": "Checkout initialized for Basic Career Discovery Membership via PayPal."
      },
      {
        "id": "act_TRX-2026-00100_2",
        "title": "Payment Settled",
        "timestamp": "Jul 14, 2026 · 2:20 PM",
        "description": "Funds of $120 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00099",
    "shortId": "00099",
    "userId": "usr_9401",
    "userName": "Elena Petrova",
    "userEmail": "elena.p@company.ru",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+49 30 123456",
    "userLocation": "Berlin, Germany",
    "amount": 299,
    "usdAmount": 299,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "JCB •••• 6677",
    "paymentMethodType": "JCB",
    "date": "2026-07-13T14:20:00Z",
    "formattedDate": "Jul 13, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "International Visa Filing Expediter",
    "invoiceNumber": "INV-2026-069",
    "activities": [
      {
        "id": "act_TRX-2026-00099_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 13, 2026 · 2:20 PM",
        "description": "Checkout initialized for International Visa Filing Expediter via JCB •••• 6677."
      },
      {
        "id": "act_TRX-2026-00099_2",
        "title": "Payment Settled",
        "timestamp": "Jul 13, 2026 · 2:20 PM",
        "description": "Funds of $299 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00098",
    "shortId": "00098",
    "userId": "usr_1002",
    "userName": "Lucas Martin",
    "userEmail": "lucas.m@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+1 212 555 0148",
    "userLocation": "New York, USA",
    "amount": 450,
    "usdAmount": 450,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Stripe",
    "paymentMethodType": "Stripe",
    "date": "2026-07-12T14:20:00Z",
    "formattedDate": "Jul 12, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "UK Skilled Worker Placement Retainer",
    "invoiceNumber": "INV-2026-068",
    "activities": [
      {
        "id": "act_TRX-2026-00098_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 12, 2026 · 2:20 PM",
        "description": "Checkout initialized for UK Skilled Worker Placement Retainer via Stripe."
      },
      {
        "id": "act_TRX-2026-00098_2",
        "title": "Payment Settled",
        "timestamp": "Jul 12, 2026 · 2:20 PM",
        "description": "Funds of $450 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00097",
    "shortId": "00097",
    "userId": "usr_9182",
    "userName": "Sofia Rossi",
    "userEmail": "sofia.r@company.it",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+39 06 1234567",
    "userLocation": "Rome, Italy",
    "amount": 149,
    "usdAmount": 149,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Razorpay",
    "paymentMethodType": "Razorpay",
    "date": "2026-07-11T14:20:00Z",
    "formattedDate": "Jul 11, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "AI Resume Ingestion Engine (1M Tokens)",
    "invoiceNumber": "INV-2026-067",
    "activities": [
      {
        "id": "act_TRX-2026-00097_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 11, 2026 · 2:20 PM",
        "description": "Checkout initialized for AI Resume Ingestion Engine (1M Tokens) via Razorpay."
      },
      {
        "id": "act_TRX-2026-00097_2",
        "title": "Payment Settled",
        "timestamp": "Jul 11, 2026 · 2:20 PM",
        "description": "Funds of $149 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00096",
    "shortId": "00096",
    "userId": "usr_5210",
    "userName": "Liam O'Connor",
    "userEmail": "liam.o@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+353 1 234 5678",
    "userLocation": "Dublin, Ireland",
    "amount": 499,
    "usdAmount": 499,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-07-10T14:20:00Z",
    "formattedDate": "Jul 10, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": "INV-2026-066",
    "activities": [
      {
        "id": "act_TRX-2026-00096_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 10, 2026 · 2:20 PM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00096_2",
        "title": "Payment Settled",
        "timestamp": "Jul 10, 2026 · 2:20 PM",
        "description": "Funds of $499 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00095",
    "shortId": "00095",
    "userId": "usr_1822",
    "userName": "Priya Mehta",
    "userEmail": "priya.m@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98111 22334",
    "userLocation": "Mumbai, India",
    "amount": 79,
    "usdAmount": 79,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-07-09T14:20:00Z",
    "formattedDate": "Jul 09, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "Executive Career Sponsorship Track",
    "invoiceNumber": "INV-2026-065",
    "activities": [
      {
        "id": "act_TRX-2026-00095_1",
        "title": "Transaction Initiated",
        "timestamp": "Jul 09, 2026 · 2:20 PM",
        "description": "Checkout initialized for Executive Career Sponsorship Track via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00095_2",
        "title": "Payment Settled",
        "timestamp": "Jul 09, 2026 · 2:20 PM",
        "description": "Funds of $79 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00094",
    "shortId": "00094",
    "userId": "usr_9104",
    "userName": "Aarav Patel",
    "userEmail": "aarav.p@outlook.com",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+44 7700 900142",
    "userLocation": "London, United Kingdom",
    "amount": 79,
    "usdAmount": 79,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "PayPal",
    "paymentMethodType": "PayPal",
    "date": "2026-06-08T14:20:00Z",
    "formattedDate": "Jun 08, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "AI Mock Interview & Assessment Engine",
    "invoiceNumber": "INV-2026-064",
    "activities": [
      {
        "id": "act_TRX-2026-00094_1",
        "title": "Transaction Initiated",
        "timestamp": "Jun 08, 2026 · 2:20 PM",
        "description": "Checkout initialized for AI Mock Interview & Assessment Engine via PayPal."
      },
      {
        "id": "act_TRX-2026-00094_2",
        "title": "Payment Settled",
        "timestamp": "Jun 08, 2026 · 2:20 PM",
        "description": "Funds of $79 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00093",
    "shortId": "00093",
    "userId": "usr_6521",
    "userName": "Ananya Sharma",
    "userEmail": "ananya.s@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98200 12345",
    "userLocation": "Bangalore, India",
    "amount": 450,
    "usdAmount": 450,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "JCB •••• 6677",
    "paymentMethodType": "JCB",
    "date": "2026-06-07T14:20:00Z",
    "formattedDate": "Jun 07, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "ATS Resume Optimization & Global Tailoring",
    "invoiceNumber": "INV-2026-063",
    "activities": [
      {
        "id": "act_TRX-2026-00093_1",
        "title": "Transaction Initiated",
        "timestamp": "Jun 07, 2026 · 2:20 PM",
        "description": "Checkout initialized for ATS Resume Optimization & Global Tailoring via JCB •••• 6677."
      },
      {
        "id": "act_TRX-2026-00093_2",
        "title": "Payment Settled",
        "timestamp": "Jun 07, 2026 · 2:20 PM",
        "description": "Funds of $450 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00092",
    "shortId": "00092",
    "userId": "usr_7732",
    "userName": "Carlos Gomez",
    "userEmail": "carlos.g@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+34 91 123 4567",
    "userLocation": "Madrid, Spain",
    "amount": 120,
    "usdAmount": 120,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Stripe",
    "paymentMethodType": "Stripe",
    "date": "2026-06-06T14:20:00Z",
    "formattedDate": "Jun 06, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "Global Visa Placement Guarantee Tier",
    "invoiceNumber": "INV-2026-062",
    "activities": [
      {
        "id": "act_TRX-2026-00092_1",
        "title": "Transaction Initiated",
        "timestamp": "Jun 06, 2026 · 2:20 PM",
        "description": "Checkout initialized for Global Visa Placement Guarantee Tier via Stripe."
      },
      {
        "id": "act_TRX-2026-00092_2",
        "title": "Payment Settled",
        "timestamp": "Jun 06, 2026 · 2:20 PM",
        "description": "Funds of $120 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00091",
    "shortId": "00091",
    "userId": "usr_2910",
    "userName": "Chukwudi Okafor",
    "userEmail": "c.okafor@techlagos.ng",
    "userAvatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+234 802 345 6789",
    "userLocation": "Lagos, Nigeria",
    "amount": 179,
    "usdAmount": 179,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Razorpay",
    "paymentMethodType": "Razorpay",
    "date": "2026-06-05T14:20:00Z",
    "formattedDate": "Jun 05, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "Basic Career Discovery Membership",
    "invoiceNumber": "INV-2026-061",
    "activities": [
      {
        "id": "act_TRX-2026-00091_1",
        "title": "Transaction Initiated",
        "timestamp": "Jun 05, 2026 · 2:20 PM",
        "description": "Checkout initialized for Basic Career Discovery Membership via Razorpay."
      },
      {
        "id": "act_TRX-2026-00091_2",
        "title": "Payment Settled",
        "timestamp": "Jun 05, 2026 · 2:20 PM",
        "description": "Funds of $179 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00090",
    "shortId": "00090",
    "userId": "usr_3319",
    "userName": "Daisuke Tanaka",
    "userEmail": "tanaka.d@tokyo-it.jp",
    "userAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+81 3 1234 5678",
    "userLocation": "Tokyo, Japan",
    "amount": 199,
    "usdAmount": 199,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-06-04T14:20:00Z",
    "formattedDate": "Jun 04, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "International Visa Filing Expediter",
    "invoiceNumber": "INV-2026-060",
    "activities": [
      {
        "id": "act_TRX-2026-00090_1",
        "title": "Transaction Initiated",
        "timestamp": "Jun 04, 2026 · 2:20 PM",
        "description": "Checkout initialized for International Visa Filing Expediter via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00090_2",
        "title": "Payment Settled",
        "timestamp": "Jun 04, 2026 · 2:20 PM",
        "description": "Funds of $199 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00089",
    "shortId": "00089",
    "userId": "usr_9401",
    "userName": "Elena Petrova",
    "userEmail": "elena.p@company.ru",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+49 30 123456",
    "userLocation": "Berlin, Germany",
    "amount": 249,
    "usdAmount": 249,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-06-28T14:20:00Z",
    "formattedDate": "Jun 28, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "UK Skilled Worker Placement Retainer",
    "invoiceNumber": "INV-2026-059",
    "activities": [
      {
        "id": "act_TRX-2026-00089_1",
        "title": "Transaction Initiated",
        "timestamp": "Jun 28, 2026 · 2:20 PM",
        "description": "Checkout initialized for UK Skilled Worker Placement Retainer via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00089_2",
        "title": "Payment Settled",
        "timestamp": "Jun 28, 2026 · 2:20 PM",
        "description": "Funds of $249 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00088",
    "shortId": "00088",
    "userId": "usr_1002",
    "userName": "Lucas Martin",
    "userEmail": "lucas.m@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+1 212 555 0148",
    "userLocation": "New York, USA",
    "amount": 49,
    "usdAmount": 49,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "PayPal",
    "paymentMethodType": "PayPal",
    "date": "2026-06-27T14:20:00Z",
    "formattedDate": "Jun 27, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "AI Resume Ingestion Engine (1M Tokens)",
    "invoiceNumber": "INV-2026-058",
    "activities": [
      {
        "id": "act_TRX-2026-00088_1",
        "title": "Transaction Initiated",
        "timestamp": "Jun 27, 2026 · 2:20 PM",
        "description": "Checkout initialized for AI Resume Ingestion Engine (1M Tokens) via PayPal."
      },
      {
        "id": "act_TRX-2026-00088_2",
        "title": "Payment Settled",
        "timestamp": "Jun 27, 2026 · 2:20 PM",
        "description": "Funds of $49 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00087",
    "shortId": "00087",
    "userId": "usr_9182",
    "userName": "Sofia Rossi",
    "userEmail": "sofia.r@company.it",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+39 06 1234567",
    "userLocation": "Rome, Italy",
    "amount": 99,
    "usdAmount": 99,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "JCB •••• 6677",
    "paymentMethodType": "JCB",
    "date": "2026-06-26T14:20:00Z",
    "formattedDate": "Jun 26, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": "INV-2026-057",
    "activities": [
      {
        "id": "act_TRX-2026-00087_1",
        "title": "Transaction Initiated",
        "timestamp": "Jun 26, 2026 · 2:20 PM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via JCB •••• 6677."
      },
      {
        "id": "act_TRX-2026-00087_2",
        "title": "Payment Settled",
        "timestamp": "Jun 26, 2026 · 2:20 PM",
        "description": "Funds of $99 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00086",
    "shortId": "00086",
    "userId": "usr_5210",
    "userName": "Liam O'Connor",
    "userEmail": "liam.o@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+353 1 234 5678",
    "userLocation": "Dublin, Ireland",
    "amount": 299,
    "usdAmount": 299,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Stripe",
    "paymentMethodType": "Stripe",
    "date": "2026-05-25T14:20:00Z",
    "formattedDate": "May 25, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Premium",
    "description": "Executive Career Sponsorship Track",
    "invoiceNumber": "INV-2026-056",
    "activities": [
      {
        "id": "act_TRX-2026-00086_1",
        "title": "Transaction Initiated",
        "timestamp": "May 25, 2026 · 2:20 PM",
        "description": "Checkout initialized for Executive Career Sponsorship Track via Stripe."
      },
      {
        "id": "act_TRX-2026-00086_2",
        "title": "Payment Settled",
        "timestamp": "May 25, 2026 · 2:20 PM",
        "description": "Funds of $299 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00085",
    "shortId": "00085",
    "userId": "usr_1822",
    "userName": "Priya Mehta",
    "userEmail": "priya.m@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98111 22334",
    "userLocation": "Mumbai, India",
    "amount": 179,
    "usdAmount": 179,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Razorpay",
    "paymentMethodType": "Razorpay",
    "date": "2026-05-24T14:20:00Z",
    "formattedDate": "May 24, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Basic",
    "description": "AI Mock Interview & Assessment Engine",
    "invoiceNumber": "INV-2026-055",
    "activities": [
      {
        "id": "act_TRX-2026-00085_1",
        "title": "Transaction Initiated",
        "timestamp": "May 24, 2026 · 2:20 PM",
        "description": "Checkout initialized for AI Mock Interview & Assessment Engine via Razorpay."
      },
      {
        "id": "act_TRX-2026-00085_2",
        "title": "Payment Settled",
        "timestamp": "May 24, 2026 · 2:20 PM",
        "description": "Funds of $179 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00084",
    "shortId": "00084",
    "userId": "usr_9104",
    "userName": "Aarav Patel",
    "userEmail": "aarav.p@outlook.com",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+44 7700 900142",
    "userLocation": "London, United Kingdom",
    "amount": 299,
    "usdAmount": 299,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-05-23T14:20:00Z",
    "formattedDate": "May 23, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Executive",
    "description": "ATS Resume Optimization & Global Tailoring",
    "invoiceNumber": "INV-2026-054",
    "activities": [
      {
        "id": "act_TRX-2026-00084_1",
        "title": "Transaction Initiated",
        "timestamp": "May 23, 2026 · 2:20 PM",
        "description": "Checkout initialized for ATS Resume Optimization & Global Tailoring via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00084_2",
        "title": "Payment Settled",
        "timestamp": "May 23, 2026 · 2:20 PM",
        "description": "Funds of $299 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00083",
    "shortId": "00083",
    "userId": "usr_6521",
    "userName": "Ananya Sharma",
    "userEmail": "ananya.s@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98200 12345",
    "userLocation": "Bangalore, India",
    "amount": 179,
    "usdAmount": 179,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-05-22T14:20:00Z",
    "formattedDate": "May 22, 2026 · 2:20 PM",
    "status": "Successful",
    "plan": "Concierge",
    "description": "Global Visa Placement Guarantee Tier",
    "invoiceNumber": "INV-2026-053",
    "activities": [
      {
        "id": "act_TRX-2026-00083_1",
        "title": "Transaction Initiated",
        "timestamp": "May 22, 2026 · 2:20 PM",
        "description": "Checkout initialized for Global Visa Placement Guarantee Tier via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00083_2",
        "title": "Payment Settled",
        "timestamp": "May 22, 2026 · 2:20 PM",
        "description": "Funds of $179 settled to AIFA Global Operations."
      }
    ]
  },
  {
    "id": "TRX-2026-00082",
    "shortId": "00082",
    "userId": "usr_7732",
    "userName": "Carlos Gomez",
    "userEmail": "carlos.g@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+34 91 123 4567",
    "userLocation": "Madrid, Spain",
    "amount": 149,
    "usdAmount": 149,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-10-10T11:00:00Z",
    "formattedDate": "Oct 10, 2026 · 11:00 AM",
    "status": "Pending",
    "plan": "Premium",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00082_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00082_2",
        "title": "Awaiting Settlement",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Processing clearance from clearinghouse."
      }
    ]
  },
  {
    "id": "TRX-2026-00081",
    "shortId": "00081",
    "userId": "usr_2910",
    "userName": "Chukwudi Okafor",
    "userEmail": "c.okafor@techlagos.ng",
    "userAvatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+234 802 345 6789",
    "userLocation": "Lagos, Nigeria",
    "amount": 79,
    "usdAmount": 79,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-10-10T11:00:00Z",
    "formattedDate": "Oct 10, 2026 · 11:00 AM",
    "status": "Pending",
    "plan": "Basic",
    "description": "Executive Career Sponsorship Track",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00081_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Checkout initialized for Executive Career Sponsorship Track via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00081_2",
        "title": "Awaiting Settlement",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Processing clearance from clearinghouse."
      }
    ]
  },
  {
    "id": "TRX-2026-00080",
    "shortId": "00080",
    "userId": "usr_3319",
    "userName": "Daisuke Tanaka",
    "userEmail": "tanaka.d@tokyo-it.jp",
    "userAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+81 3 1234 5678",
    "userLocation": "Tokyo, Japan",
    "amount": 45,
    "usdAmount": 45,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "PayPal",
    "paymentMethodType": "PayPal",
    "date": "2026-10-10T11:00:00Z",
    "formattedDate": "Oct 10, 2026 · 11:00 AM",
    "status": "Pending",
    "plan": "Executive",
    "description": "AI Mock Interview & Assessment Engine",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00080_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Checkout initialized for AI Mock Interview & Assessment Engine via PayPal."
      },
      {
        "id": "act_TRX-2026-00080_2",
        "title": "Awaiting Settlement",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Processing clearance from clearinghouse."
      }
    ]
  },
  {
    "id": "TRX-2026-00079",
    "shortId": "00079",
    "userId": "usr_9401",
    "userName": "Elena Petrova",
    "userEmail": "elena.p@company.ru",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+49 30 123456",
    "userLocation": "Berlin, Germany",
    "amount": 199,
    "usdAmount": 199,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "JCB •••• 6677",
    "paymentMethodType": "JCB",
    "date": "2026-10-10T11:00:00Z",
    "formattedDate": "Oct 10, 2026 · 11:00 AM",
    "status": "Pending",
    "plan": "Concierge",
    "description": "ATS Resume Optimization & Global Tailoring",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00079_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Checkout initialized for ATS Resume Optimization & Global Tailoring via JCB •••• 6677."
      },
      {
        "id": "act_TRX-2026-00079_2",
        "title": "Awaiting Settlement",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Processing clearance from clearinghouse."
      }
    ]
  },
  {
    "id": "TRX-2026-00078",
    "shortId": "00078",
    "userId": "usr_1002",
    "userName": "Lucas Martin",
    "userEmail": "lucas.m@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+1 212 555 0148",
    "userLocation": "New York, USA",
    "amount": 99,
    "usdAmount": 99,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Stripe",
    "paymentMethodType": "Stripe",
    "date": "2026-10-10T11:00:00Z",
    "formattedDate": "Oct 10, 2026 · 11:00 AM",
    "status": "Pending",
    "plan": "Premium",
    "description": "Global Visa Placement Guarantee Tier",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00078_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Checkout initialized for Global Visa Placement Guarantee Tier via Stripe."
      },
      {
        "id": "act_TRX-2026-00078_2",
        "title": "Awaiting Settlement",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Processing clearance from clearinghouse."
      }
    ]
  },
  {
    "id": "TRX-2026-00077",
    "shortId": "00077",
    "userId": "usr_9182",
    "userName": "Sofia Rossi",
    "userEmail": "sofia.r@company.it",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+39 06 1234567",
    "userLocation": "Rome, Italy",
    "amount": 49,
    "usdAmount": 49,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Razorpay",
    "paymentMethodType": "Razorpay",
    "date": "2026-10-10T11:00:00Z",
    "formattedDate": "Oct 10, 2026 · 11:00 AM",
    "status": "Pending",
    "plan": "Basic",
    "description": "Basic Career Discovery Membership",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00077_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Checkout initialized for Basic Career Discovery Membership via Razorpay."
      },
      {
        "id": "act_TRX-2026-00077_2",
        "title": "Awaiting Settlement",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Processing clearance from clearinghouse."
      }
    ]
  },
  {
    "id": "TRX-2026-00076",
    "shortId": "00076",
    "userId": "usr_5210",
    "userName": "Liam O'Connor",
    "userEmail": "liam.o@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+353 1 234 5678",
    "userLocation": "Dublin, Ireland",
    "amount": 149,
    "usdAmount": 149,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-10-10T11:00:00Z",
    "formattedDate": "Oct 10, 2026 · 11:00 AM",
    "status": "Pending",
    "plan": "Executive",
    "description": "International Visa Filing Expediter",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00076_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Checkout initialized for International Visa Filing Expediter via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00076_2",
        "title": "Awaiting Settlement",
        "timestamp": "Oct 10, 2026 · 11:00 AM",
        "description": "Processing clearance from clearinghouse."
      }
    ]
  },
  {
    "id": "TRX-2026-00075",
    "shortId": "00075",
    "userId": "usr_9401",
    "userName": "Elena Petrova",
    "userEmail": "elena.p@company.ru",
    "userAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+49 30 123456",
    "userLocation": "Berlin, Germany",
    "amount": 149,
    "usdAmount": 149,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "JCB •••• 6677",
    "paymentMethodType": "JCB",
    "date": "2026-10-08T16:30:00Z",
    "formattedDate": "Oct 08, 2026 · 4:30 PM",
    "status": "Failed",
    "failureReason": "card_declined: Insufficient funds in checking account",
    "plan": "Premium",
    "description": "Premium Placement Concierge (Monthly)",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00075_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "Checkout initialized for Premium Placement Concierge (Monthly) via JCB •••• 6677."
      },
      {
        "id": "act_TRX-2026-00075_2",
        "title": "Payment Declined",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "card_declined: Insufficient funds in checking account"
      }
    ]
  },
  {
    "id": "TRX-2026-00074",
    "shortId": "00074",
    "userId": "usr_1002",
    "userName": "Lucas Martin",
    "userEmail": "lucas.m@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+1 212 555 0148",
    "userLocation": "New York, USA",
    "amount": 79,
    "usdAmount": 79,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Stripe",
    "paymentMethodType": "Stripe",
    "date": "2026-10-08T16:30:00Z",
    "formattedDate": "Oct 08, 2026 · 4:30 PM",
    "status": "Failed",
    "failureReason": "do_not_honor: Exceeded international transaction limit",
    "plan": "Basic",
    "description": "Executive Career Sponsorship Track",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00074_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "Checkout initialized for Executive Career Sponsorship Track via Stripe."
      },
      {
        "id": "act_TRX-2026-00074_2",
        "title": "Payment Declined",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "do_not_honor: Exceeded international transaction limit"
      }
    ]
  },
  {
    "id": "TRX-2026-00073",
    "shortId": "00073",
    "userId": "usr_9182",
    "userName": "Sofia Rossi",
    "userEmail": "sofia.r@company.it",
    "userAvatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+39 06 1234567",
    "userLocation": "Rome, Italy",
    "amount": 299,
    "usdAmount": 299,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Razorpay",
    "paymentMethodType": "Razorpay",
    "date": "2026-10-08T16:30:00Z",
    "formattedDate": "Oct 08, 2026 · 4:30 PM",
    "status": "Failed",
    "failureReason": "expired_card: Card expiry date preceded billing cycle",
    "plan": "Executive",
    "description": "AI Mock Interview & Assessment Engine",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00073_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "Checkout initialized for AI Mock Interview & Assessment Engine via Razorpay."
      },
      {
        "id": "act_TRX-2026-00073_2",
        "title": "Payment Declined",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "expired_card: Card expiry date preceded billing cycle"
      }
    ]
  },
  {
    "id": "TRX-2026-00072",
    "shortId": "00072",
    "userId": "usr_5210",
    "userName": "Liam O'Connor",
    "userEmail": "liam.o@domain.com",
    "userAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+353 1 234 5678",
    "userLocation": "Dublin, Ireland",
    "amount": 49,
    "usdAmount": 49,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Visa •••• 9812",
    "paymentMethodType": "Visa",
    "date": "2026-10-08T16:30:00Z",
    "formattedDate": "Oct 08, 2026 · 4:30 PM",
    "status": "Failed",
    "failureReason": "payment_intent_authentication_failure: 3DS biometric challenge timed out",
    "plan": "Concierge",
    "description": "ATS Resume Optimization & Global Tailoring",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00072_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "Checkout initialized for ATS Resume Optimization & Global Tailoring via Visa •••• 9812."
      },
      {
        "id": "act_TRX-2026-00072_2",
        "title": "Payment Declined",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "payment_intent_authentication_failure: 3DS biometric challenge timed out"
      }
    ]
  },
  {
    "id": "TRX-2026-00071",
    "shortId": "00071",
    "userId": "usr_1822",
    "userName": "Priya Mehta",
    "userEmail": "priya.m@outlook.in",
    "userAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "userPhone": "+91 98111 22334",
    "userLocation": "Mumbai, India",
    "amount": 199,
    "usdAmount": 199,
    "currency": "USD",
    "currencySymbol": "$",
    "paymentMethod": "Mastercard •••• 4418",
    "paymentMethodType": "Mastercard",
    "date": "2026-10-08T16:30:00Z",
    "formattedDate": "Oct 08, 2026 · 4:30 PM",
    "status": "Failed",
    "failureReason": "risk_blocked: Automated fraud velocity rule triggered",
    "plan": "Premium",
    "description": "Global Visa Placement Guarantee Tier",
    "invoiceNumber": null,
    "activities": [
      {
        "id": "act_TRX-2026-00071_1",
        "title": "Transaction Initiated",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "Checkout initialized for Global Visa Placement Guarantee Tier via Mastercard •••• 4418."
      },
      {
        "id": "act_TRX-2026-00071_2",
        "title": "Payment Declined",
        "timestamp": "Oct 08, 2026 · 4:30 PM",
        "description": "risk_blocked: Automated fraud velocity rule triggered"
      }
    ]
  }
];
