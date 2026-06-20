async function run() {
  try {
    const res = await fetch('http://localhost:3000/products/blue-oversized-tee');
    const html = await res.text();
    console.log("HTML length:", html.length);
    
    // Check for "Product Details", "Size Chart", "Shipping & Delivery", "Usage Instructions"
    const titles = [
      "Product Details",
      "Size Chart",
      "Shipping & Delivery",
      "Usage Instructions"
    ];
    
    titles.forEach(title => {
      const contains = html.includes(title);
      console.log(`Contains "${title}":`, contains);
    });
    
    // Check for "XS - 36"
    console.log(`Contains "XS - 36":`, html.includes("XS - 36"));
    // Check for trust badges
    console.log(`Contains "Thoughtful Designs":`, html.includes("Thoughtful Designs"));
    console.log(`Contains "Quality Assured":`, html.includes("Quality Assured"));
    console.log(`Contains "Secure Payments":`, html.includes("Secure Payments"));
  } catch (err) {
    console.error(err);
  }
}

run();
