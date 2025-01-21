const express = require("express");
const sequelize = require("../backend/db/config");
const cors = require("cors");
const devisRoutes = require("./routes/devisRoutes");
const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const path = require("path");

require("dotenv").config();
const app = express();


app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api/devis", devisRoutes);
app.use("/api/devis", articleRoutes);
app.use("/api/users", userRoutes);


app.use(express.static(path.join(__dirname, "../frontend/build")));



app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
}); 

app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie !");
  } catch (error) {
    console.error("Impossible de se connecter à la base de données:", error);
    res.status(500).send("Impossible de se connecter à la base de données");
  }
});

const PORT = process.env.PORT || 5000  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});