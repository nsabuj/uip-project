let actionStack;

// NOT Used currently but could be used to save the current state of the undo/redo
// jquery before webpage is unloaded
$(window).on("beforeunload", function() {
  // save the actionStack to the local storage before the page is unloaded
  window.localStorage.setItem("actionStack", JSON.stringify(actionStack));
});

function pushAction(perform, data) {
  let returnValue;

  // We want the redo/undo call before we push a new action in case it throws an error (because the current position is already at the first or last item)
  returnValue = perform.call(this, true, data);

  // push a new action to the stack
  // data.slice(0) returns the full list but a copy of it (i.e. a new element in memory - important for modifications)
  actionStack.push(perform, data.slice(0));

  return returnValue;
}

// initializes the undo/redo stack
function initUndoRedoStack() {
  $(window).on("load", function() {
    // The code below could be used to initialize a actionStack (Undo/Redo) stack from the local storage. This is currently not used because serializing functions which is required to save the "actions" on the actionStack was too complicated/time-consuming as no good generic solution existed. An approach would be to extend JSON.stringify() to allow deep serializing and not just one level down as required for variables.
    
    // create a new UndoStack using the history
    actionStack = new UndoStack(null, {});

    // check undo and redo possibility
    checkUndoRedo();
  });
}

// modifies the ability to click the undo / redo button depending on their conditions
function checkUndoRedo() {
  // disable undo button if no action can be un-done
  if (actionStack.canUndo()) {
    $("#undoButton").removeAttr("disabled");
    $("#undoButton").removeClass("in-active");
  } else {
    $("#undoButton").attr("disabled", "disabled");
    $("#undoButton").addClass("in-active");
  }

  // disable the redo button if no action can be re-done
  if (actionStack.canRedo()) {
    $("#redoButton").removeAttr("disabled");
    $("#redoButton").removeClass("in-active");
  } else {
    $("#redoButton").attr("disabled", "disabled");
    $("#redoButton").addClass("in-active");
  }
}
