const normalizeSKU = (sku) => {
    if (!sku) return null;
    return String(sku).trim().toUpperCase();
};

module.exports = (existing, newData, sales) => {
    const errors = [];
    const unmatched = {
        componentMismatch: [],
        skuMismatch: []
    };

    const existingMap = {};

    existing.forEach(item => {
        if (existingMap[item.Component_ID]) {
            errors.push(`Duplicate Component_ID: ${item.Component_ID}`);
        } else {
            existingMap[item.Component_ID] = item;
        }
    });

    // Merge existing + new
    const merged = [];

    newData.forEach(n => {
        const match = existingMap[n.Component_ID];

        if (!match) {
            unmatched.componentMismatch.push(n);
        } else {
            merged.push({ ...match, ...n });
        }
    });

    // Aggregate sales
    const salesMap = {};

    sales.forEach(s => {
        const sku = normalizeSKU(s.Product_SKU);
        const qty = Number(s.Sold_Qty_UOM || 0);
        if (!sku) return;

        if (!isNaN(qty)) {
            salesMap[sku] = (salesMap[sku] || 0) + qty;
        }
    });

    // Final linking
    const finalLinked = merged.map(p => {
        const sku = normalizeSKU(p.Product_SKU);

        const total = salesMap[sku];

        if (total === undefined) {
            unmatched.skuMismatch.push(p);
        }

        return {
            ...p,
            total_sales: total || 0
        };
    });

    return { errors, unmatched, finalLinked };
};