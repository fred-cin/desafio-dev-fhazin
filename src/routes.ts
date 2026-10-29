import { Router } from "express";
import { PlantaController } from "./controllers/PlantaController";

const routes = Router();
const plantaController = new PlantaController();

// Planta routes
routes.post("/plantas", (req, res) => plantaController.create(req, res));
routes.get("/plantas", (req, res) => plantaController.findAll(req, res));
routes.get("/plantas/valor-total", (req, res) => plantaController.valorTotalEstoque(req, res));
routes.get("/plantas/:id", (req, res) => plantaController.findById(req, res));
routes.put("/plantas/:id", (req, res) => plantaController.update(req, res));
routes.delete("/plantas/:id", (req, res) => plantaController.delete(req, res));
routes.post("/plantas/:id/vender", (req, res) => plantaController.vender(req, res));

export { routes };
