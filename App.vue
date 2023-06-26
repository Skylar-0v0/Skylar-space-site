<script>
    import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
    export default {
        onLaunch: async function() {
            await uniIdPageInit()
        }
    }
</script>

<style>
    @import "pages/main.css";
    * {
        color: var(--color-font);
        margin: 0;
        padding: 0;
        cursor: default;
        transition-property: color, border, background;
        transition-duration: 2s;
    }
    
    body {
        background-color: var(--color-background);
    }
    
    a {
        text-decoration: none;
        cursor: pointer;
    }
</style>