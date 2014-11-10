require.config({
    baseUrl: "js",
    paths: {
        $: "jquery.min",
        ZeroClipboard: "zero_clipboard/ZeroClipboard"
    },
    shim: {
        $: {
            exports: '$'
        }
    }
});
