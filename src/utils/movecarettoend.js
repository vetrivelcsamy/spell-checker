// https://github.com/facebook/react/issues/2047
export const moveCaretToEnd = (el) => {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.addRange(range);
    el.focus();
}
