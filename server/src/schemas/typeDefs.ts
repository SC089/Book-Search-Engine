import { gql } from 'graphql-tag';

export const typeDefs = gql`
    type User {
        _id: ID
        username: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: String
        user: User
    }

    type Query {
        me: User
    }

    type Mutations {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: String!): User
    }

    input BookInput {
        bookId: String!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
`;