const Editor = (props) => {
    const { checkSpelling, getSuggestions, textareaRef } = props;
    return (
      <div
        contentEditable
        autoFocus
        id="spelling-checker"
        className="editor"
        spellCheck={false}
        ref={textareaRef}
        onInput={checkSpelling}
        onContextMenu={getSuggestions}
      />
    );
  };
export default Editor;  