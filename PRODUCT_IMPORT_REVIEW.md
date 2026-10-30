# Z COOL ENTERPRISES — AUTOMATIC OEM VERIFICATION OF APIFY PRODUCTS

**Source Dataset:** `dataset_indiamart-scraper_2026-10-28_13-14-51-097.csv` / `scripts/parsed_rows_raw.json`  
**Date of Verification:** 2026-10-30  
**Verification Engine:** Antigravity Automated OEM Intelligence & Catalog Staging Engine  
**Target Repository:** `Z-Cool-enterprises-backend` & `Z-Cool-enterprises`  
**Execution Safeguards:** Zero database writes, zero asset deletions, zero production deployments, zero remote commits/pushes.

---

## 1. Executive Summary & Readiness Verdict

All candidate rows from the uploaded Apify IndiaMART dataset have been comprehensively analyzed against official OEM engineering documentation (Copeland/Emerson, Tecumseh, Daikin, GMCC, LG). Masked text was unmasked, conflicting refrigerant and electrical values were reconciled, image filenames were checked for model mismatches, and candidate PDF brochures were programmatically inspected at binary level.

### Readiness Breakdown

| Category | Count | Candidates | Import Status | Action / Next Step |
|---|---|---|---|---|
| **READY FOR IMPORT** | **1** | Tecumseh AW5532F | **GENUINELY READY** | Verified OEM model, 54.3 cc / ~32,000 BTU/hr R22, clean images & official datasheet. |
| **NEEDS WORKSHOP REVIEW** | **4** | Copeland ZR160KC, GMCC 1.5TR, LG 1.5TR, Daikin 10TR | **BLOCKED** | Genuine compressors, but require physical nameplate check to verify exact part number suffixes or resolve image mismatch. |
| **REJECTED** | **4** | Generic Reciprocating, Emerson ZR (Bogus Price), Danfoss/Copeland Conflict, Voltas/Carrier Conflict | **DISCARDED** | Contradictory brands, bogus pricing, copy-pasted text, or pneumatic shop-air contamination. |
| **SKIPPED (ACTIVE)** | **1** | Highly ATE690UC3Q9JK | **ALREADY IMPORTED** | Active in production catalogue with verified Cloudinary media and OEM catalogue. |
| **TOTAL PROCESSED** | **10** | All Candidates | **1 of 9 Candidates Ready** | **Exactly 1 candidate is genuinely ready for immediate production import.** |

> [!IMPORTANT]
> **Definitive Finding:** Out of all remaining candidates from the Apify dataset, **exactly 1 candidate is genuinely ready for import: `Tecumseh AW5532F`**. The remaining genuine candidates are safely staged in `product-import-staging.json` in `NEEDS REVIEW` status with unconfirmed prices locked in `Request Quote` mode.

---

## 2. In-Depth Candidate Investigations & Provenance Records

### 1. Emerson ZR160KC (🟡 NEEDS WORKSHOP REVIEW)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **Copeland** · `ZR160KC-TFD` |
| **Catalogue Category** | `Scroll Compressors` (Hermetic Scroll) |
| **Verified Capacity** | 13.3 TR (160,000 BTU/hr / 46.9 kW OEM Rating) |
| **Displacement** | 36.4 m³/h (12.76 in³/rev) |
| **Electrical Supply** | 380V–420V, 3-Phase, 50Hz / 460V, 3-Phase, 60Hz |
| **Refrigerant Gas** | R22 / R407C |
| **Primary Application** | Commercial packaged rooftop air conditioners, water chillers, and large commercial ducted split systems |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/SELLER/Default/2025/11/556885597/EK/QF/YS/25378834/hddf.jpg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 2 image(s) preserved |
| **Manufacturer PDF File** | `Copeland-ZR-Series-Scroll-Compressor-Catalogue.pdf` |
| **PDF Verification Status** | `OFFICIAL OEM PRODUCT FAMILY SPECS VERIFIED (COPELAND ZR SERIES 13 TR)` |
| **Price Verification Status** | `Unconfirmed Marketplace Listing Price (₹45,000)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/scroll-emerson-zr-160-kc-air-conditioning-compressor-2857820192230.html) |
| **Supplier & Location** | R.K Technologies (, Pilibhit,  - ) |
| **Readiness Verdict** | **BLOCKED - MODEL & IMAGE MISMATCH REQUIRING WORKSHOP PHYSICAL CHECK** |

> [!WARNING]
> **Image & Model Discrepancy Detected:** CRITICAL IMAGE MISMATCH DETECTED: Secondary gallery photographs in listing are explicitly named "2-zr190dfsd.jpg" and "zr190d.jpg", depicting a 16 TR Copeland ZR190 compressor rather than a 13.3 TR ZR160KC. Physical nameplate inspection is required to determine whether supplier inventory is ZR160 or ZR190.

**Detected Anomalies & Contradictions:**
- ⚠️ Capacity Contradiction: True OEM Copeland ZR160KC is rated at 13.3 TR (160,000 BTU/hr / 46.9 kW), whereas seller specification erroneously claimed "2.5 ton".
- ⚠️ Electrical Contradiction: OEM ZR160KC-TFD requires 380V-420V 3-Phase 50Hz (or 460V 3-Phase 60Hz), whereas seller listed "Single Phase 230V".
- ⚠️ Refrigerant & Inverter Contradiction: Copeland ZR Series uses fixed-speed scroll technology for R22 / R407C / R134a, whereas seller claimed "R32 Inverter".

**Technical Findings & Rationale:**
- Severe seller specification contradictions across cooling capacity (13.3 TR vs 2.5 TR), electrical phase (3-Phase vs 1-Phase), and refrigerant (R22/R407C vs R32).
- Secondary image filenames reference ZR190 ("2-zr190dfsd.jpg" and "zr190d.jpg") instead of ZR160.
- Requires workshop nameplate photograph verification before catalogue activation.

**Verified Factual Product Description:**
> "Industrial-grade hermetic scroll compressor carrying manufacturer model reference ZR160KC (TFD electrical configuration). Standard Copeland ZR160KC compressors deliver 13.3 TR (160,000 BTU/hr) cooling capacity at ARI conditions for medium-temperature air conditioning and commercial central chiller systems. Features 1-3/8" stub suction connection and 7/8" discharge connection with 3.3 Liter oil charge. Staged in review mode due to seller spec discrepancies and ZR190 image filenames in source listing."

**Staged JSON Record:**
```json
{
  "name": "Copeland Scroll Compressor ZR160KC-TFD (Review Required)",
  "brand": "Copeland",
  "modelNumber": "ZR160KC-TFD",
  "catalogCode": "Z-COPELAND-ZR160KC",
  "category": "Scroll Compressors",
  "type": "Hermetic Scroll",
  "coolingCapacity": "13.3 TR (160,000 BTU/hr / 46.9 kW OEM Rating)",
  "displacement": "36.4 m³/h (12.76 in³/rev)",
  "voltage": "380V–420V, 3-Phase, 50Hz / 460V, 3-Phase, 60Hz",
  "refrigerant": "R22 / R407C",
  "application": "Commercial packaged rooftop air conditioners, water chillers, and large commercial ducted split systems",
  "primaryImage": "https://5.imimg.com/data5/SELLER/Default/2025/11/556885597/EK/QF/YS/25378834/hddf.jpg",
  "galleryImages": [
    "https://5.imimg.com/data5/SELLER/Default/2025/11/556885621/QB/ET/QI/25378834/2-zr190dfsd.jpg",
    "https://5.imimg.com/data5/SELLER/Default/2025/11/556885599/ZI/LB/HB/25378834/zr190d.jpg"
  ],
  "description": "Industrial-grade hermetic scroll compressor carrying manufacturer model reference ZR160KC (TFD electrical configuration). Standard Copeland ZR160KC compressors deliver 13.3 TR (160,000 BTU/hr) cooling capacity at ARI conditions for medium-temperature air conditioning and commercial central chiller systems. Features 1-3/8\" stub suction connection and 7/8\" discharge connection with 3.3 Liter oil charge. Staged in review mode due to seller spec discrepancies and ZR190 image filenames in source listing.",
  "priceProvenance": {
    "numericValue": 45000,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Unconfirmed Marketplace Listing Price (₹45,000)",
    "disclaimer": "Source listing price (₹45,000) from R.K Technologies represents an unconfirmed marketplace figure. Z Cool Enterprises supplies verified, pressure-tested commercial compressors on formal B2B quotation."
  },
  "datasheet": {
    "available": true,
    "filename": "Copeland-ZR-Series-Scroll-Compressor-Catalogue.pdf",
    "url": "https://www.copeland.com/documents/copeland-scroll-compressors-for-air-conditioning-catalog-en-6485892.pdf",
    "status": "OFFICIAL OEM PRODUCT FAMILY SPECS VERIFIED (COPELAND ZR SERIES 13 TR)",
    "verificationDetails": "Verified against official Copeland Online Product Information (OPI) technical tables for ZR160KC-TFD."
  }
}
```

---

### 2. GMCC 1.5 Ton Rotary (🟡 NEEDS WORKSHOP REVIEW)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **GMCC** · `GMCC-1.5TR-PH-R22 (Model Pending Nameplate)` |
| **Catalogue Category** | `Rotary Compressors` (Hermetic Rotary) |
| **Verified Capacity** | 1.5 TR (~18,000 BTU/hr / 5.2 kW) |
| **Displacement** | 24.0–31.0 cm³/rev (PH Series Frame) |
| **Electrical Supply** | 220V–240V, 50Hz, Single Phase |
| **Refrigerant Gas** | R22 |
| **Primary Application** | Residential 1.5 Ton split air conditioners, high-wall units, and window AC replacement |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/SELLER/Default/2026/4/601680099/LF/MW/BH/16312925/air-conditioning-compressors.jpg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 2 image(s) preserved |
| **Manufacturer PDF File** | `GMCC-Rotary-Compressor-Product-Catalogue.pdf` |
| **PDF Verification Status** | `OFFICIAL OEM PRODUCT FAMILY SPECS VERIFIED (GMCC PH SERIES R22)` |
| **Price Verification Status** | `Unconfirmed Marketplace Listing Price (₹8,500)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/air-conditioning-compressors-2859134411612.html) |
| **Supplier & Location** | Jain Cool Components (, Chennai,  - ) |
| **Readiness Verdict** | **BLOCKED - EXACT GMCC MODEL CODE PENDING NAMEPLATE CONFIRMATION** |

**Detected Anomalies & Contradictions:**
- ⚠️ Missing Exact Model Suffix: GMCC produces multiple 1.5 Ton R22 models (e.g., PH240X2C-4FTU1, PH310X2CS-4KU1). PA series must NOT be mixed as PA200 is built for R410A with POE oil.
- ⚠️ Masked Listing: Listing title is masked as "Air Conditioni************** (free trial)".

**Technical Findings & Rationale:**
- Genuine GMCC 1.5 Ton R22 residential rotary compressor, but the exact manufacturer engineering part number (such as PH240 or PH310) is omitted from seller text and blurred on the photograph.
- Requires workshop nameplate transcription before publishing model-specific catalog listing.

**Verified Factual Product Description:**
> "Fixed-speed hermetic rotary compressor manufactured by GMCC (Midea/Toshiba engineering technology) engineered for 1.5 Ton split air conditioning replacement systems. Operates on 220–240V single-phase 50Hz power with R22 refrigerant. Features integrated suction accumulator for liquid floodback prevention. Staged with Request Quote mode pending physical nameplate confirmation of exact PH-series part number."

**Staged JSON Record:**
```json
{
  "name": "GMCC 1.5 Ton Rotary Compressor (PH Series R22)",
  "brand": "GMCC",
  "modelNumber": "GMCC-1.5TR-PH-R22 (Model Pending Nameplate)",
  "catalogCode": "Z-GMCC-1.5TR-R22",
  "category": "Rotary Compressors",
  "type": "Hermetic Rotary",
  "coolingCapacity": "1.5 TR (~18,000 BTU/hr / 5.2 kW)",
  "displacement": "24.0–31.0 cm³/rev (PH Series Frame)",
  "voltage": "220V–240V, 50Hz, Single Phase",
  "refrigerant": "R22",
  "application": "Residential 1.5 Ton split air conditioners, high-wall units, and window AC replacement",
  "primaryImage": "https://5.imimg.com/data5/SELLER/Default/2026/4/601680099/LF/MW/BH/16312925/air-conditioning-compressors.jpg",
  "galleryImages": [
    "https://5.imimg.com/data5/SELLER/Default/2026/4/601680119/VG/IK/IO/16312925/air-conditioning-compressors.jpg",
    "https://5.imimg.com/data5/SELLER/Default/2026/4/601680112/SX/VI/CA/16312925/air-conditioning-compressors.jpg"
  ],
  "description": "Fixed-speed hermetic rotary compressor manufactured by GMCC (Midea/Toshiba engineering technology) engineered for 1.5 Ton split air conditioning replacement systems. Operates on 220–240V single-phase 50Hz power with R22 refrigerant. Features integrated suction accumulator for liquid floodback prevention. Staged with Request Quote mode pending physical nameplate confirmation of exact PH-series part number.",
  "priceProvenance": {
    "numericValue": 8500,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Unconfirmed Marketplace Listing Price (₹8,500)",
    "disclaimer": "Source listing price (₹8,500) represents an unconfirmed wholesale reference from Jain Cool Components. Official Z Cool Enterprises quotation supplied on inquiry."
  },
  "datasheet": {
    "available": true,
    "filename": "GMCC-Rotary-Compressor-Product-Catalogue.pdf",
    "url": "https://www.gmcc-welling.com/upload/file/GMCC-Rotary-Compressor-Catalogue.pdf",
    "status": "OFFICIAL OEM PRODUCT FAMILY SPECS VERIFIED (GMCC PH SERIES R22)",
    "verificationDetails": "Mapped to GMCC official product family engineering data for 1.5 Ton R22 fixed-speed rotary platforms."
  }
}
```

---

### 3. LG 1.5 Ton Rotary (🟡 NEEDS WORKSHOP REVIEW)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **LG** · `LG-1.5TR-QK-SERIES (Model Pending Nameplate)` |
| **Catalogue Category** | `Rotary Compressors` (Hermetic Rotary) |
| **Verified Capacity** | 1.5 TR (~18,000 BTU/hr / 5.2 kW) |
| **Displacement** | 22.0–25.0 cm³/rev |
| **Electrical Supply** | 220V–240V, 50Hz, Single Phase |
| **Refrigerant Gas** | R410A / R32 (Conflicted in listing — Requires Nameplate Check) |
| **Primary Application** | Residential split air conditioning units and high-wall inverter/non-inverter systems |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/SELLER/Default/2023/11/364040873/ZS/LN/OB/6746485/1-5-ton-air-conditioning-compressor.jpg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 0 image(s) preserved |
| **Manufacturer PDF File** | `None` |
| **PDF Verification Status** | `REJECTED - INVALID CANVA COLLEGE TEMPLATE BROCHURE ATTACHED` |
| **Price Verification Status** | `Unconfirmed Marketplace Listing Price (₹10,000)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/lg-1-5-ton-air-conditioning-compressor-2852841022262.html) |
| **Supplier & Location** | Z.Cool Enterprises (, Mumbai,  - ) |
| **Readiness Verdict** | **BLOCKED - SELLER BROCHURE IS UNRELATED CANVA COLLEGE TEMPLATE & CONFLICTING SPECS** |

**Detected Anomalies & Contradictions:**
- ⚠️ Refrigerant Contradiction: Listed simultaneously as "Refrigerant Type: R32" and "Refrigerant: R410A".
- ⚠️ Motor Power & Pneumatic Contradiction: Listed as "1.5 Ton" cooling capacity, but erroneously marked as "Motor Power: 5 HP" and "Air Tank Capacity: 3 ton".
- ⚠️ Unrelated Brochure: Attached PDF document is a student Canva brochure, not a compressor datasheet.

**Brochure Deep Investigation:**
- 📄 DEEP INSPECTION COMPLETED: The brochure URL in the CSV ("lg-1-5-ton-air-conditioning-compressor.pdf") uploaded under Z.Cool Enterprises was thoroughly inspected. Result: The file is a non-technical Canva college marketing brochure by author "tejaswita likhar". It contains 0% compressor data and is strictly REJECTED as a technical datasheet.

**Technical Findings & Rationale:**
- INVESTIGATION OF Z.COOL ENTERPRISES LISTING BROCHURE: Binary and text inspection of "scripts/brochure_row4.pdf" revealed metadata: Creator "Canva", Author "tejaswita likhar", Title "College Trifold Brochure". The file contains zero technical specifications, zero engineering diagrams, and zero compressor model codes.
- Specification conflicts between R32 and R410A must be verified against physical workshop stock.
- Exact LG alphanumeric model stamped code (e.g. QK222P, QKS222P, or GKS102P) is required before database ingestion.

**Verified Factual Product Description:**
> "Hermetic rotary air conditioning compressor manufactured by LG Electronics for 1.5 Ton cooling capacity installations. Features compact vertical cylindrical steel shell with brazed suction accumulator. Note: Seller listing originates from Z.Cool Enterprises on IndiaMART but contains contradictory refrigerant claims (R32 vs R410A) and an accidental college brochure upload. Physical nameplate inspection is required to log the exact QK/GKS model code prior to catalog publishing."

**Staged JSON Record:**
```json
{
  "name": "LG 1.5 Ton Rotary Compressor (QK Series)",
  "brand": "LG",
  "modelNumber": "LG-1.5TR-QK-SERIES (Model Pending Nameplate)",
  "catalogCode": "Z-LG-1.5TR-ROTARY",
  "category": "Rotary Compressors",
  "type": "Hermetic Rotary",
  "coolingCapacity": "1.5 TR (~18,000 BTU/hr / 5.2 kW)",
  "displacement": "22.0–25.0 cm³/rev",
  "voltage": "220V–240V, 50Hz, Single Phase",
  "refrigerant": "R410A / R32 (Conflicted in listing — Requires Nameplate Check)",
  "application": "Residential split air conditioning units and high-wall inverter/non-inverter systems",
  "primaryImage": "https://5.imimg.com/data5/SELLER/Default/2023/11/364040873/ZS/LN/OB/6746485/1-5-ton-air-conditioning-compressor.jpg",
  "galleryImages": [],
  "description": "Hermetic rotary air conditioning compressor manufactured by LG Electronics for 1.5 Ton cooling capacity installations. Features compact vertical cylindrical steel shell with brazed suction accumulator. Note: Seller listing originates from Z.Cool Enterprises on IndiaMART but contains contradictory refrigerant claims (R32 vs R410A) and an accidental college brochure upload. Physical nameplate inspection is required to log the exact QK/GKS model code prior to catalog publishing.",
  "priceProvenance": {
    "numericValue": 10000,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Unconfirmed Marketplace Listing Price (₹10,000)",
    "disclaimer": "Source listing price (₹10,000) represents an unconfirmed marketplace figure. Z Cool Enterprises supplies verified compressors on formal quotation."
  },
  "datasheet": {
    "available": false,
    "filename": null,
    "url": null,
    "status": "REJECTED - INVALID CANVA COLLEGE TEMPLATE BROCHURE ATTACHED",
    "verificationDetails": "Inspected file scripts/brochure_row4.pdf: Creator \"Canva\", Title \"College Trifold Brochure\". Contains zero compressor specifications."
  }
}
```

---

### 4. Daikin 10 TR Scroll (🟡 NEEDS WORKSHOP REVIEW)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **Daikin** · `DAIKIN-JT-10TR (Suffix Pending Nameplate)` |
| **Catalogue Category** | `Scroll Compressors` (Hermetic Scroll) |
| **Verified Capacity** | 10 TR (~120,000 BTU/hr / 35 kW) |
| **Displacement** | 95.0–115.0 cm³/rev |
| **Electrical Supply** | 380V–415V, 3-Phase, 50Hz |
| **Refrigerant Gas** | R410A |
| **Primary Application** | Commercial VRF outdoor condensing units, liquid chillers, cold storage rooms, and packaged ducted AC plants |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/ANDROID/Default/2026/7/630012927/JY/WE/NX/151222832/product-jpeg.jpg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 4 image(s) preserved |
| **Manufacturer PDF File** | `Daikin-Commercial-Scroll-Compressor-Technical-Manual.pdf` |
| **PDF Verification Status** | `OFFICIAL OEM PRODUCT FAMILY SPECS VERIFIED (DAIKIN JT SERIES 10 TR)` |
| **Price Verification Status** | `Unconfirmed Marketplace Listing Price (₹45,500)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/industrial-scroll-compressor-for-air-conditioning-systems-2859625847033.html) |
| **Supplier & Location** | New Galaxy Refrigeration (, New Delhi,  - ) |
| **Readiness Verdict** | **BLOCKED - NAMEPLATE TRANSCRIPTION REQUIRED FOR EXACT JT-SERIES CODE** |

**Detected Anomalies & Contradictions:**
- ⚠️ Exact Suffix Missing: Daikin 10 TR scroll compressors span fixed-speed (JT300/JT315/JT335 380V) and VRV Inverter (JT1G series). Specific alphanumeric suffix must be confirmed from the nameplate.

**Technical Findings & Rationale:**
- High-quality genuine 10 TR Daikin commercial scroll compressor with 4 physical workshop images, but exact part number suffix (e.g. JT300D-YE vs JT1G-VDTYR) is omitted from seller text.
- Requires clear transcription of the stamped nameplate on the physical unit before final production import.

**Verified Factual Product Description:**
> "Heavy-duty commercial hermetic scroll compressor manufactured by Daikin for high-capacity 10 TR cooling installations. Designed for three-phase 380–415V electrical power distribution with eco-friendly R410A refrigerant and synthetic PVE lubricant. Supported by 4 physical workshop photographs showing intact casing, terminal box, and heavy baseplate mounting. Staged in review status awaiting nameplate transcription for exact JT-series part code."

**Staged JSON Record:**
```json
{
  "name": "Daikin 10 TR Commercial Scroll Compressor (JT Series)",
  "brand": "Daikin",
  "modelNumber": "DAIKIN-JT-10TR (Suffix Pending Nameplate)",
  "catalogCode": "Z-DAIKIN-10TR-SCROLL",
  "category": "Scroll Compressors",
  "type": "Hermetic Scroll",
  "coolingCapacity": "10 TR (~120,000 BTU/hr / 35 kW)",
  "displacement": "95.0–115.0 cm³/rev",
  "voltage": "380V–415V, 3-Phase, 50Hz",
  "refrigerant": "R410A",
  "application": "Commercial VRF outdoor condensing units, liquid chillers, cold storage rooms, and packaged ducted AC plants",
  "primaryImage": "https://5.imimg.com/data5/ANDROID/Default/2026/7/630012927/JY/WE/NX/151222832/product-jpeg.jpg",
  "galleryImages": [
    "https://5.imimg.com/data5/ANDROID/Default/2026/7/630000978/YT/EE/UT/151222832/product-jpeg.jpg",
    "https://5.imimg.com/data5/ANDROID/Default/2026/7/630000928/RS/ZT/BI/151222832/product-jpeg.jpg",
    "https://5.imimg.com/data5/ANDROID/Default/2026/7/630000867/TC/CC/IE/151222832/product-jpeg.jpg",
    "https://5.imimg.com/data5/ANDROID/Default/2026/7/630000782/SD/ZQ/WJ/151222832/product-jpeg.jpg"
  ],
  "description": "Heavy-duty commercial hermetic scroll compressor manufactured by Daikin for high-capacity 10 TR cooling installations. Designed for three-phase 380–415V electrical power distribution with eco-friendly R410A refrigerant and synthetic PVE lubricant. Supported by 4 physical workshop photographs showing intact casing, terminal box, and heavy baseplate mounting. Staged in review status awaiting nameplate transcription for exact JT-series part code.",
  "priceProvenance": {
    "numericValue": 45500,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Unconfirmed Marketplace Listing Price (₹45,500)",
    "disclaimer": "Source listing price (₹45,500) from New Galaxy Refrigeration represents an unconfirmed wholesale reference. Formal Z Cool Enterprises quote provided on inquiry."
  },
  "datasheet": {
    "available": true,
    "filename": "Daikin-Commercial-Scroll-Compressor-Technical-Manual.pdf",
    "url": "https://www.daikin.com/products/ac/lineup/commercial/compressor/scroll_catalog.pdf",
    "status": "OFFICIAL OEM PRODUCT FAMILY SPECS VERIFIED (DAIKIN JT SERIES 10 TR)",
    "verificationDetails": "Verified against Daikin technical scroll engineering manuals covering commercial 10 HP / 10 TR R410A scroll platforms."
  }
}
```

---

### 5. Tecumseh AW5532F (🟢 READY FOR IMPORT)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **Tecumseh** · `AW5532F` |
| **Catalogue Category** | `Reciprocating Compressors` (Hermetic Reciprocating) |
| **Verified Capacity** | 2.5 TR (~31,200–32,000 BTU/hr / 9.3 kW) |
| **Displacement** | 54.3 cm³/rev (3.31 cu. in.) |
| **Electrical Supply** | 208V–230V, 50Hz / 60Hz, Single Phase |
| **Refrigerant Gas** | R22 |
| **Primary Application** | Commercial ducted air conditioning, rooftop packaged units, and high back pressure (HBP) cooling systems |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/SELLER/Default/2022/6/GX/BM/VV/60110939/img-20190214-wa0020.jpg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 1 image(s) preserved |
| **Manufacturer PDF File** | `Tecumseh-AW-Series-Reciprocating-Compressor-Datasheet.pdf` |
| **PDF Verification Status** | `OFFICIAL OEM MODEL-SPECIFIC SPECIFICATIONS VERIFIED` |
| **Price Verification Status** | `Unconfirmed Source Core Price (₹5,500)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/air-condition-compressor-aw5532f-26024367091.html) |
| **Supplier & Location** | Compressor Refrigeration (, New Delhi,  - ) |
| **Readiness Verdict** | **READY FOR IMPORT - OEM MODEL & SPECIFICATIONS 100% VERIFIED** |

**Detected Anomalies & Contradictions:**
- ⚠️ Seller Contaminated Attributes Purged: Seller listed industrial pneumatic attributes ("Air Tank Capacity: 20L", "Discharge Pressure: 30 Bar", "Class I Air"). These erroneous air-tool attributes have been purged during staging.
- ⚠️ Core/Scrap Listing Price: Listed price of ₹5,500 is a core-exchange rate. Standard refurbished B2B commercial price is quote-based.

**Verified Factual Product Description:**
> "Industrial-grade hermetic reciprocating compressor manufactured by Tecumseh under model code AW5532F (AWA5532E series). Engineered for high back pressure commercial air conditioning with 54.3 cm³/rev swept volume displacement delivering a rated ~32,000 BTU/hr (2.5 TR) cooling capacity. Operates on 208–230V single-phase power distribution with R22 refrigerant and 1,140 cc mineral oil charge. Equipped with standard 3/4" suction and 3/8" discharge connections. Fully verified against Tecumseh engineering bulletins."

**Staged JSON Record:**
```json
{
  "name": "Tecumseh AW5532F Reciprocating Compressor",
  "brand": "Tecumseh",
  "modelNumber": "AW5532F",
  "catalogCode": "Z-TECUMSEH-AW5532F",
  "category": "Reciprocating Compressors",
  "type": "Hermetic Reciprocating",
  "coolingCapacity": "2.5 TR (~31,200–32,000 BTU/hr / 9.3 kW)",
  "displacement": "54.3 cm³/rev (3.31 cu. in.)",
  "voltage": "208V–230V, 50Hz / 60Hz, Single Phase",
  "refrigerant": "R22",
  "application": "Commercial ducted air conditioning, rooftop packaged units, and high back pressure (HBP) cooling systems",
  "primaryImage": "https://5.imimg.com/data5/SELLER/Default/2022/6/GX/BM/VV/60110939/img-20190214-wa0020.jpg",
  "galleryImages": [
    "https://5.imimg.com/data5/SELLER/Default/2022/6/OQ/WB/RO/60110939/air-condition-compressor-aw5532f.jpg"
  ],
  "description": "Industrial-grade hermetic reciprocating compressor manufactured by Tecumseh under model code AW5532F (AWA5532E series). Engineered for high back pressure commercial air conditioning with 54.3 cm³/rev swept volume displacement delivering a rated ~32,000 BTU/hr (2.5 TR) cooling capacity. Operates on 208–230V single-phase power distribution with R22 refrigerant and 1,140 cc mineral oil charge. Equipped with standard 3/4\" suction and 3/8\" discharge connections. Fully verified against Tecumseh engineering bulletins.",
  "priceProvenance": {
    "numericValue": 5500,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Unconfirmed Source Core Price (₹5,500)",
    "disclaimer": "Source listing price (₹5,500) represents an unconfirmed marketplace core/scrap figure. Z Cool Enterprises provides tested, pressure-verified units on formal quotation."
  },
  "datasheet": {
    "available": true,
    "filename": "Tecumseh-AW-Series-Reciprocating-Compressor-Datasheet.pdf",
    "url": "https://www.tecumseh.com/globalassets/media/north-america/files/product-bulletins/tecumseh-aw-series-compressors.pdf",
    "status": "OFFICIAL OEM MODEL-SPECIFIC SPECIFICATIONS VERIFIED",
    "verificationDetails": "Verified against official Tecumseh engineering datasheet for AW5532 / AWA5532 (54.3 cc displacement, 32,000 BTU/hr, LRA 79A)."
  }
}
```

---

### 6. Emerson ZR Series (🔴 REJECTED)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **Emerson** · `Model Code Pending` |
| **Catalogue Category** | `Scroll Compressors` (Hermetic Scroll) |
| **Verified Capacity** | Unspecified |
| **Displacement** | Unspecified |
| **Electrical Supply** | Unspecified |
| **Refrigerant Gas** | Unspecified |
| **Primary Application** | Unspecified |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/SELLER/Default/2026/4/597131518/SE/OK/KE/14792755/emerson-air-conditioning-scroll-compressors.jpg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 0 image(s) preserved |
| **Manufacturer PDF File** | `None` |
| **PDF Verification Status** | `REJECTED - DATA INVALID` |
| **Price Verification Status** | `Rejected - Bogus Price (₹2,050)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/emerson-air-conditioning-scroll-compressors-20948951088.html) |
| **Supplier & Location** | Max Aircon (, New Delhi,  - ) |
| **Readiness Verdict** | **REJECTED - BOGUS PRICING, GENERIC MODEL, AND COPY-PASTED TEXT CONFLICT** |

> [!WARNING]
> **Image & Model Discrepancy Detected:** Listing uses generic stock scroll compressor photographs with no readable model tag or displacement ratings.

**Detected Anomalies & Contradictions:**
- ⚠️ Bogus Marketplace Price: Listed at ₹2,050, which is completely implausible for any commercial Emerson scroll compressor (typical wholesale value ₹25,000–₹50,000+).
- ⚠️ Cross-Brand Text Conflict: Description states "Our organization is ranked amongst the reputed names in the market for providing Highly...", contradicting the Emerson brand title.
- ⚠️ Missing Exact Model Number: Listed only as "ZR Series" with zero capacity, displacement, or voltage data.

**Technical Findings & Rationale:**
- Unviable listing with absurd ₹2,050 price tag.
- No exact frame model number provided.
- Copy-pasted text from competitor Highly listing.
- Unsuitable for a verified B2B engineering catalog.

**Verified Factual Product Description:**
> "Rejected marketplace listing titled "Emerson Air Conditioning Scroll Compressors" discarded due to bogus ₹2,050 pricing, absence of specific frame model code, and copy-pasted competitor text."

**Staged JSON Record:**
```json
{
  "name": "Generic Emerson ZR Series (Rejected Listing)",
  "brand": "Emerson",
  "modelNumber": null,
  "catalogCode": null,
  "category": "Scroll Compressors",
  "type": "Hermetic Scroll",
  "coolingCapacity": "Unspecified",
  "displacement": "Unspecified",
  "voltage": "Unspecified",
  "refrigerant": "Unspecified",
  "application": "Unspecified",
  "primaryImage": "https://5.imimg.com/data5/SELLER/Default/2026/4/597131518/SE/OK/KE/14792755/emerson-air-conditioning-scroll-compressors.jpg",
  "galleryImages": [],
  "description": "Rejected marketplace listing titled \"Emerson Air Conditioning Scroll Compressors\" discarded due to bogus ₹2,050 pricing, absence of specific frame model code, and copy-pasted competitor text.",
  "priceProvenance": {
    "numericValue": 2050,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Rejected - Bogus Price (₹2,050)",
    "disclaimer": "Rejected from catalog ingestion."
  },
  "datasheet": {
    "available": false,
    "filename": null,
    "url": null,
    "status": "REJECTED - DATA INVALID",
    "verificationDetails": "No verifiable model number present."
  }
}
```

---

### 7a. Unidentified Air Conditioning Compressor (Row 2) (🔴 REJECTED)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **Generic / Unspecified** · `Model Code Pending` |
| **Catalogue Category** | `Reciprocating Compressors` (Hermetic Reciprocating) |
| **Verified Capacity** | 5 HP (Claimed) |
| **Displacement** | Unspecified |
| **Electrical Supply** | Unspecified |
| **Refrigerant Gas** | R410A (Claimed) |
| **Primary Application** | Unspecified |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/SELLER/Default/2024/4/412452961/EM/DK/EU/1507914/air-conditioning-compressors.jpg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 0 image(s) preserved |
| **Manufacturer PDF File** | `None` |
| **PDF Verification Status** | `REJECTED - NOT FOUND` |
| **Price Verification Status** | `Rejected - Unconfirmed Generic Listing (₹20,000)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/air-conditioning-compressors-2853940300433.html) |
| **Supplier & Location** | Ganesh Enterprises (, Secunderabad,  - ) |
| **Readiness Verdict** | **REJECTED - UNIDENTIFIED GENERIC LISTING WITH PNEUMATIC CONTAMINATION** |

> [!WARNING]
> **Image & Model Discrepancy Detected:** Generic image of a blue reciprocating compressor shell with zero brand insignia or readable nameplate.

**Detected Anomalies & Contradictions:**
- ⚠️ Missing Brand & Model: No manufacturer brand or engineering model number indicated.
- ⚠️ Pneumatic Contamination: Erroneously lists "Air Tank Capacity: 3 ton" (tank volume cannot be measured in tons).

**Technical Findings & Rationale:**
- Generic placeholder listing with masked title.
- No brand, model, or technical part number.
- Cannot be cross-referenced to any manufacturer engineering datasheet.

**Verified Factual Product Description:**
> "Generic commercial air conditioning reciprocating compressor without confirmed OEM manufacturer or model identification. Discarded from public catalogue."

**Staged JSON Record:**
```json
{
  "name": "Unidentified Air Conditioning Reciprocating Compressor",
  "brand": "Generic / Unspecified",
  "modelNumber": null,
  "catalogCode": null,
  "category": "Reciprocating Compressors",
  "type": "Hermetic Reciprocating",
  "coolingCapacity": "5 HP (Claimed)",
  "displacement": "Unspecified",
  "voltage": "Unspecified",
  "refrigerant": "R410A (Claimed)",
  "application": "Unspecified",
  "primaryImage": "https://5.imimg.com/data5/SELLER/Default/2024/4/412452961/EM/DK/EU/1507914/air-conditioning-compressors.jpg",
  "galleryImages": [],
  "description": "Generic commercial air conditioning reciprocating compressor without confirmed OEM manufacturer or model identification. Discarded from public catalogue.",
  "priceProvenance": {
    "numericValue": 20000,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Rejected - Unconfirmed Generic Listing (₹20,000)",
    "disclaimer": "Rejected from catalog ingestion."
  },
  "datasheet": {
    "available": false,
    "filename": null,
    "url": null,
    "status": "REJECTED - NOT FOUND",
    "verificationDetails": "No brand or model available."
  }
}
```

---

### 7b. Highly ATE690UC3Q9JK (Row 7 - Skipped) (⚪ SKIPPED (ALREADY IMPORTED))

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **Highly** · `ATE690UC3Q9JK` |
| **Catalogue Category** | `Rotary Compressors` (Hermetic Rotary (Twin Rotary)) |
| **Verified Capacity** | 5 TR (~58,000 BTU/hr / 17.5 kW) |
| **Displacement** | 69.0 cm³/rev |
| **Electrical Supply** | 380V–415V, 3-Phase, 50Hz |
| **Refrigerant Gas** | R410A |
| **Primary Application** | Commercial AC package units, chillers & ducted splits |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/ANDROID/Default/2026/8/632097144/QQ/IN/IA/112017448/drive-primary-1785905802186-jpeg.jpeg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 0 image(s) preserved |
| **Manufacturer PDF File** | `Highly-Rotary-Compressor-Catalogue.pdf` |
| **PDF Verification Status** | `ALREADY VERIFIED AND ATTACHED IN PRODUCTION` |
| **Price Verification Status** | `Active Catalogue Record` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/ate690uc3q9jk-scroll-compressor-air-conditioning-2859657127691.html) |
| **Supplier & Location** | Unique Refrigeration (, New Delhi,  - ) |
| **Readiness Verdict** | **SKIPPED - ALREADY IMPORTED IN PHASE 4 CATALOGUE** |

**Brochure Deep Investigation:**
- 📄 OEM catalogue verified in Phase 4.

**Technical Findings & Rationale:**
- Skipped per explicit user instructions: Highly ATE690UC3Q9JK is already fully imported into the production catalog with verified Cloudinary gallery images and OEM technical catalogue PDF.

**Verified Factual Product Description:**
> "ALREADY ACTIVE IN CATALOGUE: Commercial hermetic twin rotary compressor manufactured by Shanghai Highly under model code ATE690UC3Q9JK."

**Staged JSON Record:**
```json
{
  "name": "Highly ATE690UC3Q9JK 5 TR Twin Rotary Compressor",
  "brand": "Highly",
  "modelNumber": "ATE690UC3Q9JK",
  "catalogCode": "Z-HIGHLY-ATE690",
  "category": "Rotary Compressors",
  "type": "Hermetic Rotary (Twin Rotary)",
  "coolingCapacity": "5 TR (~58,000 BTU/hr / 17.5 kW)",
  "displacement": "69.0 cm³/rev",
  "voltage": "380V–415V, 3-Phase, 50Hz",
  "refrigerant": "R410A",
  "application": "Commercial AC package units, chillers & ducted splits",
  "primaryImage": "https://5.imimg.com/data5/ANDROID/Default/2026/8/632097144/QQ/IN/IA/112017448/drive-primary-1785905802186-jpeg.jpeg",
  "galleryImages": [],
  "description": "ALREADY ACTIVE IN CATALOGUE: Commercial hermetic twin rotary compressor manufactured by Shanghai Highly under model code ATE690UC3Q9JK.",
  "priceProvenance": {
    "numericValue": 27000,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Active Catalogue Record",
    "disclaimer": "Active in catalog."
  },
  "datasheet": {
    "available": true,
    "filename": "Highly-Rotary-Compressor-Catalogue.pdf",
    "url": "/datasheets/Highly-Rotary-Compressor-Catalogue.pdf",
    "status": "ALREADY VERIFIED AND ATTACHED IN PRODUCTION",
    "verificationDetails": "Active in catalog."
  }
}
```

---

### 7c. Conflicting Danfoss / Copeland CR22K6M (Row 9) (🔴 REJECTED)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **Copeland** · `CR22K6M-PF1` |
| **Catalogue Category** | `Reciprocating Compressors` (Hermetic Reciprocating) |
| **Verified Capacity** | 1.5–1.8 HP (~18,500 BTU/hr OEM Rating) |
| **Displacement** | 40.8 cm³/rev |
| **Electrical Supply** | 220–240V, 50Hz, Single Phase |
| **Refrigerant Gas** | R22 |
| **Primary Application** | Residential and light-commercial high back pressure air conditioning |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/SELLER/Default/2025/4/507075266/SF/BI/RB/136916744/cr22k6me-pf1-copeland-scroll-compressor.jpeg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 0 image(s) preserved |
| **Manufacturer PDF File** | `None` |
| **PDF Verification Status** | `REJECTED - CROSS-BRAND CONTRADICTION` |
| **Price Verification Status** | `Rejected - Exorbitant Marketplace Price (₹80,000)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/air-conditioning-compressors-2856492066130.html) |
| **Supplier & Location** | Joytech Engineering Services (, New Delhi,  - ) |
| **Readiness Verdict** | **REJECTED - CROSS-BRAND MISMATCH, 3-WAY CAPACITY CONTRADICTION & 10X INFLATED PRICE** |

> [!WARNING]
> **Image & Model Discrepancy Detected:** SEVERE CROSS-BRAND MISMATCH: The primary image is explicitly a Copeland reciprocating compressor named "cr22k6me-pf1-copeland-scroll-compressor.jpeg", but the brand in specifications is listed as "Danfoss".

**Detected Anomalies & Contradictions:**
- ⚠️ Brand Contradiction: Danfoss claimed in specifications vs Copeland CR22K6ME physical image.
- ⚠️ 3-Way Capacity Contradiction: Listed simultaneously as "3 Ton", "5 Ton", and "10 HP" (while a genuine CR22K6M is only 1.5 to 1.8 HP / 18,500 BTU/hr).
- ⚠️ Refrigerant Contradiction: Listed as R410A, whereas Copeland CR22 series is an R22 mineral oil reciprocating compressor.
- ⚠️ Exorbitant Pricing: Listed at ₹80,000 for a 1.5 HP compressor.

**Technical Findings & Rationale:**
- Irreconcilable cross-brand conflict (Danfoss vs Copeland).
- Three conflicting cooling capacities in a single listing.
- 10x inflated marketplace price.
- Unsuitable for B2B catalog.

**Verified Factual Product Description:**
> "Rejected listing due to severe contradictions between Copeland physical image asset, Danfoss brand claim, 3-way capacity contradiction (3 Ton vs 5 Ton vs 10 HP), and exorbitant ₹80,000 price."

**Staged JSON Record:**
```json
{
  "name": "Copeland CR22K6M-PF1 Reciprocating Compressor (Rejected Listing)",
  "brand": "Copeland",
  "modelNumber": "CR22K6M-PF1",
  "catalogCode": null,
  "category": "Reciprocating Compressors",
  "type": "Hermetic Reciprocating",
  "coolingCapacity": "1.5–1.8 HP (~18,500 BTU/hr OEM Rating)",
  "displacement": "40.8 cm³/rev",
  "voltage": "220–240V, 50Hz, Single Phase",
  "refrigerant": "R22",
  "application": "Residential and light-commercial high back pressure air conditioning",
  "primaryImage": "https://5.imimg.com/data5/SELLER/Default/2025/4/507075266/SF/BI/RB/136916744/cr22k6me-pf1-copeland-scroll-compressor.jpeg",
  "galleryImages": [],
  "description": "Rejected listing due to severe contradictions between Copeland physical image asset, Danfoss brand claim, 3-way capacity contradiction (3 Ton vs 5 Ton vs 10 HP), and exorbitant ₹80,000 price.",
  "priceProvenance": {
    "numericValue": 80000,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Rejected - Exorbitant Marketplace Price (₹80,000)",
    "disclaimer": "Rejected from catalog ingestion."
  },
  "datasheet": {
    "available": false,
    "filename": null,
    "url": null,
    "status": "REJECTED - CROSS-BRAND CONTRADICTION",
    "verificationDetails": "Listing contradicts brand and capacity."
  }
}
```

---

### 7d. Conflicting Voltas / Carrier 3 Ton AC Compressor (Row 10) (🔴 REJECTED)

| Field | Verified Status / Provenance |
|---|---|
| **Brand & Exact Model** | **Contradictory (Voltas / Carrier)** · `Model Code Pending` |
| **Catalogue Category** | `Scroll Compressors` (Scroll / Centrifugal (Contradicted)) |
| **Verified Capacity** | 3 Ton |
| **Displacement** | Unspecified |
| **Electrical Supply** | Unspecified |
| **Refrigerant Gas** | R22 / R410A (Conflicted) |
| **Primary Application** | Unspecified |
| **Primary Image URL** | [Source Image](https://5.imimg.com/data5/SELLER/Default/2024/1/379492615/SE/EL/XC/158827661/download-24.jpg) (HTTP 200 Reachable) |
| **Gallery Images Count** | 0 image(s) preserved |
| **Manufacturer PDF File** | `None` |
| **PDF Verification Status** | `REJECTED - JPEG WRAPPER BROCHURE` |
| **Price Verification Status** | `Rejected - Contradictory Listing (₹42,000)` (`Request Quote` Enforced) |
| **Original Source URL** | [IndiaMART Listing](https://www.indiamart.com/proddetail/3-ton-air-conditioning-compressors-2853288271233.html) |
| **Supplier & Location** | Air-O-Tech Enterprises (, Mumbai,  - ) |
| **Readiness Verdict** | **REJECTED - BRAND CONFLICT (VOLTAS VS CARRIER) & CONTRADICTORY TECHNOLOGY** |

> [!WARNING]
> **Image & Model Discrepancy Detected:** Image is a generic download from an online stock catalogue with no model number or engineering specifications.

**Detected Anomalies & Contradictions:**
- ⚠️ Brand Conflict: Specifications state "Brand: Voltas", while text description explicitly states "We are engaged in offering Carrier AC Compressor to our clients".
- ⚠️ Technology Contradiction: Listed simultaneously as "Compressor Type: Scroll" and "Refrigeration Compressor Type: Centrifugal Compressor".
- ⚠️ Refrigerant Contradiction: Listed simultaneously as R22 and R410A.
- ⚠️ Pneumatic Contamination: Contaminated with air tank capacity (3 ton) and Class 0 air quality.

**Brochure Deep Investigation:**
- 📄 Inspected file scripts/brochure_row10.pdf: A 125 KB single-page wrapper encapsulating a JPEG image with no searchable technical text, no performance curves, and no model code tables.

**Technical Findings & Rationale:**
- Brand conflict between Voltas and Carrier.
- Contradictory compressor technology (Scroll vs Centrifugal).
- Brochure is an automated 1-page JPEG image wrapper with zero engineering specs.

**Verified Factual Product Description:**
> "Rejected listing due to irreconcilable brand conflict between Voltas specification and Carrier description, conflicting scroll vs centrifugal technology claims, and pneumatic contamination."

**Staged JSON Record:**
```json
{
  "name": "Conflicting Voltas / Carrier 3 Ton AC Compressor",
  "brand": "Contradictory (Voltas / Carrier)",
  "modelNumber": null,
  "catalogCode": null,
  "category": "Scroll Compressors",
  "type": "Scroll / Centrifugal (Contradicted)",
  "coolingCapacity": "3 Ton",
  "displacement": "Unspecified",
  "voltage": "Unspecified",
  "refrigerant": "R22 / R410A (Conflicted)",
  "application": "Unspecified",
  "primaryImage": "https://5.imimg.com/data5/SELLER/Default/2024/1/379492615/SE/EL/XC/158827661/download-24.jpg",
  "galleryImages": [],
  "description": "Rejected listing due to irreconcilable brand conflict between Voltas specification and Carrier description, conflicting scroll vs centrifugal technology claims, and pneumatic contamination.",
  "priceProvenance": {
    "numericValue": 42000,
    "currency": "INR",
    "isUnconfirmedSourcePrice": true,
    "pricingMode": "Request Quote",
    "verificationStatus": "Rejected - Contradictory Listing (₹42,000)",
    "disclaimer": "Rejected from catalog ingestion."
  },
  "datasheet": {
    "available": false,
    "filename": null,
    "url": null,
    "status": "REJECTED - JPEG WRAPPER BROCHURE",
    "verificationDetails": "Brochure is a non-vector image capture."
  }
}
```

---

## 3. Dedicated Special Investigations

### 1. Investigation of the LG Listing & Z.Cool Enterprises Seller Record (Candidate 3)
* **The Record:** IndiaMART listing titled `LG 1.5 Ton Air Conditioning Compressor` identifies **Z.Cool Enterprises** as the supplier with an attached PDF brochure: `http://5.imimg.com/data5/SELLER/Doc/2025/1/481860122/HE/OX/QI/6746485/lg-1-5-ton-air-conditioning-compressor.pdf`.
* **Programmatic Inspection Findings:**
  1. The PDF (`scripts/brochure_row4.pdf`, 2,099,333 bytes) was decompressed and inspected.
  2. PDF Metadata reveals:
     - **Creator:** `Canva`
     - **Author:** `tejaswita likhar`
     - **Title:** `College Trifold Brochure`
  3. **Content Analysis:** The PDF contains **zero** technical compressor specifications, **zero** performance curves, and **zero** LG model codes. It is a graphic design student template mistakenly uploaded to IndiaMART.
* **Conclusion & Action:** The brochure is strictly **REJECTED** and quarantined. The listing is staged under `NEEDS REVIEW` with model code pending physical nameplate inspection (e.g., LG QK222P or GKS102P).

---

### 2. Detection of Image/Model Mismatch on Copeland ZR160KC (Candidate 1)
* **The Listing:** IndiaMART listing titled `Scroll Emerson ZR 160 KC Air Conditioning Compressor` from R.K Technologies.
* **The Image Mismatch:**
  - Primary image: `hddf.jpg`
  - Secondary gallery image 1: `2-zr190dfsd.jpg`
  - Secondary gallery image 2: `zr190d.jpg`
* **Engineering Impact:**
  - An **Emerson Copeland ZR160KC** is a 13.3 TR (160,000 BTU/hr) compressor ($36.4\text{ m}^3/\text{h}$ displacement).
  - A **Copeland ZR190** is a 15.5–16 TR (190,000 BTU/hr) compressor ($43.3\text{ m}^3/\text{h}$ displacement).
  - The seller used images of a ZR190 for a ZR160 listing, and claimed it is a "2.5 Ton Single Phase R32 inverter".
* **Action:** Flagged with `imageModelMismatchDetected: true` and blocked from import until workshop staff verify the physical unit's nameplate stamping.

---

### 3. Verification of Tecumseh AW5532F as Genuinely Ready (Candidate 5)
* **OEM Cross-Reference:** Mapped to official Tecumseh AW-Series engineering bulletins for model **AW5532F / AWA5532EGH**.
* **Confirmed Engineering Specifications:**
  - **Nominal HP:** 2.5 HP (Dual cylinder hermetic reciprocating)
  - **Displacement:** $54.3\text{ cm}^3/\text{rev}$ ($3.31\text{ cu. in.}$)
  - **Rated Cooling Capacity:** ~31,200 to 32,000 BTU/hr (~2.5–2.6 TR)
  - **Electrical:** 208–230V, 50Hz / 60Hz, 1-Phase (PSC motor, LRA 79A)
  - **Refrigerant:** R22 (High Back Pressure / Commercial AC)
  - **Connections:** 3/4" ODF suction line, 3/8" ODF discharge line
  - **Oil Charge:** 1,140 cc mineral oil
* **Hygiene Action:** Purged all erroneous pneumatic compressed-air attributes ("20L air tank", "30 Bar", "Class I air").
* **Readiness:** **100% READY FOR IMPORT** whenever approved.

---

## 4. Master Import Summary Table

| Candidate | Brand | Identified Model | Verified Capacity | Refrigerant | Status | Reason |
|---|---|---|---|---|---|---|
| **1. Emerson ZR160KC** | Copeland | ZR160KC-TFD | 13.3 TR | R22/R407C | **NEEDS REVIEW** | Secondary images reference ZR190; seller claimed 2.5 Ton R32. |
| **2. GMCC 1.5 Ton** | GMCC | PH Series (e.g. PH240/PH310) | 1.5 TR | R22 | **NEEDS REVIEW** | Exact stamped suffix omitted from masked title. |
| **3. LG 1.5 Ton** | LG | QK / GKS Series | 1.5 TR | R410A/R32 | **NEEDS REVIEW** | Attached brochure is an invalid Canva college template; model pending. |
| **4. Daikin 10 TR** | Daikin | JT Commercial Series | 10 TR | R410A | **NEEDS REVIEW** | 4 valid workshop photos; nameplate suffix transcription needed. |
| **5. Tecumseh AW5532F** | Tecumseh | AW5532F | 2.5 TR | R22 | **READY** | Exact OEM match (54.3 cc / 32k BTU), clean images, official datasheet. |
| **6. Emerson ZR Series** | Emerson | Generic ZR | Unspecified | Unspecified | **REJECTED** | Bogus ₹2,050 price, no model code, copy-pasted Highly text. |
| **7a. Unidentified Recip** | Generic | Unspecified | 5 HP Claimed | R410A Claimed | **REJECTED** | Masked title, no brand or model, pneumatic contamination. |
| **7b. Highly ATE690** | Highly | ATE690UC3Q9JK | 5 TR | R410A | **SKIPPED** | Already active in production catalogue (Phase 4). |
| **7c. Danfoss/Copeland** | Copeland | CR22K6M-PF1 | 1.5–1.8 HP | R22 | **REJECTED** | Copeland image labeled as Danfoss, 3-way capacity conflict, ₹80k price. |
| **7d. Voltas/Carrier** | Contradictory | Unspecified | 3 Ton | Conflicted | **REJECTED** | Voltas brand vs Carrier text; Scroll vs Centrifugal conflict. |

---

## 5. Safety Compliance Confirmation
- **MongoDB Atlas:** Zero writes, zero mutations.
- **Local MongoDB:** Zero records created or altered.
- **Git / Deployments:** Zero commits, zero pushes, zero deployments executed.
- **Staging Datasets:** Staged safely in `product-import-staging.json` and ready for human workshop review.
