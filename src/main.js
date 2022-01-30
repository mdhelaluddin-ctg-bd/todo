import {
    createApp,
    provide,
    h
} from 'vue'
import App from './App.vue'
import {
    DefaultApolloClient
} from '@vue/apollo-composable'
import {
    ApolloClient,
    HttpLink,
    InMemoryCache
} from '@apollo/client/core'
import * as Realm from "realm-web"

const realmApp = new Realm.App({
    id: "vue-apollo-graphql-hdudn"
});

// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
    // Guarantee that there's a logged in user with a valid access token
    if (!realmApp.currentUser) {
        // If no user is logged in, log in an anonymous user. The logged in user will have a valid
        // access token.
        await realmApp.logIn(Realm.Credentials.apiKey(process.env.VUE_APP_TOTO_APP_AUTH_API_KEY));
    } else {
        // An already logged in user's access token might be stale. To guarantee that the token is
        // valid, we refresh the user's custom data which also refreshes their access token.
        await realmApp.currentUser.refreshCustomData();
    }
    return realmApp.currentUser.accessToken
}

// Create the apollo client
const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: 'https://ap-south-1.aws.realm.mongodb.com/api/client/v2.0/app/vue-apollo-graphql-hdudn/graphql',
        fetch: async (uri, options) => {
            const accessToken = await getValidAccessToken();
            options.headers.Authorization = `Bearer ${accessToken}`;
            return fetch(uri, options);
        },

    }), // 'https://api.graphqlplaceholder.com/',
    cache: new InMemoryCache()
})

createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App)
}).mount('#app')