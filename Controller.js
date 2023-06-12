const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const models = require("./models");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 8080;
app.listen(port, (req, res) => {});

//POST
app.post("/create", async (req, res) => {
  console.log(req.body);
  try {
    let reqs = await models.User.create({
      name: req.body.username,
      password: req.body.password,
      email: req.body.email,
      createdAt: new Date(),
      createdUp: new Date(),
    });
    if (reqs)
      res.send({
        success: true,
        bodyParser: reqs.id,
        message: "O usuário foi cadastrado com sucesso!",
      });
    else res.send({ success: false, message: "Erro ao criar usuário" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao criar usuario" });
  }
});

app.post("/create-enterprise", async (req, res) => {
  console.log(req.body);
  try {
    let reqs = await models.Enterprise.create({
      branch: req.body.branch,
      number: req.body.number,
      street: req.body.street,
      neighborhood: req.body.neighborhood,
      city: req.body.city,
      userId: req.body.userId,
    });
    if (reqs)
      res.send({
        success: true,
        bodyParser: reqs.id,
        message: "A empresa foi cadastrada com sucesso!",
      });
    else res.send({ success: false, message: "Erro ao criar empresa" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao criar empresa" });
  }
});

app.post("/create-orderService", async (req, res) => {
  console.log(req.body);
  try {
    let reqs = await models.Service.create({
      typeService: req.body.typeService,
      step: req.body.step,
      sector: req.body.sector,
      descriptionService: req.body.descriptionService,
      imagem: req.body.image,
      enterpriseId: req.body.enterpriseId,
      createdAt: new Date(),
      createdUp: new Date(),
    });
    if (reqs)
      res.send({
        success: true,
        bodyParser: reqs.id,
      });
    else res.send({ success: false, message: "Erro ao criar usuário" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao criar usuario" });
  }
});

//PUT
app.put("/update-fase-aceite", async(req, res) => {
  // console.log(req.body);
    const { id } = req.body;
    const fase = 2;
    try {

      const atualizarPedido = await models.Service.update(
        {step: fase},
        {where: { id }}
      )

      if(atualizarPedido) {
        return res.status(200).json({ message: "Fase atualizada", success: true});
      }
      else{
        return res.status(404).json({ message: "Ordem de serviço não existente"});
      }
    }
    catch(error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao tentar atualizar ordem de serviço"})
    }
})

app.put("/update-fase-recusa", async(req, res) => {
  // console.log(req.body);
    const { id } = req.body;
    const fase = 3;
    try {

      let atualizarPedido = await models.Service.update(
        {step: fase},
        {where: {id}}
      )

      if(atualizarPedido) {
        return res.status(200).json({ message: "Fase atualizada", success: true});
      }
      else{
        return res.status(404).json({ message: "Ordem de serviço não existente"});
      }
    }
    catch(error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao tentar atualizar ordem de serviço"})
    }
})

//GET
app.get("/read/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await models.User.findOne({
      where: {
        email: email,
      },
      include: [{
        model: models.Enterprise,
        required: true, // Defina como true se você deseja que o join seja obrigatório
      }],
    });

    if (user !== null)
    {
      const enterprises = await user.getEnterprises(); // Obter as empresas associadas ao usuário

      if (enterprises.length > 0) {
        const idEnterprise = enterprises[0].id; // Acessar o primeiro registro
        res.send({ user: user.name, idEnterprise: idEnterprise, idUser: user.id});
      }
    } 
    else res.status(404).send({ error: "Usuário não encontrado." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Erro ao buscar o usuário na base de dados." });
  }
});

app.get("/read-orderServices", async (req, res) => {
  try {
      const orderServices = await models.Service.findAll({
        where: {
          step: 1
        },
        attributes: ["id","enterpriseId", "descriptionService", "sector", "typeService", "createdAt"]
      });

      if (orderServices !== null) {
        res.send(orderServices);
      } else {
        res.status(404).send({ error: "Ordem de serviço não encontrada." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao buscar as ordens de serviço na base de dados." });
    }
});

app.get("/read-orderServicesAproved", async (req, res) => {
  try {
      const orderServices = await models.Service.findAll({
        where: {
          step: 2
        },
        attributes: ["id","enterpriseId", "descriptionService", "sector", "typeService", "createdAt"]
      });

      if (orderServices !== null) {
        res.send(orderServices);
      } else {
        res.status(404).send({ error: "Ordem de serviço não encontrada." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao buscar as ordens de serviço na base de dados." });
    }
});
