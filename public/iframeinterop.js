window.onmessage = (event) => {
    event.source.window.postMessage('GOT_YOU_IFRAME', '*')
}