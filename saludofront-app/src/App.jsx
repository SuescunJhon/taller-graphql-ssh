import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useLazyQuery, gql } from '@apollo/client';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const INFORMACION_QUERY = gql`
  query Query($nombre: String!) {
    enviarInformacion(nombre: $nombre)
  }
`;

function Hello() {
  const [nombre, setNombre] = useState('');
  const [getGreeting, { loading, error, data }] = useLazyQuery(INFORMACION_QUERY);

  const handleSubmit = (e) => {
    e.preventDefault();
    getGreeting({ variables: { nombre } });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formMessage">
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribe tu mensaje"
          />
        </Form.Group>
        <Button className='mt-2' variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
      {data && <h2 className='mt-3'>{data.enviarInformacion}</h2>}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Container className="my-5">
        <Row>
          <Col xs={12} md={{ span: 6, offset: 3 }}>
            <h1>Aplicación React y GraphQL</h1>
            <Hello />
          </Col>
        </Row>
      </Container>
    </ApolloProvider>
  );
}

export default App;




