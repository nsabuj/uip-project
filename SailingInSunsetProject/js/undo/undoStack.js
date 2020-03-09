// function to create a new undo/redo item (generic type which contains the action to be undone/redone and the necessary data)
function UndoItem(perform, data) {
  this.perform = perform;
  this.data = data;
}

// function to create a new undo stack which keeps track of all undo/redo actions
function UndoStack(self, oldState) {
  const settings = oldState ? oldState : {};
  const defaultOptions = {
    stack: [],
    currentPosition: -1,
    self: null
  };

  // initialization helper
  // checks if a value exists in the old state (if not, uses the default value)
  this.stack =
    typeof settings.stack !== "undefined"
      ? settings.stack
      : defaultOptions.stack;
  this.currentPosition =
    typeof settings.currentPosition !== "undefined"
      ? settings.currentPosition
      : defaultOptions.currentPosition;
  this.self =
    typeof settings.self !== "undefined" ? settings.self : defaultOptions.self;
}

UndoStack.prototype.push = function(perform, data) {
  // increase the current position by 1 as a new action is added
  this.currentPosition++;

  // We need to invalidate all undo items after this new one or it will be really confusing
  // splice() returns all elements after the position of this.currentPosition and we will not remember it => this.stack now only contains elements before and including this.currentPosition
  this.stack.splice(this.currentPosition);

  // add the new action to the stack
  this.stack.push(new UndoItem(perform, data));
};

// Implementation of an UNDO action
UndoStack.prototype.undo = function() {
  // check that there are elements on the stack (i.e. an action that can be undone)
  if (this.canUndo()) {
    // retreive the last/previous action (i.e. the action just performed and, therefore, at the current position on the stack)
    const item = this.stack[this.currentPosition];

    // call the perform function => false = undo action
    item.perform.call(this.self, false, item.data);

    // adjust the current position on the stack to be one action before
    this.currentPosition--;
  } else {
    // throws an error if called but there are no actions that can be undone
    // this should not happen since the button should be disabled
    throw new Error("Already at oldest change");
  }
};

// Implemenation of a REDO action
UndoStack.prototype.redo = function() {
  // check if an item/action can be redone (i.e. the state is not already at the most recent action).
  if (this.canRedo()) {
    // retrieve the item at the stack position + 1 (the next action inline)
    const item = this.stack[this.currentPosition + 1];

    // redo the action (perform the action) => true = redo action
    item.perform.call(this.self, true, item.data);

    // adjust the current position on the stack one position into the future
    this.currentPosition++;
  } else {
    // throws an error if called but already at the most recent action
    // this should not happen since the button should be disabled
    throw new Error("Already at newest change");
  }
};

// function that checks if an action can be redone i.e. that we are not at the most recent action
UndoStack.prototype.canRedo = function() {
  return this.stack[this.currentPosition + 1] ? true : false;
};

// function that checks if it's possible to undo the last action i.e. if there exists a last action
UndoStack.prototype.canUndo = function() {
  return this.currentPosition >= 0 ? true : false;
};

UndoStack.prototype.invalidateAll = function() {
  this.stack = [];
  this.currentPosition = -1;
};