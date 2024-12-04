import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import './App.css';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Replace with your backend's GraphQL endpoint
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
