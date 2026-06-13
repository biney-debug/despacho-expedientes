require("dotenv").config();
const express = require("express");
const cors = require("cors");
const expedientesRouter = require("./routes/expedientes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/expedientes", expedientesRouter);

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
