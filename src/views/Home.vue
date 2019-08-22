<template>
    <div>Home</div>
</template>

<script>
import initTheme from '@/theme'
export default {
    name: 'Home',
    mounted() {
        initTheme(this, 'blueGrey')
    }
}
</script>
