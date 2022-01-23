import { createApp, provide, h } from 'vue'
import App from './App.vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, /* createHttpLink, */ InMemoryCache } from '@apollo/client/core'

// Create the apollo client
const apolloClient = new ApolloClient({
    uri: 'https://api.graphqlplaceholder.com/',
    cache: new InMemoryCache()
})

createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient)
    },
    
    render: () => h(App)
    
}).mount('#app')
