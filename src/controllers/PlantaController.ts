import { Request, Response } from "express";
import { PlantaRepository } from "../repositories/PlantaRepository";
import { Luminosidade } from "@prisma/client";

const repository = new PlantaRepository();

export class PlantaController {
  async create(req: Request, res: Response): Promise<Response> {
    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias } = req.body;

    if (!nome || !especie || preco === undefined || estoque === undefined || !luminosidade || petFriendly === undefined || !regaACadaDias) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    if (!Object.values(Luminosidade).includes(luminosidade)) {
      return res.status(400).json({ error: "Luminosidade inválida. Use SOMBRA, MEIA_SOMBRA ou SOL_PLENO." });
    }

    const planta = await repository.create({
      nome,
      especie,
      preco: Number(preco),
      estoque: Number(estoque),
      luminosidade,
      petFriendly: Boolean(petFriendly),
      regaACadaDias: Number(regaACadaDias),
    });

    return res.status(201).json(planta);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
		const { luminosidade, petFriendly } = req.query;

		const filters: any = {};

		if (luminosidade && Object.values(Luminosidade).includes(luminosidade as Luminosidade)) {
		  filters.luminosidade = luminosidade as Luminosidade;
		}

		if (petFriendly !== undefined) {
		  filters.petFriendly = petFriendly === "true";
		}

		const plantas = await repository.findAll(filters);
		return res.json(plantas);
}

  async findById(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const planta = await repository.findById(id);

    if (!planta) {
      return res.status(404).json({ error: "Planta não encontrada." });
    }

    return res.json(planta);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const existingPlanta = await repository.findById(id);
    if (!existingPlanta) {
      return res.status(404).json({ error: "Planta não encontrada." });
    }

    const planta = await repository.update(id, req.body);
    return res.json(planta);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const existingPlanta = await repository.findById(id);
    if (!existingPlanta) {
      return res.status(404).json({ error: "Planta não encontrada." });
    }

    await repository.delete(id);
    return res.status(204).send();
  }

  async vender(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const quantidade = Number(req.body.quantidade) || 1;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const planta = await repository.findById(id);
    if (!planta) {
      return res.status(404).json({ error: "Planta não encontrada." });
    }

    if (planta.estoque < quantidade) {
      return res.status(400).json({ error: "Estoque insuficiente para esta venda." });
    }

    const plantaAtualizada = await repository.decreaseEstoque(id, quantidade);
    return res.json(plantaAtualizada);
  }

  async valorTotalEstoque(req: Request, res: Response): Promise<Response> {
    const plantas = await repository.findAllForEstoqueValue();

    const valorTotalCentavos = plantas.reduce((acc, p) => acc + p.preco * p.estoque, 0);

    return res.json({
      valorTotalCentavos,
      valorTotalFormatado: `R$ ${(valorTotalCentavos / 100).toFixed(2)}`,
    });
  }
}
