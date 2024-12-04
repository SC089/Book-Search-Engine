import { gql } from '@apollo/client';
// Query to fetch user details
export const GET_ME = gql `
  query getMe {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        description
        authors
        image
        link
      }
    }
  }
`;
