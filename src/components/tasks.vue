<template>
    <div class="hello">
        <h1>tasks</h1>
        <ul>
            <li v-for="task in tasks" :key="task._id">
                <span @click="onSelect(task)" style="cursor: pointer">{{ task.summary }}</span>
                <span
                    @click="onDelete(task._id)"
                    style="color: red; font-weight: bold; cursor: pointer"
                    >X</span
                >
            </li>
        </ul>
        <input v-model="taskSummary" placeholder="Task sumarry" type="text" />
        <button @click="selectedTask ? onUpdate() : onAdd()">{{ selectedTask ? 'Update' : 'Add' }}</button> <br />
        <span v-if="selectedTask" @click="onClear" style="font-size: 8px; font-style: italic; font-weight:bold; cursor: pointer;">X Clear</span>
    </div>
</template>

<script>
import { ref } from "vue";
import allTasksQuery from "../graphql/allTasks.query.gql";
import deleteOneTaskMutation from "../graphql/deleteOneTask.mutation.gql";
import insertOneTaskMutation from "../graphql/insertOneTask.mutation.gql";
import updateOneTaskMutation from "../graphql/updateOneTask.mutation.gql";
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";

export default {
    setup() {
        const taskSummary = ref("");
        const selectedTask = ref(null);

        // Get tasks
        const { result } = useQuery(allTasksQuery);
        const tasks = useResult(result, [], (data) => data.tasks);

        // Insert task
        const { mutate: insertOneTask } = useMutation(insertOneTaskMutation);
        const onAdd = () => {
            insertOneTask(
                {
                    data: {
                        _partition: "partition",
                        isComplete: false,
                        summary: taskSummary.value,
                    },
                },
                {
                    update: (cache, { data: { insertOneTask } }) => {
                        const { tasks } = JSON.parse(
                            JSON.stringify(
                                cache.readQuery({ query: allTasksQuery })
                            )
                        );
                        tasks.push(insertOneTask);
                        cache.writeQuery({
                            query: allTasksQuery,
                            data: { tasks },
                        });

                        // Reset data
                        onClear()
                    },
                }
            );
        };

        // Select a task
        const onSelect = (data) => { 
            selectedTask.value = data;
            taskSummary.value = data.summary;
        }

        // Clear selected task
        const onClear = () => {
            selectedTask.value = null;
            taskSummary.value = "";
        }

        // Insert task
        const { mutate: updateOneTask } = useMutation(updateOneTaskMutation);
        const onUpdate = () => {
            updateOneTask(
                {
                    query: {
                        _id: selectedTask.value._id
                    }, set: {
                       summary: taskSummary.value
                    },
                },
                {
                    update: (cache, { data: { updateOneTask } }) => {
                        const { tasks } = JSON.parse(
                            JSON.stringify(
                                cache.readQuery({ query: allTasksQuery })
                            )
                        );
                        const updatedData = tasks.map(
                            (task) => task._id == selectedTask.value._id ? updateOneTask : task
                        );
                        // updatedData.push(updateOneTask);
                        cache.writeQuery({
                            query: allTasksQuery,
                            data: { tasks: updatedData }
                        });

                        // Reset data
                        onClear()
                    },
                }
            );
            
        };

        // delete task
        const { mutate: deleteOneTask } = useMutation(deleteOneTaskMutation);
        const onDelete = (id) => {
            deleteOneTask(
                {
                    query: { _id: id },
                },
                {
                    update: (cache) => {
                        const { tasks } = JSON.parse(
                            JSON.stringify(
                                cache.readQuery({ query: allTasksQuery })
                            )
                        );
                        const updatedData = tasks.filter(
                            (task) => task._id !== id
                        );
                        cache.writeQuery({
                            query: allTasksQuery,
                            data: { tasks: updatedData }
                        });
                    },
                }
            );
        };

        return {
            // Variables
            selectedTask,
            taskSummary,
            tasks,

            // Methods
            onAdd,
            onSelect,
            onClear,
            onUpdate,
            onDelete,
        };
    },
};
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
