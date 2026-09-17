# Nomadica — Shopify Product Setup & Publishing Guide

This guide details the exact steps and requirements for adding products to Shopify so they sync, display, and group properly on the **Nomadica Headless Next.js storefront**.

---

## Quick Reference Checklist

When creating a new product in Shopify Admin:

- [ ] **Status**: Set to **Active** (not *Draft*).
- [ ] **Sales Channels**: Ensure the **Storefront API / Custom App** channel is checked under *Publishing*.
- [ ] **Markets**: Confirm the product is published to the **Primary Market** (e.g., India).
- [ ] **Title Convention**: Name following `[Color] [Base Name]` (e.g., `White Destination Waffle Boxy Fit Tee`) for automated grouping and swatches.
- [ ] **Variants**: Add Size options (`S`, `M`, `L`, `XL`, `XXL`).
- [ ] **Inventory**: Set stock or check *"Continue selling when out of stock"*.
- [ ] **Images**: Minimum 2 images (Image 1 = Primary, Image 2 = Hover image).
- [ ] **Collections**: Assign to relevant collections (`Destination`, `Travel Quotes`, etc.).
- [ ] **Metafields (Optional)**: Link `custom.product_type_configuration` for lifestyle mockups.

---

## 1. Publishing & Visibility (Why Products Don't Show Up)

Because Nomadica is a **headless storefront** communicating via Shopify's Storefront GraphQL API, standard Shopify visibility rules apply:

### A. Product Status
* **Must be `Active`**: Products saved as `Draft` or `Archived` are completely hidden from the Storefront API.

### B. Sales Channels and Apps (Crucial)
1. On the product edit page, look at the right sidebar under **Publishing**.
2. Click **Manage** (or `...`).
3. Ensure that your **Custom App / Headless Storefront** (the app that generated `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`) is **checked/enabled**.
   > **Note**: If a product is only published to *"Online Store"* or *"Point of Sale"*, the headless Next.js frontend cannot query it.

### C. Market Availability
1. Under **Publishing** > **Markets**, verify the product is enabled for your active markets (e.g., *India - Primary Market*).
2. If excluded from the primary market, Storefront API queries without localized customer tokens will not return it.

---

## 2. Product Title & Color Swatch Grouping

Nomadica uses an intelligent client-side grouping algorithm (`utils/productGroup.ts`) that **automatically groups separate Shopify products into a single product card with interactive color swatches**.

### Recommended Naming Pattern:
```text
[Color Name] [Base Style / Graphic Name]
```

#### Examples:
* `White Destination Waffle Boxy Fit Tee`
* `Black Destination Waffle Boxy Fit Tee`
* `Pink Trekking Shirts`
* `Grey Full Hand Tee`
* `Denim Wash Boxy Fit Tees`

### How Grouping Works:
1. **Multi-color Products**: If you create `White Destination Boxy Fit Tee` and `Black Destination Boxy Fit Tee`, Nomadica detects that both share the base name `Destination Boxy Fit Tee`. They will merge into **1 product card** with both white and black color swatches.
2. **Single-color Products**: If you only have one color for a product, Nomadica still identifies the color and displays **a single selected color swatch** on the card.
3. **Supported Color Names**:
   `White`, `Black`, `Grey` / `Gray`, `Denim`, `Navy`, `Red`, `Pink`, `Brown`, `Green`, `Olive`, `Blue`, `Maroon`, `Beige`, `Cream`, `Sand`, `Khaki`, `Yellow`, `Purple`, `Lavender`, `Sage`, `Forest Green`, `Dark Gray`, `Light Blue`, `Wine Red`, etc.

---

## 3. Sizes & Inventory Configuration

Nomadica's size selector and Add-to-Cart drawer read directly from product variants.

1. In the **Variants** section, add an option named **Size**.
2. Add standard sizes:
   * `S`, `M`, `L`, `XL`, `XXL`
3. Set the price for each size variant (and optional Compare-at price for discount badges).
4. **Inventory**:
   * If tracking quantity: Enter available stock per size.
   * If pre-ordering / made-to-order: Ensure **"Continue selling when out of stock"** is checked so `availableForSale` remains `true`.

---

## 4. Media & Image Requirements

Nomadica product cards feature hover animations and lifestyle zoom:

* **Image 1 (Primary Image)**:
  * Clean front-facing product shot on a model or flat lay.
  * Square (`1:1`) or portrait (`3:4` or `4:5`) ratio, minimum `1200 x 1200 px`.
* **Image 2 (Hover Image)**:
  * Back-view, detail shot, or lifestyle photo.
  * This automatically displays when shoppers hover over the product card.
* **Additional Images**:
  * Used for the product details gallery and fullscreen lightbox.

---

## 5. Collections Assignment

Assign products to their corresponding collections so they appear on filtered category pages and collection routes:

| Collection Name | Handle | Description |
|---|---|---|
| **Destination Collection** | `destination-collection` | Landmark and city-inspired graphics |
| **Wildlife & Safari Collection** | `wildlife-and-safari` | Animals and nature themes |
| **Adventure & Trekking Collection** | `adventure-and-trekking-collections` | Mountain, hiking, and outdoor themes |
| **Travel Quotes Collection** | `travel-quotes` | Typographic and wanderlust quote prints |
| **Beach Vibes Collection** | `beach-vibes` | Coastal and ocean lifestyle designs |

---

## 6. Metafields & Lifestyle Mockups (Optional)

Nomadica supports Shopify Metaobjects for displaying 3D lifestyle mockups before color interaction:

* **Namespace & Key**: `custom.product_type_configuration`
* **Reference**: Metaobject of type `product_type_configuration`
* **Fields**:
  * `display_name`: Base title override.
  * `mockup_image`: Neutral lifestyle hero mockup image.

---

## 7. Verifying in the Storefront

After saving in Shopify Admin:

1. Visit `/shop` or the relevant collection page (e.g. `/collections/destination-collection`).
2. Verify that:
   * The product card displays with the correct price and compare-at discount pill (if set).
   * The color swatch shows up under the price (single swatch or multiple swatches).
   * Hovering over the card switches to Image 2.
   * Clicking a color swatch updates the card image and URL.
