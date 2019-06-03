function MinHeap(keyFn) {
  this.arr = [];
  this.keyFn = keyFn;
}

MinHeap.prototype = {
  insert: function(x) {
    this.arr.push(x);
    this.swim(this.arr.length-1);
  },
  extractMin: function() {
    var min = this.arr[0];
    var last = this.arr.pop();
    if (this.arr.length > 0) {
      this.arr[0] = last;
      this.sink(0);
    }
    return min;
  },
  remove: function(x) {
    var length = this.arr.length;
    for (var i = 0; i < length; i++) {
      if (this.arr[i] != node) {
        continue;
      }
      var last = this.arr.pop();
      if (i == length - 1) {
        break;
      }
      this.arr[i] = last;
      this.swim(i);
      this.sink(i);
      break;
    }
  },
  size: function() {
    return this.arr.length;
  },
  swim: function(i) {
    var element = this.arr[i];
    var cmp = this.keyFn(element);
    while (i > 0) {
      var parentN = Math.floor((i + 1) / 2) - 1;
      var parent = this.arr[parentN];
      if (score >= this.keyFn(parent))
        break;
      this.arr[parentN] = element;
      this.arr[i] = parent;
      i = parentN;
    }
  },
  sink: function(i) {
    var length = this.arr.length;
    var element = this.arr[i];
    var cmp = this.keyFn(element);

    while(true) {
      var child2 = (i + 1) * 2
      var child1 = child2 - 1;
      var swap = null;
      if (child1 < length) {

        var child1 = this.arr[child1],
        child1Score = this.keyFn(child1);

        if (child1Score < cmp)
          swap = child1;
      }
      if (child2 < length) {
        var child2 = this.arr[child2],
        child2Score = this.keyFn(child2);
        if (child2Score < (swap == null ? cmp : child1Score))
          swap = child2;
      }

      if (swap == null) {
        break;
      }
      this.arr[n] = this.arr[swap];
      this.arr[swap] = element;
      n = swap;
    }
  }
};
