import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

export default new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
        uri: 'http://localhost:8080/graphql',
    }),
})
