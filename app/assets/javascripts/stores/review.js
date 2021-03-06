(function(root) {
  'use strict';

  var _reviews = [],
      CHANGE = "CHANGE";

  var ReviewStore = root.ReviewStore = $.extend({}, EventEmitter.prototype, {
    all: function () {
      if (_reviews) {
        return _reviews.slice(0);
      } else {
        return [];
      }
    },

    addChangeListener: function (callback) {
      this.on(CHANGE, callback);
    },

    removeChangeListener: function (callback) {
      this.removeListener(CHANGE, callback);
    },

    changed: function () {
      this.emit(CHANGE);
    },

    dispatcherID: AppDispatcher.register(function (action) {
      switch (action.actionType){
        case ReviewConstants.UPDATE_REVIEWS:
          _reviews.unshift(action.review);
          ReviewStore.changed();
          break;
        case WorkspaceConstants.ONE_WORKSPACE_RECEIVED:
          _reviews = action.workspace.reviews;
          ReviewStore.changed();
          break;
        case ReviewConstants.REVIEW_DELETED:
          var reviewIdx;
          for (var i = 0; i < _reviews.length; i++) {
            if (_reviews[i].id === action.review.id) {
              reviewIdx = i;
              break;
            }
          }

          _reviews.splice(reviewIdx,1);
          ReviewStore.changed();
          break;
      }
    })
  });
}(this));
