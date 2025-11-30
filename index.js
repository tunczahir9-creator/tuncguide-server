const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Modeller JSON dosyası
const DATA_FILE = "models.json";

// Tüm modelleri getir
app.get("/models", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "File error" });
        res.json(JSON.parse(data));
    });
});

// Belirli bir modeli getir
app.get("/model/:name", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "File error" });

        const models = JSON.parse(data);
        const model = models.find(m => m.name === req.params.name);

        if (!model) return res.status(404).json({ error: "Not found" });

        res.json(model);
    });
});

// Admin Paneli
app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

// Admin POST → yeni model ekle
app.post("/admin/add", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        let models = [];

        if (!err) {
            models = JSON.parse(data);
        }

        models.push({
            name: req.body.name,
            image: req.body.image,
            product: req.body.product,
            resistor_original: req.body.resistor_original,
            resistor_new: req.body.resistor_new,
            issue: req.body.issue,
            solution: req.body.solution
        });

        fs.writeFile(DATA_FILE, JSON.stringify(models, null, 2), () => {
            res.send("<h1>Model kaydedildi ✔</h1><a href='/admin'>Geri Dön</a>");
        });
    });
});

app.listen(3000, () => console.log("Server çalışıyor: http://localhost:3000"));
