# Z COOL ENTERPRISES — PRODUCT DATA & IMAGE RECONCILIATION AUDIT
**Document Type:** Formal Forensic Data Reconciliation Report  
**Date:** October 18, 2026  
**Auditor:** Senior Full-Stack Engineer, B2B Industrial Data Auditor, & Security Reviewer  
**Audit Status:** AUDIT COMPLETE — AWAITING CLIENT APPROVAL BEFORE IMPLEMENTATION  
**Primary Scope:** Complete forensic audit and reconciliation between the local Next.js `/products` catalogue (6 products) and the client's legacy live webpage `https://www.zcoolenterprises.co.in/ac-compressor.html` (~40 products).

---

## 1. Executive Summary & Audit Mandate

### 1.1 Dual-Source Principle of Non-Presumption
In accordance with strict technical auditing standards, **neither source is treated as an automatic source of truth**:
1. **Source A (Current Local Repository / Next.js Web Application):** Displays a 6-product catalog on `/products` powered by hardcoded static objects in `src/data/products.js`. While richly formatted with detailed engineering specifications, operating pressures, and RLA/LRA ratings, forensic analysis reveals that **these specifications and product images were drafted during initial prototyping and do not represent physically verified inventory or original photographic assets.**
2. **Source B (Client's Legacy Webpage `/ac-compressor.html`):** Displays approximately 40 titled product entries with individual images (`img/compressor1.webp` through `img/compressor40.webp`). While this reflects historical customer-facing listings, the text consists of generic boilerplate copied across all 40 cards (*"We provide high-quality engineering and infrastructure solutions... services tailored to meet your project needs"*). **Legacy titles cannot be assumed to represent active physical stock, verified model compatibility, or authentic technical specifications without explicit client confirmation.**

### 1.2 Summary of Critical Findings
- **Severe Asset Duplication on Current Grid:** The 6-product catalog relies on only **three image files** in `/public`: `/ac_compressor.png`, `/ac_compressor_2.png`, and `/ac_compressor_3.png`. Every product card is paired with another card sharing the exact same primary image:
  - **Cards 1 & 4 share `/ac_compressor.png`:** A Copeland Scroll cutout is visually displayed for a Danfoss Maneurop Reciprocating compressor.
  - **Cards 2 & 6 share `/ac_compressor_2.png`:** A Daikin fixed-speed scroll image is reused for a Daikin VRV DC Inverter scroll unit.
  - **Cards 3 & 5 share `/ac_compressor_3.png`:** A cylindrical canister image is visually displayed for a 145 kg Copeland Semi-Hermetic Discus cast-iron block.
- **Physical Category Mismatches:** Two of the six current products (Danfoss MTZ64 and Copeland Discus 3DS3R17ME) present severe visual contradictions where scroll-compressor silhouettes are displayed for reciprocating and heavy semi-hermetic industrial machines.
- **Legacy Product Scope Mismatch:** The client's legacy site contains 40 distinct compressor listings covering commercial split, multi-brand rotary, VRV, and industrial refrigeration units. Some models (such as Daikin JT160 on Item 10, Copeland ZR/ZB series, and Daikin JT300D) have strong naming counterparts, but others (such as LG HQ034P and Copeland Discus 3DS3R17ME) have zero mention in the legacy AC catalog.
- **Rule of No Automatic Model Inferencing:** We explicitly do NOT conflate `JT300` with `JT300d`, nor `MTZ64` with `MT72`, nor `ZR72KC` with `ZPD72`. Suffix letters in compressor engineering designate fundamental differences in displacement, motor voltage, inverter electronics, and oil compatibility.

---

## 2. Cryptographic Forensic Analysis of Repository Media Assets

To verify asset reuse with mathematical certainty, cryptographic SHA-256 hashes were computed for all media assets residing in `/public`:

### 2.1 Cryptographic Hash Verification Table

| Asset Path | File Size | MIME Type | SHA-256 Cryptographic Hash | Visual Content Description | Usage in Current Product Grid |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/public/ac_compressor.png` | 173,652 bytes (169.6 KB) | `image/png` | `47c4b2c76494ac1dacff0956cce2e1d163be272e41a1790657e2bb38f915b410` | Isolated cutout of a black hermetic scroll compressor. Vertical cylinder, welded end-caps, round 4-hole mounting foot, side suction stub, top discharge pipe, black square terminal box on body. Typical Copeland ZR-series scroll exterior. | **Card 1 (Primary)**: Copeland Scroll ZR72KC-TFD<br>**Card 4 (Primary)**: Danfoss Maneurop Reciprocating MTZ64 *(CRITICAL VISUAL MISMATCH)*<br>Also secondary gallery in Cards 2, 3, 6. |
| `/public/ac_compressor_2.png` | 278,378 bytes (271.9 KB) | `image/png` | `85d24e34d1fa608742cc68e1a91697a1b09d709daaec394d346df2d04b352625` | Isolated cutout of a tall black hermetic compressor. Smooth dome top, upper discharge tube, lower side suction, Daikin-style dual bracket mounting feet. Typical Daikin commercial scroll profile. | **Card 2 (Primary)**: Daikin Scroll JT160G-P8Y1<br>**Card 6 (Primary)**: Daikin Inverter Scroll JT300 *(REUSED ASSET)*<br>Also secondary gallery in Cards 1, 5. |
| `/public/ac_compressor_3.png` | 466,671 bytes (455.7 KB) | `image/png` | `1f60146fd2f2a4f6c74f7461d4056c5c9ffaa7930c792ffd275f43f21fc3071f` | Isolated cutout of a black hermetic canister compressor. Compact cylindrical body with side suction and terminal casing. | **Card 3 (Primary)**: LG Commercial Rotary HQ034P<br>**Card 5 (Primary)**: Copeland Semi-Hermetic 3DS3R17ME *(CRITICAL VISUAL MISMATCH)*<br>Also secondary gallery in Cards 1, 2, 4. |
| `/public/compressor_showcase.mp4` | 1,943,069 bytes (1.85 MB) | `video/mp4` | `c0a0426404afd7ef44b20f81be4d5797be8487724b42659bc739f00ff797e273` | Industrial equipment showcase video. | **Dead asset:** Completely unreferenced across all application code. |
| `/public/logo1.png` | 625,496 bytes (610.8 KB) | `image/png` | `63135c1cef65faeb90884d9c5cdaf4326278398f38385883105f5be0b6365101` | High-res company logo mark. | Primary navigation logo. |
| `/public/favicon.ico` | 625,496 bytes (610.8 KB) | `image/x-icon` | `63135c1cef65faeb90884d9c5cdaf4326278398f38385883105f5be0b6365101` | *Identical byte stream to logo1.png.* | Favicon icon. |
| `/public/favicon-16x16.png` | 625,496 bytes (610.8 KB) | `image/png` | `63135c1cef65faeb90884d9c5cdaf4326278398f38385883105f5be0b6365101` | *Identical byte stream to logo1.png.* | 16x16 icon tag (610 KB bloated payload). |
| `/public/favicon-32x32.png` | 625,496 bytes (610.8 KB) | `image/png` | `63135c1cef65faeb90884d9c5cdaf4326278398f38385883105f5be0b6365101` | *Identical byte stream to logo1.png.* | 32x32 icon tag (610 KB bloated payload). |
| `/public/favicon-48x48.png` | 625,496 bytes (610.8 KB) | `image/png` | `63135c1cef65faeb90884d9c5cdaf4326278398f38385883105f5be0b6365101` | *Identical byte stream to logo1.png.* | 48x48 icon tag (610 KB bloated payload). |
| `/public/apple-touch-icon.png` | 625,496 bytes (610.8 KB) | `image/png` | `63135c1cef65faeb90884d9c5cdaf4326278398f38385883105f5be0b6365101` | *Identical byte stream to logo1.png.* | Apple touch icon (610 KB bloated payload). |
| `/public/android-chrome-512x512.png` | 625,496 bytes (610.8 KB) | `image/png` | `63135c1cef65faeb90884d9c5cdaf4326278398f38385883105f5be0b6365101` | *Identical byte stream to logo1.png.* | PWA icon tag. |

### 2.2 Forensic Analysis of Repeated Image Pairs on `/products`

```
CURRENT 6-PRODUCT CATALOG GRID
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│ CARD 1: Copeland Scroll ZR72KC-TFD    │   │ CARD 4: Danfoss Maneurop Recip MTZ64  │
│ Image: /ac_compressor.png             │◄─►│ Image: /ac_compressor.png             │
│ Hash: 47c4b2c7... (Copeland Silhouette)│   │ Hash: 47c4b2c7... (FATAL MISMATCH!)   │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│ CARD 2: Daikin Scroll JT160G-P8Y1     │   │ CARD 6: Daikin Inverter Scroll JT300  │
│ Image: /ac_compressor_2.png           │◄─►│ Image: /ac_compressor_2.png           │
│ Hash: 85d24e34... (Daikin Silhouette) │   │ Hash: 85d24e34... (REUSED ASSET)      │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│ CARD 3: LG Rotary HQ034P              │   │ CARD 5: Copeland Semi-Hermetic 3DS3R  │
│ Image: /ac_compressor_3.png           │◄─►│ Image: /ac_compressor_3.png           │
│ Hash: 1f60146fd... (Canister Profile) │   │ Hash: 1f60146fd... (FATAL MISMATCH!)   │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
```

1. **Card 1 & Card 4 Collision (`/ac_compressor.png`):**
   - **Card 1:** Represents a Copeland Scroll compressor. The image silhouette matches the physical form factor of an Emerson Copeland scroll compressor.
   - **Card 4:** Represents a Danfoss Maneurop Reciprocating compressor. A Maneurop MTZ series unit is a reciprocating compressor characterized by a rounded blue or black casing, rotolock suction/discharge threaded fittings, an oil sight glass, and an oil equalization port. Displaying an isolated Copeland scroll image for a Danfoss Maneurop reciprocating compressor is a severe technical error that would immediately undermine credibility with industrial HVAC procurement managers.
2. **Card 2 & Card 6 Collision (`/ac_compressor_2.png`):**
   - **Card 2:** Represents a Daikin fixed-speed scroll compressor (`JT160G-P8Y1`).
   - **Card 6:** Represents a Daikin Inverter scroll compressor (`JT300`) for VRV IV systems.
   - Inverter scroll compressors have dedicated inverter terminal connections, distinct oil balance lines, and specific wiring harness housings. Displaying identical imagery represents an unverified mockup placeholder rather than authentic product documentation.
3. **Card 3 & Card 5 Collision (`/ac_compressor_3.png`):**
   - **Card 3:** Represents an LG Commercial Rotary compressor (`HQ034P`). Genuine rotary compressors require an external suction accumulator cylinder mounted beside the main compression shell.
   - **Card 5:** Represents a Copeland Discus Semi-Hermetic compressor (`3DS3R17ME`). A Discus semi-hermetic compressor is a massive (145 kg / 320 lb) cast-iron reciprocating machine with bolted cylinder heads, an oil pump housing, access end-covers, and service shutoff valves. Displaying a smooth cylindrical hermetic canister for an industrial Discus semi-hermetic compressor is a critical visual mismatch.

---

## 3. Individual Reconciliation Records for the 6 Current Products

### Record 1: Copeland Scroll Compressor ZR72KC-TFD

| Attribute | Forensic Findings & Audit Data |
| :--- | :--- |
| **Display Name & Model Ref** | **Copeland Scroll Compressor ZR72KC-TFD**<br>Model Code: `ZR72KC-TFD` \| Catalog Code: `Z-COP-ZR72` \| Slug/ID: `copeland-zr72kc-tFD` |
| **Current Data-File Location** | `src/data/products.js` (lines 4–52)<br>Referenced in: `src/data/brands.js` (line 7), `src/data/articles.js` (lines 20, 116), `src/data/case-studies.js` (lines 9–10), `src/components/ui/QuoteModal.jsx` (line 186), `src/components/contact/ContactForm.jsx` (line 350), `sync-catalog.js` (lines 96–97, 153). |
| **Current Image Path** | Primary: `/ac_compressor.png`<br>Gallery: `/ac_compressor_2.png`, `/ac_compressor_3.png` |
| **Visual Image Assessment** | Isolated stock cutout of a black cylindrical scroll compressor with welded top/bottom shells, 4-bolt base, side suction, top discharge, and square electrical box. Consistent with Copeland ZR-series scroll exterior form factor, but nameplate is unreadable and physical origin is unverified. |
| **Reused Image Assessment** | **Identical image reused.** Exactly identical to Card 4 (Danfoss MTZ64) primary image (SHA-256 `47c4b2c7...`). Secondary images cycle through the only other two assets in the repository. |
| **Closest Legacy Match** | **Legacy Item 14:** `ZPD72 EMERSON SCROLL COMPRESSOR` (`img/compressor14.webp`)<br>*Also related general family:* Legacy Item 11 (`Zr125 Scroll Compressor`), Item 12 (`Zr190 Emerson Copeland`), Item 15 (`Zr190kce Copeland Scroll Compressor`). |
| **Evidence Supporting Match** | Both `ZR72` and `ZPD72` are 72,000 BTU/h (6-Ton) Copeland scroll compressors. However, `ZPD72` is a Digital Scroll variant featuring top modulation solenoid unloader for variable capacity, whereas `ZR72KC-TFD` is a standard fixed-speed commercial scroll compressor. |
| **Missing Information** | 1. Confirmation whether physical stock is `ZR72KC-TFD`, `ZPD72`, or both.<br>2. Exact electrical bill of materials suffix (e.g. `ZR72KC-TFD-522` vs `ZR72KC-TFD-250`).<br>3. High-resolution photograph of the actual physical unit showing the stamped Emerson/Copeland nameplate.<br>4. Verified refurbishment condition, pressure test records, and warranty terms. |
| **Verification Status** | **POSSIBLE MATCH / NEEDS CLIENT CONFIRMATION** |

---

### Record 2: Daikin Scroll Compressor JT160G-P8Y1

| Attribute | Forensic Findings & Audit Data |
| :--- | :--- |
| **Display Name & Model Ref** | **Daikin Scroll Compressor JT160G-P8Y1**<br>Model Code: `JT160G-P8Y1` \| Catalog Code: `Z-DAI-JT160` \| Slug/ID: `daikin-jt160g-p8y1` |
| **Current Data-File Location** | `src/data/products.js` (lines 54–97)<br>Referenced in: `src/data/articles.js` (line 116), `src/components/contact/ContactForm.jsx` (line 350), `src/components/home/ProductDiscoveryRange.jsx` (line 19), `sync-catalog.js` (lines 113, 166). |
| **Current Image Path** | Primary: `/ac_compressor_2.png`<br>Gallery: `/ac_compressor.png`, `/ac_compressor_3.png` |
| **Visual Image Assessment** | Isolated stock cutout of a tall black cylindrical compressor with Daikin-style curved dome top, top discharge stub, and Daikin mounting brackets. Visually representative of a Daikin scroll silhouette, but lack of readable nameplate makes exact model verification impossible. |
| **Reused Image Assessment** | **Identical image reused.** Exactly identical to Card 6 (Daikin JT300) primary image (SHA-256 `85d24e34...`). |
| **Closest Legacy Match** | **Legacy Item 10:** `Daikin Refrigeration Compressors` (`img/compressor10.webp`)<br>*Also related:* Legacy Item 19 (`Daikin JT125 SCROLL COMPRESSOR`), Item 7 (`Daikin Air Conditioner Compressor`). |
| **Evidence Supporting Match** | In the client's legacy page, the photograph for Item 10 (`img/compressor10.webp`) is an **authentic workshop photograph of a physical Daikin compressor whose stamped silver nameplate clearly reads `JT160...`**. This confirms that Z Cool Enterprises has historically handled physical Daikin JT160 inventory. |
| **Missing Information** | 1. Confirmation of exact full suffix: `JT160G-P8Y1` (R410A) vs `JT160BCBY1L` (R22) vs `JT160G-P8T`.<br>2. Confirmation whether the unit photographed in legacy Item 10 is currently available in stock or previously sold.<br>3. Original high-resolution nameplate photograph for web publication.<br>4. Physical electrical test certifications. |
| **Verification Status** | **POSSIBLE MATCH / NEEDS CLIENT CONFIRMATION** |

---

### Record 3: LG Commercial Rotary Compressor HQ034P

| Attribute | Forensic Findings & Audit Data |
| :--- | :--- |
| **Display Name & Model Ref** | **LG Commercial Rotary Compressor HQ034P**<br>Model Code: `HQ034P` \| Catalog Code: `Z-LG-HQ034` \| Slug/ID: `lg-hq034p-rotary` |
| **Current Data-File Location** | `src/data/products.js` (lines 99–140)<br>Referenced in: `src/components/applications/ApplicationsInteractiveView.jsx` (lines 75, 120). |
| **Current Image Path** | Primary: `/ac_compressor_3.png`<br>Gallery: `/ac_compressor.png` |
| **Visual Image Assessment** | Isolated stock cutout of a black hermetic canister. Crucially, the image does **not** show the prominent external suction accumulator cylinder that is mandatory on all commercial rotary compressors (including LG HQ series). |
| **Reused Image Assessment** | **Identical image reused.** Exactly identical to Card 5 (Copeland Discus 3DS3R) primary image (SHA-256 `1f60146fd...`). |
| **Closest Legacy Match** | **Legacy Item 8:** `Rotary Compressor GMCC HIGHLY PANASONIC LG SAMSUNG` (`img/compressor8.webp`)<br>**Legacy Item 23:** `LG Air Conditioner Compressor` (`img/compressor23.webp`). |
| **Evidence Supporting Match** | The client's legacy page includes generic titles mentioning "LG" and multi-brand rotary compressors. However, **model `HQ034P` is nowhere mentioned, stamped, or referenced in the legacy catalog**. |
| **Missing Information** | 1. Does Z Cool Enterprises physically inventory or supply model `HQ034P`?<br>2. Physical photograph of actual unit with suction accumulator and legible LG nameplate.<br>3. Technical specification verification: single-phase 220V vs 3-phase, displacement (34 cc/rev), and approved refrigerants (R32 / R410A). |
| **Verification Status** | **MISMATCH SUSPECTED / NOT VERIFIED** |

---

### Record 4: Danfoss Maneurop Reciprocating Compressor MTZ64

| Attribute | Forensic Findings & Audit Data |
| :--- | :--- |
| **Display Name & Model Ref** | **Danfoss Maneurop Reciprocating Compressor MTZ64**<br>Model Code: `MTZ64` (specs note `MTZ64-4VI`) \| Catalog Code: `Z-DAN-MTZ64` \| Slug/ID: `danfoss-maneurop-mtz64` |
| **Current Data-File Location** | `src/data/products.js` (lines 142–183)<br>Referenced in: `src/data/articles.js` (line 116), `src/app/contact/page.jsx` (line 33), `src/components/applications/ApplicationsInteractiveView.jsx` (lines 105, 120). |
| **Current Image Path** | Primary: `/ac_compressor.png`<br>Gallery: `/ac_compressor_3.png` |
| **Visual Image Assessment** | **Fatal Visual Contradiction:** Displays an isolated Copeland Scroll compressor. A genuine Danfoss Maneurop MTZ64 is a round, stout reciprocating compressor with threaded rotolock suction/discharge valves, an oil sight glass, and an oil equalization port. |
| **Reused Image Assessment** | **Identical image reused.** Exactly identical to Card 1 (Copeland Scroll ZR72) primary image (SHA-256 `47c4b2c7...`). |
| **Closest Legacy Match** | **Legacy Item 39:** `MT72 DANFOSS COMPRESSOR` (`img/compressor39.webp`)<br>*Also related:* Legacy Item 16 (`Danfoss Sm185s4rc Scroll Compressor`), Item 33 (`Bluestar danfoss AC compressor`). |
| **Evidence Supporting Match** | The Maneurop round reciprocating series is confirmed on the client's legacy catalog under `MT72 DANFOSS COMPRESSOR`. However:
- `MT72` is factory-charged with mineral oil (160P) for R22 refrigerant (72,000 BTU/h class).
- `MTZ64` is factory-charged with POE oil (160PZ) for R404A/R134a/R407C refrigerants (64,000 BTU/h class). |
| **Missing Information** | 1. Confirmation whether active stock is `MT72`, `MTZ64`, or both.<br>2. Authentic photograph of the Danfoss Maneurop unit showing the round body, rotolock valves, and nameplate.<br>3. Factory oil charge confirmation (Mineral 160P vs POE 160PZ). |
| **Verification Status** | **VISUAL MISMATCH SUSPECTED / MODEL NEEDS VERIFICATION** |

---

### Record 5: Copeland Semi-Hermetic Compressor 3DS3R17ME

| Attribute | Forensic Findings & Audit Data |
| :--- | :--- |
| **Display Name & Model Ref** | **Copeland Semi-Hermetic Compressor 3DS3R17ME**<br>Model Code: `3DS3R17ME` \| Catalog Code: `Z-COP-DISCUS` \| Slug/ID: `copeland-discus-semihermetic` |
| **Current Data-File Location** | `src/data/products.js` (lines 185–226)<br>Referenced in: `src/data/brands.js` (line 7). |
| **Current Image Path** | Primary: `/ac_compressor_3.png`<br>Gallery: `/ac_compressor_2.png` |
| **Visual Image Assessment** | **Fatal Visual Contradiction:** Displays an isolated smooth cylindrical hermetic canister. A Copeland Discus 3DS3 semi-hermetic compressor is a massive (145 kg / 320 lb) cast-iron multi-cylinder machine with bolted cylinder heads, an oil pump housing, access end-covers, and service shutoff valves. |
| **Reused Image Assessment** | **Identical image reused.** Exactly identical to Card 3 (LG Rotary HQ034) primary image (SHA-256 `1f60146fd...`). |
| **Closest Legacy Match** | **NO DIRECT MATCH IN LEGACY CATALOG.**<br>Legacy category page contains Copeland scroll units (Items 11, 12, 13, 14, 15, 20, 37) and small hermetic reciprocating units (Item 36: `KCN 463`), but **zero semi-hermetic Discus compressors**. |
| **Evidence Supporting Match** | None on legacy `/ac-compressor.html`. The client may trade semi-hermetic compressors through direct offline B2B channels or cold-storage contracts, but there is zero legacy web documentation. |
| **Missing Information** | 1. Does Z Cool Enterprises physically overhaul, stock, or broker Copeland Discus semi-hermetic compressors?<br>2. Authentic photograph of a genuine semi-hermetic cast-iron unit in workshop or warehouse.<br>3. Verification of 17 HP motor specifications, displacement (50 m³/h), and electrical characteristics. |
| **Verification Status** | **VISUAL MISMATCH SUSPECTED / NOT IN LEGACY LIST** |

---

### Record 6: Daikin Inverter Scroll Compressor JT300

| Attribute | Forensic Findings & Audit Data |
| :--- | :--- |
| **Display Name & Model Ref** | **Daikin Inverter Scroll Compressor JT300**<br>Model Code: `JT300` (code in data: `Z-[#DAI-VRV300]`) \| Catalog Code: `Z-[#DAI-VRV300]` \| Slug/ID: `daikin-vrv-inverter-jt300` |
| **Current Data-File Location** | `src/data/products.js` (lines 228–265) |
| **Current Image Path** | Primary: `/ac_compressor_2.png`<br>Gallery: `/ac_compressor.png` |
| **Visual Image Assessment** | Isolated stock cutout of a Daikin scroll compressor. Lacks distinct inverter drive connection housing and dedicated electronics terminals. |
| **Reused Image Assessment** | **Identical image reused.** Exactly identical to Card 2 (Daikin JT160) primary image (SHA-256 `85d24e34...`). |
| **Closest Legacy Match** | **Legacy Item 18:** `DAIKIN Jt300d SCROLL COMPRESSOR` (`img/compressor18.webp`). |
| **Evidence Supporting Match** | The client's legacy catalog specifically features `DAIKIN Jt300d SCROLL COMPRESSOR`. |
| **Critical Audit Warning & Missing Information** | **Strict Audit Rule:** *Do not automatically match JT300 to JT300d or infer model compatibility from similar names.*<br>1. In Daikin engineering nomenclature, `JT300D` designates a specific 10 HP scroll model series with designated motor windings and terminal layout. Suffixes (such as `-P8Y1`, `-YE`, or `-T`) dictate whether it is standard induction or DC inverter brushless.<br>2. Current catalog asserts this is a "DC Inverter Scroll" for "Daikin VRV IV / VRV V Outdoor Units" with variable frequency 30Hz–120Hz control. This claim must be verified against the physical unit's nameplate.<br>3. In the repository code, the model code is awkwardly formatted as `Z-[#DAI-VRV300]` (containing literal bracket symbols).<br>4. High-resolution photograph of the actual physical unit and stamped electrical rating plate required. |
| **Verification Status** | **POSSIBLE MATCH / NEEDS CLIENT VERIFICATION** |

---

## 4. Complete Extraction of All 40 Legacy Products (`/ac-compressor.html`)

Below is the complete extraction of all 40 product entries from the client's legacy webpage.  
**Audit Note:** *These titles represent historical customer-facing entries from the legacy website. They are NOT treated as verified physical stock, current availability, or authentic engineering specifications.*

| Item # | Legacy Product Title | Legacy Image Asset | Visual Assessment of Legacy Image | Brand / Model Inferred | Audit Classification & Technical Remarks |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | `1ton Split Ac Compressor` | `img/compressor1.webp` | Workshop photo: two black rotary compressors standing on a wooden bench. | Generic 1-Ton Rotary | Light commercial / domestic split AC compressor. Generic entry. |
| **2** | `LG VRV Air Conditioner Compressor` | `img/compressor2.webp` | Workshop photo: top-down angle of black cylindrical compressor on cardboard floor. | LG (VRV / Multi-V) | Commercial VRF compressor. No specific model code given. |
| **3** | `Ductable Air Conditioner Compressor` | `img/compressor3.webp` | Workshop photo: four black cylindrical compressors standing in a row in shop. | Unbranded Commercial | Batch inventory photo of commercial ductable units. |
| **4** | `Mitsubishi AC Compressor` | `img/compressor4.webp` | Workshop photo: overhead view of two black compressors on packaging cardboard. | Mitsubishi Electric / Heavy | Generic brand entry. No model stamped. |
| **5** | `Samsung Ac Compressor` | `img/compressor5.webp` | White-background product photo of a black Samsung compressor. | Samsung | Generic brand entry. Model number not specified. |
| **6** | `ANB52FKRMT AC Compressor` | `img/compressor6.webp` | Close-up workshop photo of compressor body and label with yellow/blue/red lead wires. | Highly / Hitachi (`ANB52FKRMT`) | Specific rotary model reference (`ANB52FKRMT`). Highly/Hitachi manufacture. |
| **7** | `Daikin Air Conditioner Compressor` | `img/compressor7.webp` | Workshop photo: black Daikin scroll compressor standing on red carpet against white wall. | Daikin Scroll | Authentic shop photo of Daikin scroll compressor. |
| **8** | `Rotary Compressor GMCC HIGHLY PANASONIC LG SAMSUNG` | `img/compressor8.webp` | Isolated product photo of Highly rotary compressor with attached suction accumulator. | Highly / Multi-Brand | Umbrella entry covering multiple rotary brands for domestic/light commercial. |
| **9** | `Hitachi Rotary Compressor 1.5 Ton` | `img/compressor9.webp` | Isolated cutout of black rotary compressor with suction accumulator. | Hitachi (1.5 TR) | 1.5 Ton residential/light commercial rotary compressor. |
| **10** | `Daikin Refrigeration Compressors` | `img/compressor10.webp` | **Authentic close-up workshop photo of a Daikin compressor nameplate clearly showing `JT160...`**. | Daikin (`JT160`) | **Direct physical evidence** that Z Cool has handled Daikin JT160 inventory. |
| **11** | `Zr125 Scroll Compressor` | `img/compressor11.webp` | Studio photo of Copeland Scroll compressor with green Emerson/Copeland label. | Copeland (`ZR125`) | Commercial 10-Ton Copeland scroll compressor (`ZR125KC-TFD`). |
| **12** | `Zr190 Emerson Copeland` | `img/compressor12.webp` | Studio photo of large Copeland Scroll compressor with side electrical terminal box. | Copeland (`ZR190`) | Commercial 15-Ton Copeland scroll compressor (`ZR190KC-TFD`). |
| **13** | `ZB150 EMERSON COPELAND` | `img/compressor13.webp` | Studio photo of tall teal/green Copeland scroll refrigeration compressor. | Copeland (`ZB150`) | Medium-temp refrigeration scroll compressor (`ZB150KCE`). |
| **14** | `ZPD72 EMERSON SCROLL COMPRESSOR` | `img/compressor14.webp` | Studio photo of Copeland Digital Scroll compressor with top modulation solenoid valve. | Copeland (`ZPD72`) | 6-Ton Digital Scroll compressor. Counterpart to current catalog Item 1 (`ZR72`). |
| **15** | `Zr190kce Copeland Scroll Compressor` | `img/compressor15.webp` | Studio cutout of Copeland Scroll compressor with electrical box. | Copeland (`ZR190KCE`) | 15-Ton scroll compressor for R407C/R134a/R22 (`ZR190KCE-TFD`). |
| **16** | `Danfoss Sm185s4rc Scroll Compressor` | `img/compressor16.webp` | Manufacturer photo of large blue Danfoss Performer scroll compressor. | Danfoss (`SM185-4VI / SM185S4RC`) | Commercial 15-Ton Danfoss Performer scroll compressor for R22. |
| **17** | `Rotary 1.5 Ton , R22 GMCC` | `img/compressor17.webp` | Product photo of black rotary compressor with accumulator. | GMCC (1.5 TR, R22) | Light commercial rotary compressor. |
| **18** | `DAIKIN Jt300d SCROLL COMPRESSOR` | `img/compressor18.webp` | Product photo of tall black Daikin scroll compressor. | Daikin (`JT300D`) | 10-Ton Daikin scroll. Closest counterpart to current catalog Item 6 (`JT300`). |
| **19** | `Daikin JT125 SCROLL COMPRESSOR` | `img/compressor19.webp` | Studio photo of Daikin commercial scroll compressor. | Daikin (`JT125`) | Commercial Daikin scroll compressor (approx. 4 TR). |
| **20** | `ZF15K4E EMERSON COPELAND` | `img/compressor20.webp` | Product photo of black Copeland scroll with liquid injection fitting. | Copeland (`ZF15K4E`) | Low-temperature refrigeration scroll compressor with vapor/liquid injection. |
| **21** | `Mitsubishi RB233 ROTARY COMPRESSOR` | `img/compressor21.webp` | Product photo of rotary compressor with accumulator. | Mitsubishi (`RB233`) | Rotary AC compressor model RB233. |
| **22** | `HNB83FB-YE-C Mitsubishi electric compressor` | `img/compressor22.webp` | Workshop photo showing label on compressor body. | Mitsubishi Electric (`HNB83FB-YE-C`) | Specific rotary/inverter compressor model code. |
| **23** | `LG Air Conditioner Compressor` | `img/compressor23.webp` | Workshop photo of black LG compressor. | LG | Generic brand entry. No model specified. |
| **24** | `Mitsubishi Compressor TNB306FPNMT` | `img/compressor24.webp` | Workshop/studio photo showing model label. | Mitsubishi (`TNB306FPNMT`) | Specific twin-rotary compressor model. |
| **25** | `Split Air Conditioner Compressor` | `img/compressor25.webp` | Workshop photo of multiple split AC compressors. | Generic Split AC | Generic entry for residential split replacement. |
| **26** | `Carrier Air Conditioner Compressor` | `img/compressor26.webp` | Product photo of Carrier commercial compressor. | Carrier / Carlyle | Generic brand entry for Carrier systems. |
| **27** | `Mitsubishi TNB306FPGMT AC Compressor` | `img/compressor27.webp` | Product photo showing label details. | Mitsubishi (`TNB306FPGMT`) | Specific twin-rotary compressor model variant. |
| **28** | `Sanyo compressor` | `img/compressor28.webp` | Studio photo of black Sanyo scroll/rotary compressor. | Sanyo (Panasonic) | Commercial scroll/rotary compressor. |
| **29** | `1.5 Ton Mitsubishi SCI Rotary Compressor` | `img/compressor29.webp` | Cutout of black rotary compressor with accumulator. | Siam Compressor Industry (SCI Mitsubishi) | 1.5 Ton residential/light commercial rotary. |
| **30** | `Hitachi AC DC Inverter Compressor` | `img/compressor30.webp` | Product photo of inverter rotary compressor. | Hitachi | DC Inverter variable-speed compressor. |
| **31** | `Hitachi Scroll Compressor` | `img/compressor31.webp` | Product photo of Hitachi scroll compressor. | Hitachi Scroll | Commercial scroll compressor. |
| **32** | `1 Ton Rotary Highly Compressor` | `img/compressor32.webp` | Product photo of Highly rotary compressor. | Highly (1.0 TR) | 1 Ton rotary compressor. |
| **33** | `Bluestar danfoss AC compressor` | `img/compressor33.webp` | Workshop photo of Danfoss blue compressor in Blue Star package unit. | Danfoss / Blue Star | Danfoss compressor configured for Blue Star packaged chillers. |
| **34** | `Air Conditioner Compressor` | `img/compressor34.webp` | Stock photo of compressor shell. | Generic AC | Generic umbrella listing. |
| **35** | `Gmcc 2.0 Tr Rotary R22 Compressor 24840 Btu` | `img/compressor35.webp` | Studio photo of GMCC rotary compressor with accumulator. | GMCC (2.0 TR, R22) | 2.0 Ton (24,840 BTU/h) rotary compressor. |
| **36** | `Emerson Copeland Compressor KCN 463` | `img/compressor36.webp` | Product photo of small hermetic reciprocating compressor. | Emerson Copeland (`KCN463LCL / HAG`) | Small hermetic reciprocating compressor for bottle coolers/deep freezers. |
| **37** | `Emerson Copeland Compressor ZB 114 KCE` | `img/compressor37.webp` | Product photo of tall green Copeland scroll compressor. | Emerson Copeland (`ZB114KCE`) | Medium-temp refrigeration scroll compressor (approx. 15 HP). |
| **38** | `SBN453 PANASONIC SCROLL` | `img/compressor38.webp` | Studio photo of Panasonic commercial scroll compressor. | Panasonic (`SBN453`) | Commercial 6-Ton Panasonic scroll compressor. |
| **39** | `MT72 DANFOSS COMPRESSOR` | `img/compressor39.webp` | Product photo of round blue Danfoss Maneurop reciprocating compressor. | Danfoss Maneurop (`MT72`) | 6-Ton reciprocating compressor with rotolock valves (R22/Mineral oil). |
| **40** | `JT15 DAIKIN DC COMPRESSOR` | `img/compressor40.webp` | Product photo of small Daikin DC inverter compressor. | Daikin (`JT15`) | Small DC inverter compressor for mini-VRV / split. |

---

## 5. Synthesis & Cross-Source Taxonomy Mapping

### 5.1 Cross-Source Correlation Matrix

```
┌───────────────────────────────────────────────┬───────────────────────────────────────────────┬──────────────────────┐
│ Current Next.js Product (Source A)            │ Closest Legacy Product (Source B)             │ Audit Alignment      │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────┤
│ 1. Copeland Scroll ZR72KC-TFD                 │ Item 14: ZPD72 EMERSON SCROLL COMPRESSOR      │ Model Variant Shift  │
│                                               │ (ZPD is Digital Scroll; ZR is Standard)       │ (Confirm exact code) │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────┤
│ 2. Daikin Scroll JT160G-P8Y1                  │ Item 10: Daikin Refrigeration Compressors     │ Confirmed Brand /    │
│                                               │ (Nameplate photo proves JT160 on site)        │ Needs Suffix Check   │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────┤
│ 3. LG Commercial Rotary HQ034P                │ Item 8 / Item 23: LG AC Compressor (Generic)  │ Unverified Model     │
│                                               │ (Model HQ034P does not exist on legacy site)  │ (Suspected mockup)   │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────┤
│ 4. Danfoss Maneurop Reciprocating MTZ64       │ Item 39: MT72 DANFOSS COMPRESSOR              │ Gas & Oil Shift      │
│                                               │ (MT72 is R22/Mineral; MTZ64 is R404A/POE)     │ (Fatal Image Error)  │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────┤
│ 5. Copeland Semi-Hermetic 3DS3R17ME           │ NO EQUIVALENT (Zero semi-hermetic in legacy)  │ Unverified Model     │
│                                               │ (Legacy lists only scroll and small recip)    │ (Fatal Image Error)  │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────┤
│ 6. Daikin Inverter Scroll JT300               │ Item 18: DAIKIN Jt300d SCROLL COMPRESSOR      │ Suffix Discrepancy   │
│                                               │ (JT300 vs JT300D; confirm inverter vs fixed)  │ (Reused Image)       │
└───────────────────────────────────────────────┴───────────────────────────────────────────────┴──────────────────────┘
```

### 5.2 Critical Discrepancies Explained
1. **The Suffix Principle:** In refrigeration engineering, suffixes are not cosmetic:
   - `ZR` vs `ZPD`: A `ZPD` compressor contains a pulse-width modulated solenoid unloader valve at the top of the scroll set for digital capacity modulation (10%–100%). A `ZR` compressor is a standard constant-volume scroll. Selling a `ZR` as a `ZPD` (or vice versa) results in field equipment failure or wiring incompatibility.
   - `MT` vs `MTZ`: Danfoss Maneurop `MT` units contain 160P mineral oil incompatible with modern HFC refrigerants. `MTZ` units contain 160PZ polyolester (POE) oil. Interchanging them without flushing and oil retrofitting causes immediate chemical breakdown.
   - `JT300` vs `JT300d`: Daikin model numbers specify displacement, voltage codes, and whether the motor is an AC induction or DC brushless inverter motor.
2. **Missing Industrial Breadth:** The client's legacy page demonstrates that Z Cool Enterprises handles a much broader variety of multi-brand rotary compressors (Mitsubishi, Highly, GMCC, Panasonic) and medium/low-temp refrigeration scrolls (`ZB150`, `ZF15K4E`, `ZB114KCE`, `SM185`) than is captured by the 6 mockup cards in the current Next.js repository.
3. **Ghost Categories:** The current codebase hardcodes 25 categories in `src/data/products.js`, including extraneous items like `3D Bed Sheet`, `AACSR Conductor`, `Pump And Valve`, and `New Items`. These appear to be remnants of a multi-product trade portal template and should be removed or disabled upon rebuild.

---

## 6. Actionable List of Mandatory Client Confirmations Required Before Implementation

Before modifying any source code, restructuring the product database, or replacing images, the engineering team requires formal client sign-off on the following 12 specific confirmation items:

### Group A: Exact Physical Inventory & Model Identity
1. **Confirmation on Copeland 72 Series:**  
   *Question for Client:* Does Z Cool Enterprises physically inventory the standard fixed-speed **Copeland ZR72KC-TFD** (6.0 HP commercial AC scroll), the modulating **Copeland Digital Scroll ZPD72**, or both? Which exact electrical code (e.g. `TFD-522` for 380–420V 3-phase 50Hz) is supplied?
2. **Confirmation on Daikin JT160 Specification:**  
   *Question for Client:* Confirm the exact model code for the Daikin 5-Ton scroll compressor. Is it **JT160G-P8Y1** (R410A refrigerant), **JT160BCBY1L** (R22 refrigerant), or another variant?
3. **Confirmation on Daikin 10-Ton Scroll (JT300 vs JT300D):**  
   *Question for Client:* Confirm the exact model reference for the 10-Ton Daikin scroll unit. Legacy Item 18 lists **JT300D**, while current Card 6 lists **JT300 Inverter**. Is this unit a standard fixed-speed 380V AC compressor (`JT300D`) or a true DC Inverter variable-speed compressor for VRV IV/V outdoor condensing units?
4. **Confirmation on Danfoss Maneurop Series (MT72 vs MTZ64):**  
   *Question for Client:* Does active stock consist of **Danfoss Maneurop MT72** (R22 / Mineral oil) as shown on legacy Item 39, **MTZ64** (R404A/R134a / POE oil), or both?
5. **Confirmation on LG HQ034P Reality:**  
   *Question for Client:* Is **LG Commercial Rotary HQ034P** an actual physical product supplied by Z Cool Enterprises, or was this a placeholder added during early web development? If actively supplied, what is its exact horsepower and voltage rating?
6. **Confirmation on Semi-Hermetic Discus Reality:**  
   *Question for Client:* Does Z Cool Enterprises physically overhaul and supply heavy industrial semi-hermetic compressors like the **Copeland Discus 3DS3R17ME** (145 kg reciprocating block)? If yes, in what condition (refurbished with warranty, bare block, or sourced on demand)? If not, should this card be removed from the primary catalog?

### Group B: Expansion to High-Velocity Legacy Inventory
7. **Inclusion of Prominent Legacy Models:**  
   *Question for Client:* Should high-velocity models prominently featured on the legacy site be formally added to the new catalog? Specifically:
   - *Copeland Refrigeration Scrolls:* `ZB150` (15 HP Medium Temp), `ZB114KCE`, and `ZF15K4E` (Low Temp)?
   - *Copeland Large Commercial Scrolls:* `ZR125` (10 HP) and `ZR190` / `ZR190KCE` (15 HP)?
   - *Danfoss Commercial Performer:* `SM185S4RC` (15 HP)?
   - *Multi-brand Commercial Rotaries:* GMCC 2.0 TR, Mitsubishi TNB306, Highly ANB52?

### Group C: Authentic Photographic Assets
8. **Provision of Physical Nameplate Photographs:**  
   *Question for Client:* In order to permanently eliminate repeated placeholder images and build institutional B2B trust, can the client provide authentic photographs of physical units currently in the workshop or warehouse—specifically showing the manufacturer nameplate, terminal box, and mounting footprint?
9. **Visual Verification Protocol for Reciprocating vs Scroll:**  
   *Sign-off Request:* Confirm that all future catalog cards will display distinct, physically authentic photography corresponding strictly to the machine's actual construction (i.e. round blue/black canisters with rotolock valves for Danfoss Maneurop; cast-iron blocks with cylinder heads for semi-hermetic; cylindrical canisters with suction accumulators for rotary).

### Group D: Commercial, Refurbishment, & Warranty Claims
10. **Refurbishment & Testing Protocol Standards:**  
    *Question for Client:* What are the exact testing stages performed on refurbished compressors before dispatch? (e.g. Megger insulation resistance testing, nitrogen pressure holding test at 30 bar, running vacuum drawdown, acid flush, fresh oil charge). We will document only verified testing steps and remove unverified claims.
11. **Warranty Terms & Dispatch Coverage:**  
    *Question for Client:* What is the official B2B replacement or warranty policy (e.g. testing warranty on arrival, 3-month replacement, 6-month warranty on motor winding)? What freight logistics are officially supported (e.g. V-Trans, TCI Freight, Blue Dart surface, local Mumbai tempo dispatch)?
12. **Purge of Irrelevant Non-HVAC Categories:**  
    *Sign-off Request:* Confirm authorization to purge the 4 irrelevant template categories (`3D Bed Sheet`, `AACSR Conductor`, `Pump And Valve`, `New Items`) from the catalog taxonomy.

---

## 7. Audit Freeze Declaration & Immediate Next Steps

In strict accordance with the project instructions:
- **No source code has been altered or deleted.**
- **No database records have been modified or overwritten.**
- **No images have been swapped or deleted.**
- **No external dependencies have been installed.**
- Both `REBUILD_AUDIT.md` (codebase architecture audit) and `PRODUCT_DATA_RECONCILIATION.md` (product data and image forensics) are finalized and frozen.

**CURRENT STATE:** Execution is stopped. Awaiting client review and user authorization on the 12 confirmation items before proceeding to Phase 2 (Implementation & Catalog Cleanse).
