import { prisma } from "../database";
import { Luminosidade, Planta } from "@prisma/client";

export interface CreatePlantaDTO {
  nome: string;
  especie: string;
  preco: number;
  estoque: number;
  luminosidade: Luminosidade;
  petFriendly: boolean;
  regaACadaDias: number;
}

export interface UpdatePlantaDTO {
  nome?: string;
  especie?: string;
  preco?: number;
  estoque?: number;
  luminosidade?: Luminosidade;
  petFriendly?: boolean;
  regaACadaDias?: number;
}

export interface PlantaFilters {
  luminosidade?: Luminosidade;
  petFriendly?: boolean;
}

export class PlantaRepository {
  async create(data: CreatePlantaDTO): Promise<Planta> {
    return await prisma.planta.create({ data });
  }

  async findAll(filters: PlantaFilters): Promise<Planta[]> {
    return await prisma.planta.findMany({
      where: {
        luminosidade: filters.luminosidade,
        petFriendly: filters.petFriendly,
      },
    });
  }

  async findById(id: number): Promise<Planta | null> {
    return await prisma.planta.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdatePlantaDTO): Promise<Planta> {
    return await prisma.planta.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.planta.delete({
      where: { id },
    });
  }

  async decreaseEstoque(id: number, quantidade: number): Promise<Planta> {
    return await prisma.planta.update({
      where: { id },
      data: {
        estoque: {
          decrement: quantidade,
        },
      },
    });
  }

  async findAllForEstoqueValue() {
    return await prisma.planta.findMany({
      select: {
        preco: true,
        estoque: true,
      },
    });
  }
}
