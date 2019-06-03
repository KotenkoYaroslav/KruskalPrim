function UnionFind(n) {
  this.id = [];
  this.size = [];
  this.count = n;

  for (var i = 0; i < n; i++) {
    this.id[i] = i;
    this.size[i] = 1;
  }
}

UnionFind.prototype = {
  find: function(p) {
    while (p != this.id[p]) {
      p = this.id[p];
    }
    return p;
  },
  union: function(p, q) {
    var i = this.find(p);
    var j = this.find(q);

    if (i == j) {
      return;
    }

    if (this.size[i] < this.size[j]) {
      this.id[i] = j;
      this.size[j] += this.size[i];
    } else {
      this.id[j] = i;
      this.size[i] += this.size[j];
    }

    this.count--;
  }
};
