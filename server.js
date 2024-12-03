const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const app = express();
app.use(cors());

// Datos en memoria
const products = [
    { id: 1, name: 'Cereal' },
    { id: 2, name: 'Leche' },
    { id: 3, name: 'Queso' },
    { id: 4, name: 'Mantequilla' }
];

// Esquema de GraphQL
const schema = buildSchema(`
    type Product {
        id: Int
        name: String
    }

    type Query {
        products: [Product]
        product(id: Int!): Product
    }

    type Mutation {
        addProduct(name: String!): Product
        updateProduct(id: Int!, name: String!): Product
        deleteProduct(id: Int!): Product
    }
`);

// Resolvers
const root = {
    products: () => products,
    product: ({ id }) => products.find(p => p.id === id),
    addProduct: ({ name }) => {
        const newProduct = { id: products.length + 1, name };
        products.push(newProduct);
        return newProduct;
    },
    updateProduct: ({ id, name }) => {
        const product = products.find(p => p.id === id);
        if (product) product.name = name;
        return product;
    },
    deleteProduct: ({ id }) => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            const deleted = products.splice(index, 1);
            return deleted[0];
        }
        return null;
    }
};

// Middleware de GraphQL
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

// Iniciar el servidor
app.listen(4000, () => {
    console.log('Servidor GraphQL corriendo en http://localhost:4000/graphql');
});
