# AgniDrishti — Evidence Brief

- **Version:** 0.1
- **Research snapshot:** 15 October 2026
- **Purpose:** Establish the problem evidence, test core assumptions, and define what the pitching prototype may responsibly claim.

## 1. Executive summary

AgniDrishti proposes to reduce agricultural residue burning by linking
satellite-based risk intelligence with economically viable residue
collection and buyer matching. The concept is plausible, but it should
not assume that all satellite hotspots are crop-residue fires, that
burning is always the cheapest option, or that every buyer of biomass
products will accept raw wheat straw.

The strongest initial evidence located is a peer-reviewed study of 301
farmers in Karnal, Haryana, covering the 2018 rice and 2019 wheat
harvests. The study reports that wheat-residue burning occurred despite
positive estimated net benefits for some non-burning alternatives. It
identifies combine-harvester use, costly alternatives, and social
practice as relevant factors. This supports a problem framing around
operational friction, habits, market access, and coordination — not the
blanket claim that burning is always the cheapest method.

Satellite active-fire data can support spatial and temporal screening,
but it does not independently establish the cause of a hotspot or
identify the responsible farmer. A credible workflow must combine
thermal anomalies with crop/land-use context, harvest timing, satellite
imagery, and independent validation.

The business proposition is not yet proven. Industrial biomass demand
exists, but evidence of demand for pellets does not establish demand for
raw wheat straw at a specific farm location. Buyer requirements,
feedstock acceptance, price, volume, seasonal demand, processing, and
transport costs must be checked before claiming a viable market.

**Current recommendation:** proceed with an evidence-backed interactive
prototype, while treating location-specific risk scores, image-based
residue grading, offers, completed transactions, and avoided emissions
as simulated unless directly supported by measured data.

## 2. Problem statement

Post-harvest wheat residue can be used as livestock fodder, sold,
incorporated into soil, or managed through other practices. However, a
subset of farmers still burn residue. The decision may be influenced by
harvesting practices, available time, collection and machinery costs,
existing habits, access to buyers, and logistics.

AgniDrishti's hypothesis is that a portion of residue burning can be
prevented when a farmer has a timely, convenient, and financially viable
alternative. The platform would combine:

1. Remote sensing and agricultural context to identify areas warranting further attention.
2. Farmer confirmation and residue registration.
3. Transparent calculation of the net economics of collection and sale.
4. Matching with verified buyers and logistics providers.
5. Transaction verification and careful environmental-impact estimation.

This is a hypothesis to test, not an established causal claim.

## 3. Evidence table

| Claim or question | Evidence located | What it supports | Limitations / implications |
| --- | --- | --- | --- |
| Wheat-residue burning occurs in India | Lopes, Tasneem & Viriyavipart (2023), survey of 301 farmers in Karnal, Haryana, based on 2018–2019 harvests | A little under one-third of the sample reported burning wheat residue in the previous five years | One district, selected farmer sample, historical period; do not generalize the percentage to all India or to a new pilot district |
| Burning is always the cheapest residue-removal option | The same study estimates positive net benefits for some non-burning alternatives; machine removal averaged INR 1,642/acre and manual removal INR 3,153/acre in the study | The "burning is always cheapest" claim is not supported | These are local historical survey values, not current prices and not a complete national comparison |
| Combine harvesting and alternative costs may matter | Among surveyed wheat-residue burners, 77.08% identified combine harvesters as the main reason, 17.94% cited expensive alternatives, and 2.66% cited no other use | Operational timing and management practices are relevant intervention hypotheses | Responses are from the studied sample and should not be treated as universal causal weights |
| Wheat straw has alternative uses | In the study, over 90% reported wheat straw commonly used as cattle fodder; 39% sold some residue and 52% reincorporated some into soil | A market and non-market uses already exist | Use categories can overlap; local surplus and buyer demand must be measured |
| Crop-residue burning contributes to air pollution and health burdens | Lan et al. (2022), *Nature Communications*, modeled Indian crop-residue-burning air-quality impacts for 2003–2019 | Supports the general environmental rationale for reducing residue burning | The headline health estimates concern crop-residue burning broadly, not only wheat or AgniDrishti's hypothetical transactions |
| Satellite fire detections can identify exact crop-residue burning | NASA FIRMS documentation describes detections as active fires/thermal anomalies that may have several sources; clouds can hide detections | FIRMS is useful for screening and retrospective analysis | FIRMS alone cannot prove a hotspot is wheat-stubble burning or identify a farmer |
| Biomass industry is a possible buyer segment | India's Ministry of Power SAMARTH portal lists pellet vendors, feedstock descriptions, offers, and tenders | A starting point for discovering market participants and industrial demand signals | Pellet offers/tenders do not prove a buyer accepts raw wheat straw from a given district, at a viable farm-gate price |
| AgniDrishti will reduce burning | No intervention trial has been conducted for this concept | This is the intended impact hypothesis | Must be tested with verified collection data and an appropriate comparison; do not claim causal impact from transactions alone |

### Key source: wheat-residue management study

Lopes, A. A., Tasneem, D., & Viriyavipart, A. (2023). "Determinants of
wheat residue burning: Evidence from India." *PLOS ONE*, 18(12),
e0296059.

- Article: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0296059
- Full text: https://pmc.ncbi.nlm.nih.gov/articles/PMC10756511/
- DOI: https://doi.org/10.1371/journal.pone.0296059

Important reported values from the paper:

- Survey: 301 farmers in Karnal, Haryana; rice and wheat harvests in 2018 and 2019.
- Slightly less than one-third reported wheat-residue burning during the previous five years.
- Among wheat-residue burners, stated main reasons: combine harvester 77.08%; expensive alternatives 17.94%; no other use 2.66%; other 2.33%.
- More than 90% reported wheat straw commonly used as cattle fodder; 39% sold some residue and 52% reincorporated some into soil.
- Average reported residue yield: 14.87 quintals/acre; average selling price: INR 332.54/quintal; average manual removal cost: INR 3,153/acre; average machinery removal cost: INR 1,642/acre.
- The authors caution against broad generalization because the study covers one district and a limited period.

Do not use these 2019 survey values as current quotes. They are
contextual evidence and a basis for identifying variables to collect
locally.

### Key source: environmental impacts

Lan, R. et al. (2022). "Air quality impacts of crop residue burning in
India and mitigation alternatives." *Nature Communications*, 13, 6537.

- Article: https://www.nature.com/articles/s41467-022-34093-z
- Full text: https://pmc.ncbi.nlm.nih.gov/articles/9663555/

The study estimates health impacts associated with
agricultural-residue-burning emissions across India during 2003–2019.
Its estimates are modeled and cover crop-residue burning broadly. They
should not be represented as wheat-only effects or as direct evidence of
impact from an unimplemented AgniDrishti intervention.

## 4. Core hypotheses and how to test them

### H1 — Some wheat-residue burning can be identified before it occurs

**Test:** Build a retrospective dataset using fire detections,
crop/land-use context, harvest timing, weather, and time-series imagery.
Define the target at a defensible spatial unit (e.g., grid or village),
not a precise field if the data cannot support that precision. Evaluate
prospective forecasts using only information available at forecast time.

**Evidence required:** Independently verified positive and negative
examples, temporal holdout testing, and comparison against a simple
seasonal/historical baseline.

### H2 — A market-linked intervention can improve the farmer's available options

**Test:** Collect real buyer specifications, prices, minimum volumes,
pickup terms, and logistics costs. Calculate farmer net revenue compared
with the farmer's actual alternative — not compared with zero revenue.

**Evidence required:** A buyer that explicitly accepts the relevant raw
material or a documented processing pathway; a credible volume and
collection plan; transparent cost assumptions.

### H3 — The transaction can be profitable for both farmer and buyer

Farmer-side calculation:

`Farmer net = payment received − costs borne by farmer`

Buyer-side calculation:

`Buyer margin = value of usable material or derived product − purchase cost − logistics − processing − handling`

**Test:** Perform sensitivity analysis over price, volume, distance,
moisture/quality, collection costs, and buyer yield. If no plausible
scenario works, the proposed transaction should not be recommended.

### H4 — Collected residue reduces burning and pollution

**Test:** Verify the mass collected and establish whether the material
would otherwise plausibly have been burned. Use a comparison design or a
defensible counterfactual to estimate additionality. Apply suitable
published emission factors only after the residue type and
counterfactual are established.

**Evidence required:** Weighing/collection records, pre-intervention
farmer intent or comparison data, and a transparent emissions method.

### H5 — Photo-based classification is useful for the transaction

**Test:** Define categories around decisions that matter to buyers, then
collect labeled images paired with field measurements (mass, moisture,
contamination, form). Compare model output with measurements and human
ratings.

**Limitations:** A normal photograph cannot reliably determine mass or
moisture without calibration and additional information. The first
prototype should present a provisional visual category and a range, not
an unsupported exact tonnage or price.

## 5. Proposed MVP evidence gates

1. **Problem gate:** cite a peer-reviewed study and official or independently validated records for the chosen crop/region.
2. **Remote-sensing gate:** show a real sample of FIRMS data and document the limitations of hotspot attribution.
3. **Agriculture gate:** verify crop calendar and agricultural land context for candidate regions.
4. **Market gate:** identify at least one plausible buyer pathway and verify raw feedstock acceptance, quality, volume, and logistics.
5. **Unit-economics gate:** show at least one transparent, sensitivity-tested scenario that could benefit both sides.
6. **Prototype gate:** distinguish observed data from illustrative or simulated data in every dashboard.
7. **Impact gate:** label avoided burning and emissions as estimates until a defensible counterfactual exists.

## 6. Claims permitted in the pitching prototype

**Reasonable claims**

- Satellite observations can help screen locations for further investigation.
- Published research documents wheat-residue burning in at least one Indian study region.
- Crop-residue burning contributes to air-quality and health burdens.
- A buyer-coordination mechanism is a plausible intervention worth testing.
- AgniDrishti is designed to connect risk intelligence with economically viable residue utilization.

**Claims to avoid unless new evidence is collected**

- Every hotspot is wheat-stubble burning.
- The system knows which farmer will burn.
- Burning is always the cheapest option.
- All biomass/pellet plants buy raw wheat straw.
- A predicted hotspot is a verified future fire.
- Every ton sold was diverted from burning.
- A fixed quantity of emissions or health impacts has already been avoided.
- Model recall or accuracy is a proven percentage before evaluation.

## 7. Immediate research tasks

1. Download a bounded sample of NASA FIRMS VIIRS standard-processing and near-real-time data for several candidate districts and relevant harvest periods.
2. Find the most recent official wheat-residue-specific fire monitoring bulletin and record its method, geography, period, and caveats.
3. Collect district-level wheat area/production data from official Indian agriculture statistics sources.
4. Compare candidate districts only after the fire, crop, and buyer evidence is assembled.
5. Contact or verify buyer listings; distinguish pellet buyers from raw straw buyers.
6. Build a simple spreadsheet model for farmer net revenue, buyer margin, and transport sensitivity.
7. Decide which prototype values are real, derived, illustrative, or simulated.

## 8. References and data portals

1. Lopes et al. (2023), PLOS ONE: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0296059
2. Lan et al. (2022), Nature Communications: https://www.nature.com/articles/s41467-022-34093-z
3. NASA FIRMS map and data caveats: https://firms.modaps.eosdis.nasa.gov/map2/
4. NASA FIRMS fire-alert notes: https://firms2.modaps.eosdis.nasa.gov/alerts/notes.php
5. NASA FIRMS API area documentation: https://firms2.modaps.eosdis.nasa.gov/api/area/
6. NASA FIRMS MAP_KEY registration: https://firms.modaps.eosdis.nasa.gov/api/map_key/
7. Copernicus Sentinel-2 data overview: https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2
8. Copernicus Data Space Ecosystem: https://dataspace.copernicus.eu/
9. Government of India Agricultural Statistics at a Glance: https://desagri.gov.in/document-report-category/agriculture-statistics-at-a-glance/
10. Government of India crop query portal: https://data.desagri.gov.in/website/apy-query-report-crop-season-web
11. Ministry of Power SAMARTH vendor details: https://samarth.powermin.gov.in/account/vendordetails
12. Ministry of Power SAMARTH aggregator listings: https://samarth.powermin.gov.in/account/pellettraderaggregator
13. Ministry of Power SAMARTH tenders: https://samarth.powermin.gov.in/home/tenders
14. Open-Meteo Historical Weather API documentation: https://open-meteo.com/en/docs/historical-weather-api

---

**Status:** Research baseline only. This document does not certify a
selected pilot district, operational model performance, current market
prices, or causal impact.
