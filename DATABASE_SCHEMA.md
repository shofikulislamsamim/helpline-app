# HelpLine Database Architecture & Schema Foundation

HelpLine is a Bengali-first, all-in-one local marketplace platform for Bangladesh.
This document outlines the Firestore collections, schema blueprints, and access rules.

## Core Principles
1. **Single User Account, Multiple Capabilities**: A single user (`users` / `userProfiles`) holds unified identity, authentication, ratings, present address, and multiple role permissions (Hire, Work, Jobs, Ride, Delivery, Buy/Sell).
2. **Admin-Controlled Architecture**: Business values (rates, hotline, payment numbers, free/paid mode) are dynamically retrieved from the `appSettings` collection.
3. **Manual Payments First**: Subscriptions initially support manual mobile financial services (bKash, Nagad, Rocket) with admin verification.
4. **Hierarchical Location Model**: Ready for Bangladesh administrative hierarchy: `Division > District > Upazila/Thana > Union/Ward > Village/Area`.

---

## Firestore Collections Blueprint

### 1. `users`
- **Purpose**: System identity and Firebase Auth linkage.
- **Fields**:
  - `uid`: string (Document ID matches Firebase Auth UID)
  - `email`: string | null
  - `phoneNumber`: string | null
  - `createdAt`: timestamp
  - `updatedAt`: timestamp
  - `lastLoginAt`: timestamp
  - `isActive`: boolean

### 2. `userProfiles`
- **Purpose**: Unified user profile across all marketplace services.
- **Fields**:
  - `userId`: string
  - `fullName`: string
  - `avatarUrl`: string | null
  - `bio`: string
  - `phoneNumber`: string
  - `email`: string
  - `isOnline`: boolean ("আমি এখন কাজের জন্য Available" / "আমি এখন কাজের জন্য Available নই")
  - `verificationStatus`: "unverified" | "pending" | "verified" | "rejected"
  - `roles`: string[] (e.g. `["customer", "worker", "driver", "employer", "seller", "delivery_agent"]`)
  - `professions`: string[] (e.g. `["electrician", "plumber"]`)
  - `skills`: string[] (e.g. `["wiring", "switchboard", "motor_repair"]`)
  - `presentAddress`:
    - `division`: string (e.g. "ঢাকা")
    - `district`: string (e.g. "ঢাকা")
    - `upazila`: string (e.g. "মিরপুর")
    - `unionWard`: string (e.g. "ওয়ার্ড নং ১০")
    - `areaRoad`: string (e.g. "রোড ৫, ব্লক সি")
  - `currentLocation`:
    - `latitude`: number | null
    - `longitude`: number | null
    - `lastUpdated`: timestamp | null
    - `shareLiveLocation`: boolean
  - `rating`: number (0.0 to 5.0)
  - `reviewCount`: number
  - `completedJobsCount`: number
  - `joinedDate`: timestamp
  - `subscription`:
    - `plan`: "free" | "daily" | "monthly" | "yearly"
    - `expiresAt`: timestamp | null
    - `isActive`: boolean

### 3. `appSettings`
- **Purpose**: Dynamic settings controlled by Admin Panel without developer intervention.
- **Document**: `appSettings/global`
- **Fields**:
  - `subscriptionMode`: "free" | "paid"
  - `dailyRate`: number (BDT)
  - `monthlyRate`: number (BDT)
  - `yearlyRate`: number (BDT)
  - `paymentNumbers`:
    - `bkash`: string
    - `nagad`: string
    - `rocket`: string
  - `hotlineNumber`: string (e.g. "09612-435777")
  - `supportEmail`: string
  - `supportWhatsApp`: string
  - `emergencyNotice`: string
  - `searchRadiusKm`: number
  - `featureFlags`:
    - `hireModule`: boolean
    - `workModule`: boolean
    - `jobsModule`: boolean
    - `rideModule`: boolean
    - `deliveryModule`: boolean
    - `buySellModule`: boolean
  - `updatedAt`: timestamp
  - `updatedBy`: string

### 4. `policies`
- **Purpose**: Legal terms and community safety texts.
- **Documents**: `terms`, `privacy`, `safety`, `communityGuidelines`, `prohibitedItems`
- **Fields**:
  - `title`: string
  - `content`: string (Bengali Markdown)
  - `version`: string
  - `lastUpdated`: timestamp

### 5. `categories`
- **Purpose**: Dynamic taxonomy for trades, jobs, and products.
- **Fields**:
  - `id`: string
  - `nameBn`: string
  - `nameEn`: string
  - `icon`: string
  - `moduleType`: "hire" | "work" | "jobs" | "buysell"
  - `order`: number
  - `isActive`: boolean

### 6. `professions` & 7. `skills`
- **Purpose**: Vocational registry for Bangladesh trades and technical crafts.

### 8. `addresses`
- **Purpose**: Master table of Bangladesh administrative divisions, districts, and thanas.

### 9. `verificationRequests`
- **Purpose**: Submissions for NID, driving license, or trade certifications for verification badges.
- **Fields**: `userId`, `idType`, `idNumber`, `frontPhotoUrl`, `backPhotoUrl`, `status`, `submittedAt`, `reviewedBy`, `rejectionReason`.

### 10. `serviceRequests` (Hire Module)
- **Purpose**: Customer job requests seeking local technicians and laborers.

### 11. `jobs` (Jobs Module)
- **Purpose**: Employment and gig opportunities posted by local businesses or individuals.

### 12. `rides` (Ride Module)
- **Purpose**: Ride-sharing requests (Bike, CNG, Car) across local routes.

### 13. `deliveries` (Send / Delivery Module)
- **Purpose**: Local parcel, document, and courier dispatch requests.

### 14. `productListings` (Buy & Sell Module)
- **Purpose**: Local marketplace classifieds (electronics, furniture, vehicles, tools, etc.).

### 15. `conversations` & 16. `messages`
- **Purpose**: Direct buyer-seller / employer-worker communication channels.

### 17. `reviews`
- **Purpose**: Star ratings, transaction feedbacks, and worker reputational scores.

### 18. `complaints`
- **Purpose**: User incident reports, dispute tickets, and safety alerts.

### 19. `subscriptions`
- **Purpose**: User plan history, validity periods, and entitlement logs.

### 20. `paymentRequests`
- **Purpose**: Manual payment proof submissions (MFS: bKash/Nagad/Rocket) awaiting admin approval.
- **Fields**: `userId`, `method`, `senderPhone`, `trxId`, `amount`, `purpose`, `status`, `createdAt`, `reviewedAt`, `adminNote`.

### 21. `notifications`
- **Purpose**: User alerts for messages, service responses, payment approvals, and platform notices.

### 22. `adminUsers`
- **Purpose**: Role-based access control list for HelpLine platform managers and operators.
