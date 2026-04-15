const parseCSV = require("../utils/parseCSV");
const validate = require("../utils/validate");
const linkData = require("../services/linkService");

exports.handleUpload = async (req, res) => {
    try {
        const existingFile = req.files["existing"][0];
        const newFile = req.files["new"][0];
        const salesFile = req.files["sales"][0];

        const existing = await parseCSV(existingFile);
        const newData = await parseCSV(newFile);
        const sales = await parseCSV(salesFile);
        console.log("filee", existing, newData, sales)
        const validationErrors = [
            ...validate(existing, ["Component_ID", "Product_SKU"]),
            ...validate(newData, ["Component_ID"]),
            ...validate(sales, ["Product_SKU", "Sold_Qty_UOM"])
        ];

        const result = linkData(existing, newData, sales);

        res.json({
            validationErrors,
            ...result,
            preview: {
                existing: existing.slice(0, 5),
                newData: newData.slice(0, 5),
                sales: sales.slice(0, 5)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};