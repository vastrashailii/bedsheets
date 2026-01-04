# Bedding — Static Product Listing (Demo) (with Cart)

This demo site now includes a working, persistent shopping cart:

Features added
- Add to cart from product card
- Add to cart from Quick View modal
- Cart drawer showing items, quantities, subtotals, and total
- Increase/decrease quantity per item
- Remove individual item
- Clear cart button (with confirmation)
- Cart persisted to localStorage
- Cart count badge in header updates automatically

Files updated
- index.html — cart drawer markup, cart button
- styles.css — cart drawer and cart-related styles
- script.js — cart logic, persistence, rendering and handlers

How it works
1. Click "Add to cart" on a product card (or in the quick view modal) — the item is added with quantity 1.
2. Click the cart icon (top-right) to open the cart drawer and view items.
3. Use + / − to change quantities, or "Remove" to delete a product.
4. Click "Clear cart" to remove all items (confirmation shown).
5. Cart is saved in localStorage (key `cart_v1`) so it survives page reloads.

Run locally
1. Ensure files keep the same relative structure and the images referenced in `products.js` exist.
2. Open `index.html` in your browser.

Next improvements I can add
- Quantity selector directly on product cards
- Persist cart server-side (for logged-in users)
- Integrate real checkout flow (Stripe / payment provider)
- Add analytics tracking for cart events
- Add "added to cart" toast confirmation and animation
- Disable checkout button and show message when cart empty

If you want, I can make any of the above changes or adapt the UI to your exact design/branding.