import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

export default new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
        uri: 'http://192.168.0.101:8080/graphql',
    }),
})
