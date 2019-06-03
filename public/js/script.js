// Minimum Spanning Tree
// Demonstration of Prim's algorithm and Kruskal's algorithm to
// compute the minimum spanning tree of a graph.
// Source code: https://github.com/eliucs/minimum-spanning-tree
// Website: http://ericliu.cs
// Author: Eric Liu

var path;

var vertices = [];
var verticesLayer = new Layer();
var edgesLayer = new Layer();
var mstLayer = new Layer();

function onMouseDown(event) {
  verticesLayer.activate();
  path = new Path();
  path.strokeColor = 'white';

  var circle = new Path.Circle({
    center: event.point,
    radius: 7
  });

  circle.strokeColor = 'black';
	circle.fillColor = 'white';

  vertices.push(new Vertex(event.point.x, event.point.y));
};

$('#btn-compute').click(function() {
  var algo = $('#select-algo option:selected').val();

  if (typeof algo == 'undefined' || !algo) {
    return;
  }

  if (vertices.length == 0) {
    return;
  }

  // Disable computer and reset buttons until animation is finished
  $('#btn-compute').attr('disabled', true);
  $('#btn-reset').attr('disabled', true);

  if (algo == PRIM) {
    primsAlgorithm(vertices, function(mst) {
      if (!mst || typeof mst == 'undefined') {
        return;
      }
      mstLayer.activate();
      mstLayer.removeChildren();
      drawEdges(mst, 0);
    });
  } else if (algo == KRUSKAL) {
    kruskalsAlgorithm(vertices, function(mst) {
      if (!mst || typeof mst == 'undefined') {
        return;
      }
      mstLayer.activate();
      mstLayer.removeChildren();
      drawEdges(mst, 0);
    });
  }
});

// Recursively draw edges in minimum spanning tree one by one
function drawEdges(mst, i) {
  if (i >= mst.length) {
    $('#btn-compute').attr('disabled', false);
    $('#btn-reset').attr('disabled', false);
    return;
  }

  setTimeout(function() {
    var edge = mst[i];
    var a = new Point(edge.a.x, edge.a.y);
    var b = new Point(edge.b.x, edge.b.y);
    var mstPath = new Path.Line(a, b);
    mstPath.strokeColor = '#98FB98';
    mstPath.strokeWidth = 3;

    drawEdges(mst, i+1);
  }, 50);
}

$('#btn-reset').click(function() {
  verticesLayer.removeChildren();
  mstLayer.removeChildren();
  paper.view.draw();
  vertices = [];
  edges = [];
});

function primsAlgorithm(vertices, callback) {
  var mst = [];
  var mstVertices = [];

  // Initialize all adjacency lists
  for (var i = 0; i < vertices.length; i++) {
    var current = vertices[i];
    for (var j = 0; j < vertices.length; j++) {
      if (j == i) {
        continue;
      }
      current.addToAdj(new Edge(current, vertices[j]));
    }
  }

  // Find arbitrary vertex to start the algorithm, add to the minimum
  // spanning tree
  mstVertices.push(vertices[0]);

  while (mstVertices.length != vertices.length) {
    var minEdge = false;
    var minEdgeWeight = Number.MAX_VALUE;

    for (var i = 0; i < mstVertices.length; i++) {
      for (var j = 0; j < mstVertices[i].adj.length; j++) {
        var edge = mstVertices[i].adj[j];
        var vertex = edge.b;

        // Found smaller edge weight
        if (edge.weight() < minEdgeWeight) {
          // Make sure that vertex not already in MST
          if (includesVertex(mstVertices, vertex)) {
            continue;
          }

          minEdge = edge;
          minEdgeWeight = edge.weight();
        }
      }
    }

    mstVertices.push(minEdge.b);
    mst.push(minEdge);
  }

  callback(mst);
  return;
}

function kruskalsAlgorithm(vertices, callback) {
  var mst = [];
  var mstVertices = [];
  var edges = [];

  for (var i = 0; i < vertices.length; i++) {
    var current = vertices[i];
    for (var j = 0; j < vertices.length; j++) {
      if (j == i) {
        continue;
      }
      edges.push(new Edge(current, vertices[j]));
    }
  }

  var uf = new UnionFind(vertices.length);

  // This needs to be fixed by using Min Heap instead of sorting
  edges.sort(function(a, b) {
    if (a.weight() < b.weight()) {
      return -1;
    } else if (a.weight() > b.weight()) {
      return 1;
    }
    return 0;
  });

  for (var i = 0; i < edges.length; i += 1) {
    // Stop algorithm when length of MST is V-1
    if (mst.length == vertices.length - 1) {
      break;
    }

    var edge = edges[i];
    var ia = getVertexIndex(vertices, edge.a);
    var ib = getVertexIndex(vertices, edge.b);
    var incA = includesVertex(mstVertices, edge.a);
    var incB = includesVertex(mstVertices, edge.b);

    if (!includesEdge(mst, edge) &&
        (!incA || !incB) &&
         uf.find(ia) != uf.find(ib)) {

      mst.push(edge);

      // Push vertex not in mstVertices
      if (!incA) {
        mstVertices.push(edge.a);
      } else {
        mstVertices.push(edge.b);
      }

      // Add index of a and b to same union find connected component
      uf.union(ia, ib);
    }
  }

  callback(mst);
}

function includesVertex(vertices, vertex) {
  for (var i = 0; i < vertices.length; i++) {
    if (vertices[i].equals(vertex)) {
      return true;
    }
  }
  return false;
}

function includesEdge(edges, edge) {
  for (var i = 0; i < edges.length; i++) {
    if (edges[i].contains(edge.a) && edges[i].contains(edge.b)) {
      return true;
    }
  }
  return false;
}

function getVertexIndex(vertices, vertex) {
  for (var i = 0; i < vertices.length; i++) {
    if (vertices[i].equals(vertex)) {
      return i;
    }
  }
  return -1;
}
