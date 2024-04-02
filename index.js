const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path'); 

const data = require("./data/data.json");
const personas = data.personas;

// Define el esquema de GraphQL
const typeDefs = gql`
  type Query {
    enviarInformacion(nombre: String!): String
  }
`;

// Define los resolvers de GraphQL
const resolvers = {
  Query: {
    enviarInformacion: (_, { nombre }) => {
      const persona = personas.find(p => p.nombre === nombre)
      if (!persona) {
        return `No se encontro información para ${nombre}`
      }
      return `Mi nombre es ${nombre}, tengo ${persona.edad} años. ${persona.informacion}`
    }
  }
};

async function startApolloServer() {
  // Crea la instancia de Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });

  // Inicia el servidor Apollo
  await server.start();

  // Crea la aplicación Express
  const app = express();

  // Aplica el middleware de Apollo Server a la aplicación Express
  server.applyMiddleware({ app, path: '/graphql' });

  // Sirve la aplicación de React desde la carpeta "saludofront-app"
   const reactAppPath = path.join(__dirname, 'saludofront-app', 'dist');
    app.use(express.static(reactAppPath));
    app.get('*', (req, res) => {
    res.sendFile(path.join(reactAppPath, 'index.html'));
    });

  // Inicia el servidor
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Servidor GraphQL ejecutándose en http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();

