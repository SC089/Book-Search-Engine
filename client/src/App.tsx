import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import './App.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// Add Authorization header
const authLink = setContext(() => {
  const token = localStorage.getItem('id_token');
  console.log('Token retrieved:', token);
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Combine links
const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
