<template>
    <v-navigation-drawer
        v-model="nav.drawer"
        absolute
        temporary
    >
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    <span>Wh</span>
                    <span class="font-weight-light">OJudge</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                    The Light, Modern, Simplistic OJ
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list nav dense>
            <v-list-item
                v-for="item in nav.items"
                :key="item.name"
                link
                :to="item.href"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import nav from '@/shared/nav'
export default {
    name: 'NavDrawer',
    data: () => ({
        nav,
    })
}
</script>
