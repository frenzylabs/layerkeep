/*
 *  extensions.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/06/19
 *  Copyright 2018 WessCope
 */

;(function() {

  Object.extend = function(dest, src) {
    for(var item in src) {
      dest[item] = src[item];
    }

    return dest;
  };

  // if(!Object.prototype.forEach) {
  //   Object.defineProperty(Object.prototype, 'forEach', {
  //     value: function(callback, currentArg) {
  //       if(this == null) {
  //         throw new TypeError('Not an object');
  //       }

  //       currentArg = currentArg || window;

  //       for(var key in this) {
  //         if(this.hasOwnProperty(key)) {
  //           callback.call(currentArg, this[key], key, this);
  //         }
  //       }
  //     }
  //   });
  // }

})();
