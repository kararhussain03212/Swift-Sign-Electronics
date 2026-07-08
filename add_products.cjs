const fs = require('fs');
const path = require('path');

// 1. Copy images
const toolImageSrc = "C:\\Users\\Karar Hussain\\.gemini\\antigravity\\brain\\eef5a020-b3dc-4b6c-b9ab-41a87a41bf56\\new_tool_img_1783500888231.png";
const instImageSrc = "C:\\Users\\Karar Hussain\\.gemini\\antigravity\\brain\\eef5a020-b3dc-4b6c-b9ab-41a87a41bf56\\new_instrument_img_1783500898275.png";
const projImageSrc = "C:\\Users\\Karar Hussain\\.gemini\\antigravity\\brain\\eef5a020-b3dc-4b6c-b9ab-41a87a41bf56\\new_project_img_1783500906524.png";

const toolImageDest = "public/products/new_tool.png";
const instImageDest = "public/products/new_instrument.png";
const projImageDest = "public/products/new_project.png";

fs.copyFileSync(toolImageSrc, toolImageDest);
fs.copyFileSync(instImageSrc, instImageDest);
fs.copyFileSync(projImageSrc, projImageDest);

let newProducts = '';

let idCounter = 15;

function createProduct(category, brand, name, price, image) {
    let prod = {
        id: idCounter++,
        name: name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        category: category,
        brand: brand,
        price: price,
        discount: 5,
        rating: 4.8,
        reviews: 42,
        thumbnail: "/" + image,
        images: ["/" + image],
        description: "High quality professional " + category.toLowerCase() + " for electronic projects.",
        introduction: {
            overview: "A great addition to your workspace.",
            purpose: "To assist with electronic builds.",
            features: ["High durability", "Professional grade", "Easy to use"],
            applications: ["DIY projects", "Professional use"],
            advantages: ["Reliable", "Cost-effective"]
        },
        specifications: { "Weight": "500g", "Warranty": "1 Year" },
        shippingList: [{ name: name, count: 1 }],
        documents: [],
        relatedProducts: [1, 2, 3],
        stock: 50,
        SKU: "NEW-" + idCounter,
        tags: [category.toLowerCase()],
        applications: ["Electronics"]
    };
    return ',\n  ' + JSON.stringify(prod, null, 2).replace(/\n/g, '\n  ');
}

// 5 Tools
newProducts += createProduct("Tools", "Weller", "Precision Screwdriver Set Pro", 45.99, "products/new_tool.png");
newProducts += createProduct("Tools", "Hakko", "Ceramic Tweezers", 15.99, "products/new_tool.png");
newProducts += createProduct("Tools", "Knipex", "Wire Stripper Ergonomic", 35.99, "products/new_tool.png");
newProducts += createProduct("Tools", "Engineer", "Crimping Pliers", 55.99, "products/new_tool.png");
newProducts += createProduct("Tools", "Pro'sKit", "Desoldering Pump Heavy Duty", 25.99, "products/new_tool.png");

// 5 Instruments
newProducts += createProduct("Instruments", "Fluke", "Bench Multimeter Elite", 450.99, "products/new_instrument.png");
newProducts += createProduct("Instruments", "Rigol", "Digital Spectrum Analyzer", 899.99, "products/new_instrument.png");
newProducts += createProduct("Instruments", "Siglent", "Bench Power Supply 60V", 250.99, "products/new_instrument.png");
newProducts += createProduct("Instruments", "Saleae", "Logic Analyzer Pro 8", 299.99, "products/new_instrument.png");
newProducts += createProduct("Instruments", "Keysight", "Handheld LCR Meter", 399.99, "products/new_instrument.png");

// 5 Projects
newProducts += createProduct("Projects", "Arduino", "Smart Greenhouse Kit", 65.99, "products/new_project.png");
newProducts += createProduct("Projects", "SparkFun", "Weather Station IoT Kit", 85.99, "products/new_project.png");
newProducts += createProduct("Projects", "Adafruit", "Neopixel Light Display Kit", 45.99, "products/new_project.png");
newProducts += createProduct("Projects", "Raspberry Pi", "Retro Gaming Arcade Kit", 120.99, "products/new_project.png");
newProducts += createProduct("Projects", "DFRobot", "AI Camera Recognition Kit", 95.99, "products/new_project.png");

let fileData = fs.readFileSync('src/data/products.js', 'utf8');
fileData = fileData.replace(/\n\];[\s]*$/, newProducts + '\n];\n');
fs.writeFileSync('src/data/products.js', fileData);

console.log("Products added successfully");
