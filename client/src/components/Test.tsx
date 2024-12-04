import { useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';

const TestComponent = () => {
  const client = useApolloClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await client.query({
          query: gql`
            query Me {
              me {
                _id
                username
                email
              }
            }
          `,
        });
        console.log('GraphQL Data:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [client]);

  return <div>Testing Apollo Client...</div>;
};

export default TestComponent;
