# Folhagem & Cia - API

API para gerenciamento de estoque de plantas ornamentais e jardinagem, desenvolvida como parte do desafio DEV do PS do CIti 2026.2.

---

##Tecnologias Utilizadas

- **Runtime / Framework:** Node.js (v20+), Express.js, TypeScript
- **ORM / Banco de Dados:** Prisma ORM, PostgreSQL
- **Containerização:** Docker, Docker Compose
- **Ferramenta de Testes:** HTTPie

---

##Arquitectura e Estrutura

O projeto adota uma arquitectura em camadas bem definida:

```text
src/
├── controllers/    # Camada HTTP e validação de regras de negócio (PlantaController.ts)
├── repositories/   # Camada de persistência e comunicação Prisma (PlantaRepository.ts)
├── routes.ts       # Definição e registro das rotas Express
└── database.ts     # Instância e inicialização do cliente Prisma




POST	/plantas	Cadastra uma nova planta
GET	/plantas	Lista todas as plantas (suporta filtros via Query Params)
GET	/plantas/valor-total	Calcula o valor total financeiro em estoque
GET	/plantas/:id	Busca os detalhes de uma planta por ID
PUT	/plantas/:id	Atualiza os dados de uma planta existente
DELETE	/plantas/:id	Remove uma planta do acervo
POST	/plantas/:id/vender	Processa a venda e reduz a quantidade em estoque



1. Criar Planta

http POST localhost:3001/plantas \
  nome="Jiboia" \
  especie="Epipremnum aureum" \
  preco:=3500 \
  estoque:=10 \
  luminosidade="MEIA_SOMBRA" \
  petFriendly:=false \
  regaACadaDias:=4

2. Filtrar Plantas (Ex: Apenas Pet Friendly)

http GET "localhost:3001/plantas?petFriendly=true"

3. Calcular Valor Total do Estoque

http GET localhost:3001/plantas/valor-total

4. Realizar Venda de Estoque

http POST localhost:3001/plantas/1/vender quantidade:=2
