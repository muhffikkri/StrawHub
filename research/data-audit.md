# AgniDrishti — Data Audit

- **Version:** 0.1
- **Research snapshot:** 15 October 2026
- **Purpose:** Assess candidate datasets for the research phase and pitching prototype before selecting a pilot region or training a model.

## 1. Executive summary

The data strategy should be built around a small number of sources that
can be inspected and reproduced:

- NASA FIRMS VIIRS and MODIS for active-fire/thermal-anomaly observations.
- Sentinel-2 for land-surface and vegetation context.
- Official Indian agricultural statistics for crop area and production.
- Historical weather data for temporal context.
- Official wheat-residue-burning monitoring reports where available.
- Government/industry buyer listings and direct verification for market feasibility.

No single source proves that a hotspot is wheat-residue burning. No
public buyer directory alone proves that a specific buyer will purchase
raw straw from a specific farm at a profitable price. These are separate
validation problems.

## 2. Candidate data inventory

| Dataset / source | Candidate fields | Spatial / temporal characteristics | Access | Intended use | Main limitations | Status / next action |
| --- | --- | --- | --- | --- | --- | --- |
| NASA FIRMS VIIRS active-fire detections | Latitude, longitude, acquisition date/time, satellite, confidence, FRP, scan/track and product metadata | Nominal 375 m pixel footprint; detection points are not exact fire boundaries; NRT and standard products available | Map/API; free MAP_KEY required for API use | Main screening layer for fire activity | Thermal anomaly is not a crop/type label; cloud and overpass gaps can miss fires; confidence needs careful interpretation | High priority: download bounded district/date samples; prefer standard-processing data for retrospective research when available |
| NASA FIRMS MODIS active-fire detections | Latitude, longitude, date/time, confidence, FRP and metadata | Nominal 1 km pixel footprint | Map/API; free MAP_KEY required | Longer historical context and comparison with VIIRS | Coarser spatial resolution; not directly equivalent to VIIRS counts | Use as supplementary history, not as a substitute for VIIRS |
| Sentinel-2 optical imagery | Multispectral bands, surface reflectance, vegetation indices, cloud mask | Four bands at 10 m; six at 20 m; three at 60 m; mission revisit is designed around 5 days at the Equator, with actual usable observations affected by clouds and acquisition coverage | Copernicus Data Space Ecosystem; open data subject to platform terms/quotas | Land cover/vegetation change and crop/harvest context | Optical observations can be obscured by clouds; imagery alone cannot establish fire cause or measure residue mass | High priority for a small candidate-area time series; verify image availability around harvest |
| Official agricultural statistics (India) | Crop area, production, yield by state and, where available, district/season | Administrative reporting; frequency and granularity depend on table | Ministry of Agriculture statistics portal and crop query portal | Estimate wheat cultivation footprint and shortlist candidate districts | Publication lags, revisions, missing district granularity, and differences between estimates/final data | High priority: document exact table, year, crop season, units, and whether figures are provisional |
| Official wheat-residue-burning monitoring reports | Reported residue-burning events/counts by district and period; method metadata if provided | Depends on the report and satellite method | ICAR/IARI or relevant government research/monitoring publication portals | Crop-specific reference and external check on FIRMS interpretation | Method, sensor, spatial unit, and reporting period must be read carefully; counts may not be comparable across sources or years | High priority: locate the latest report with a stable URL and archive the PDF/source metadata |
| Historical weather / reanalysis | Precipitation, temperature, humidity/dew point, wind, soil moisture where available | Open-Meteo documents ERA5 at 0.25° and ERA5-Land at 0.1°; ERA5-Land is still much coarser than an individual field | Open-Meteo Historical Weather API; other official/reanalysis sources may be used | Context features and retrospective analysis; not direct evidence of fire cause | Reanalysis is gridded and modeled; local microconditions may differ; weather does not prove the origin of a fire | Medium priority: use district/grid summaries and align time zones and observation dates |
| SAMARTH vendor/pellet offer directory | Vendor, state/district, plant capacity, pellet type, offered stock, continuous delivery, listed raw materials, offer dates | Company/facility listings; update/validity varies | Government of India Ministry of Power portal | Discover potential biomass industry participants and feedstock requirements | A pellet vendor or tender is not necessarily a raw-straw buyer; listings can expire and raw materials may be different from wheat straw | High priority for discovery, followed by direct verification of feedstock, price, volume, and logistics |
| SAMARTH pellet trader/aggregator directory | Trader/aggregator, location, business description, contact details | Listing-level; coverage and freshness vary | Government of India Ministry of Power portal | Identify intermediaries that may aggregate agricultural residues | Self-described profiles and listed contacts do not establish a current purchase commitment | Use as leads only; record verification date and contact outcome |
| Government biomass procurement tenders | Tender description, quantity, delivery terms, product specification, deadline | Tender-specific | SAMARTH and relevant procurement portals | Estimate industrial demand and specification requirements | Tenders may specify processed pellets, not raw wheat straw; closed tenders do not establish current demand | Extract product form, volume, delivery point, quality and date; do not treat as raw-straw price |
| Local fodder market / cattle feed buyers | Raw straw type, moisture/quality requirements, volume, farm-gate or delivered price, seasonality | Local and transaction-specific | Direct outreach/survey; public data may be limited | Compare the potentially shorter-distance local market with industrial buyers | Price and demand may be informal, seasonal, and location-specific | Required primary research; do not invent prices for the prototype |
| Farmer/field validation sample | Crop, harvest date, field area, residue condition, management decision, measured mass, sale/collection cost, buyer, outcome | Field-specific and consent-based | Survey, partner, or pilot collection | Validate satellite attribution, image categories, residue estimates, unit economics, and counterfactual | Requires consent, careful sampling, and time; self-reported intent may be biased | Needed before operational claims; for hackathon, disclose if simulated |
| Photo samples of residue | Field photos, visual condition, scale/reference, label, measured moisture/mass/contamination where relevant | Image-level; quality depends on capture protocol | Collected with consent or licensed imagery | Prototype visual categories and future computer vision training | A photo alone cannot reliably infer tonnage/moisture without calibration; domain shift across lighting/soil/camera | Define capture protocol and buyer-relevant labels before collecting a dataset |

## 3. Source details and access

### 3.1 NASA FIRMS

- Map and caveats: https://firms.modaps.eosdis.nasa.gov/map2/
- Fire-alert notes: https://firms2.modaps.eosdis.nasa.gov/alerts/notes.php
- Area API: https://firms2.modaps.eosdis.nasa.gov/api/area/
- MAP_KEY: https://firms.modaps.eosdis.nasa.gov/api/map_key/
- API tutorial: https://firms2.modaps.eosdis.nasa.gov/content/academy/data_api/firms_api_use.html

Important details:

- VIIRS has a nominal 375 m pixel footprint, while MODIS has a nominal 1 km footprint.
- The displayed footprint is not a precise fire boundary and does not mean the whole pixel is burning.
- Detections can represent fire, hot smoke, agricultural or other thermal sources.
- Cloud cover and satellite overpass timing can cause missed detections.
- Acquisition times are in UTC in FIRMS products; convert consistently when aligning with local harvest calendars.
- The FIRMS API requires a free MAP_KEY. API request limits and product availability should be checked before designing a recurring pipeline.
- For retrospective science use, record the product/version and prefer standard-processing products when available, since near-real-time products may be reprocessed.

### 3.2 Sentinel-2

- Official overview: https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2
- Data access portal: https://dataspace.copernicus.eu/
- Explore imagery: https://dataspace.copernicus.eu/explore-data

Sentinel-2 provides optical multispectral imagery suitable for
vegetation and land-surface monitoring. The nominal band resolutions are
10 m, 20 m, and 60 m. It can help characterize agricultural context and
changes around harvest, but it should not be treated as definitive
evidence of crop type, residue quantity, or fire cause without
validation. Check cloud cover and usable observations for the chosen
date range.

### 3.3 Crop statistics

- Agricultural Statistics at a Glance: https://desagri.gov.in/document-report-category/agriculture-statistics-at-a-glance/
- Crop query portal: https://data.desagri.gov.in/website/apy-query-report-crop-season-web

Use official crop-area and production tables to screen candidate
regions. Keep state-level and district-level values separate. Record the
crop year, reporting status, units, table number, and retrieval date. Do
not infer residue tonnage directly from wheat production without a
documented residue-to-grain ratio and local assumptions.

### 3.4 Weather

- Open-Meteo Historical Weather API: https://open-meteo.com/en/docs/historical-weather-api

The service documents historical reanalysis including ERA5 and
ERA5-Land. ERA5-Land's nominal 0.1° grid is still coarse relative to
individual fields. Weather is contextual information for risk analysis,
not proof that a hotspot is agricultural or intentional. Preserve units,
timestamp, timezone, and the exact product/model used.

### 3.5 Buyer and industrial demand discovery

- SAMARTH vendor details: https://samarth.powermin.gov.in/account/vendordetails
- SAMARTH aggregator listings: https://samarth.powermin.gov.in/account/pellettraderaggregator
- SAMARTH tenders: https://samarth.powermin.gov.in/home/tenders

These are useful starting points for discovering biomass market
participants and industrial procurement signals. The product form
matters: a tender for biomass pellets is not automatically a tender for
raw wheat straw. For each lead, verify:

- accepted raw feedstock and whether wheat straw is accepted;
- required processing and quality specifications;
- purchase quantity and minimum delivery;
- price basis (farm-gate, collection point, or delivered);
- season and contract validity;
- collection, storage, baling, moisture, and transport responsibilities;
- evidence that the contact/offer is current.

## 4. Minimum data model for the research phase

The research prototype should use a compact, auditable schema. It does
not need a production database yet.

### `fire_observations`

- `observation_id`
- `source` (e.g., VIIRS_NRT, VIIRS_SP, MODIS_SP)
- `latitude`, `longitude`
- `acquired_at_utc`
- `confidence` (preserve original source meaning)
- `frp`
- `product_version`
- `source_url_or_file`
- `ingested_at`

### `agricultural_context`

- `area_id` / grid identifier
- `admin_region`
- `crop`
- `crop_year` / `season`
- `crop_area`
- `harvest_window_start`, `harvest_window_end`
- `land_cover_source`
- `imagery_date`
- `cloud_or_quality_flag`

### `event_labels`

- `observation_id` or area/time key
- `label` (`probable_wheat_residue_burning`, `other_likely_source`, `unknown`)
- `label_source`
- `evidence_level`
- `reviewer_or_method`
- `notes`

Do not label every FIRMS hotspot on agricultural land as confirmed
wheat-residue burning. `Unknown` is a valid and necessary label.

### `buyer_leads`

- `buyer_id`
- `buyer_type` (`local_fodder`, `aggregator`, `biomass_processor`, `industrial_user`)
- `location`
- `accepted_feedstock`
- `raw_straw_accepted`
- `required_form_or_processing`
- `quality_specification`
- `minimum_volume`
- `price_basis`
- `quoted_price`
- `transport_responsibility`
- `offer_valid_from`, `offer_valid_to`
- `verification_status`
- `last_verified_at`
- `source`

### `economics_scenarios`

- `scenario_id`
- `residue_mass_t`
- `payment_to_farmer`
- `collection_cost`
- `baling_or_processing_cost`
- `storage_cost`
- `transport_cost`
- `platform_or_service_cost`
- `farmer_net`
- `buyer_value`
- `buyer_margin`
- `assumptions`
- `scenario_type` (`observed`, `derived`, `illustrative`)

### `prototype_transactions`

- `transaction_id`
- `farmer_or_demo_profile`
- `buyer_id`
- `offered_mass`
- `offered_price`
- `pickup_status`
- `verified_mass`
- `payment_status`
- `transaction_status`
- `is_simulated`
- `impact_estimate_status`

For a static pitching prototype, all transaction records should include
`is_simulated=true` unless they represent real, verified transactions.

## 5. Quality, leakage, and validation controls

### Fire attribution

- Keep thermal anomaly observations separate from inferred cause labels.
- Use an independent source or reviewed sample to validate labels.
- Track `unknown` rather than forcing all points into a positive/negative class.
- Compare sensor products carefully; VIIRS and MODIS have different resolution and detection behavior.
- Record product versions and whether data is NRT or standard processing.

### Forecast evaluation

- Create time-aware training/test partitions; do not randomly split nearby observations if this creates temporal leakage.
- Use only data available at the forecast issuance time.
- Compare with a simple historical/seasonal baseline before testing XGBoost.
- Report precision, recall, PR-AUC, false positives, calibration, and operational burden.
- Treat any target such as 70% recall as an experimental objective, not an existing performance claim.

### Image classification

- Define labels from buyer decisions and field measurements, not purely aesthetic visual differences.
- Collect representative photos across soil, lighting, camera, harvest methods, and residue conditions.
- Keep a held-out test set from different fields/dates where possible.
- Never display exact tonnage, moisture, or price as image-derived facts without calibration.

### Economics

- Compare with the farmer's real alternative, including existing local sales and uses.
- Separate observed price quotes from assumptions.
- Include collection, baling, storage, loading, and transport costs.
- Test sensitivity to distance, mass, moisture, price, minimum volume, and season.
- Do not claim a transaction is viable unless both farmer-side and buyer-side economics are plausible.

### Environmental impact

- Track mass collected separately from mass believed to be diverted from burning.
- Make the counterfactual assumption explicit.
- Apply emissions factors by residue type and pollutant; do not turn a general crop-burning health estimate into a project-specific avoided-emissions number.
- Label results as verified operational metrics or estimated environmental impacts.

## 6. Data acquisition plan

### Phase A — Quick feasibility sample

1. Choose 2–4 candidate districts based on wheat production and access to official residue-burning records, without committing to a pilot.
2. Download a small, documented sample of VIIRS observations for harvest windows across several years; include standard and NRT products only if their roles are clearly separated.
3. Find available Sentinel-2 scenes before and after harvest for a subset of locations.
4. Collect official crop statistics at the finest reliable administrative level.
5. Record all missing fields, coverage gaps, and source-version differences.

### Phase B — Independent validation

1. Find wheat-residue-specific monitoring reports and extract their method and spatial unit.
2. Compare their reported events with FIRMS observations in space and time.
3. Sample matched non-event agricultural periods/areas to estimate false positives and selection bias.
4. If feasible, obtain ground reports, survey records, or partner observations for a subset.
5. Keep the attribution label and evidence level explicit.

### Phase C — Market validation

1. Shortlist local fodder buyers and biomass aggregators/processors.
2. Verify raw wheat-straw acceptance, required quality, quantity, price basis, seasonality, and transport terms.
3. Build at least low/base/high cost scenarios for collection and transport.
4. Reject or flag buyer matches with unverified acceptance or negative economics.
5. Use simulated offers only for the visual demo and label them clearly.

## 7. Data audit status at this version

| Area | Status | Confidence |
| --- | --- | --- |
| NASA FIRMS product characteristics and API availability | Official documentation located | High for product description; not yet audited for a specific district/time range |
| Sentinel-2 access and nominal resolution | Official Copernicus documentation located | High for mission characteristics; actual scene/cloud availability not yet checked |
| India crop statistics portal | Official portal located | High for source identity; district-level completeness and exact tables still need checking |
| Wheat-residue-specific fire reference | Research lead identified; exact latest bulletin and stable URL still need to be archived | Incomplete |
| Weather source | Historical API documentation located | High for documented product description; fit for specific district/date range not yet tested |
| Industrial biomass buyer leads | Official SAMARTH listings and tenders located | Medium for market discovery; low for verified raw wheat-straw demand in a selected pilot area |
| Local fodder market | No district-specific price/volume dataset validated yet | Incomplete |
| Field-calibrated residue image/tonnage dataset | Not yet assembled | Incomplete |
| Causal intervention effect | No AgniDrishti intervention trial exists | Not established |

## 8. Reference links

1. NASA FIRMS: https://firms.modaps.eosdis.nasa.gov/map2/
2. NASA FIRMS notes: https://firms2.modaps.eosdis.nasa.gov/alerts/notes.php
3. NASA FIRMS area API: https://firms2.modaps.eosdis.nasa.gov/api/area/
4. NASA FIRMS API MAP_KEY: https://firms.modaps.eosdis.nasa.gov/api/map_key/
5. Copernicus Sentinel-2: https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2
6. Copernicus Data Space Ecosystem: https://dataspace.copernicus.eu/
7. Government of India Agricultural Statistics at a Glance: https://desagri.gov.in/document-report-category/agriculture-statistics-at-a-glance/
8. Government of India crop query portal: https://data.desagri.gov.in/website/apy-query-report-crop-season-web
9. Open-Meteo Historical Weather API: https://open-meteo.com/en/docs/historical-weather-api
10. SAMARTH vendor details: https://samarth.powermin.gov.in/account/vendordetails
11. SAMARTH aggregators: https://samarth.powermin.gov.in/account/pellettraderaggregator
12. SAMARTH tenders: https://samarth.powermin.gov.in/home/tenders
13. Lopes et al. (2023), wheat-residue burning study: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0296059
14. Lan et al. (2022), crop-residue burning air-quality impacts: https://www.nature.com/articles/s41467-022-34093-z

---

**Status:** Initial audit. This is not a guarantee of data availability,
a selected pilot district, a validated model, or verified market demand.
