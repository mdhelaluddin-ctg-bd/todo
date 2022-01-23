<template>
  <div class="hello">
    <h1>Users</h1>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { useQuery, useResult } from "@vue/apollo-composable"
import gql from "graphql-tag"

export default {
  setup () {

    const { result } = useQuery(gql`
      query {
        users {
          data {
            id
            name
          }
        }
      }
    `
    )

    const users = useResult(result, [], data => data.users.data)
    
    return { users }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
