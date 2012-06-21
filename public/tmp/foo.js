
/*
All of this is in need fo a solid refactor once I have something working.

*/


Diagram = {
  XMLNS: "http://www.w3.org/2000/svg",
  XlinkNS: "http://www.w3.org/1999/xlink",
  
  moveElement: function(elem, toX, toY) {
    elem.setAttribute("transform", "translate(" + toX + ", " + toY + ")");
  },
  scaleElement: function(elem, scaleFactor) {
    var transform = elem.getAttribute("transform");
    transform += " scale(" + scaleFactor + ")";
    elem.setAttribute("transform", transform);
  },
  
  moveComponent: function(component, toX, toY) {
    if (component && component.group) {
      Diagram.moveElement(component.group, toX, toY);
    }
  },
  scaleComponent: function(component, scaleFactor) {
    if (component && component.group) {
      Diagram.scaleElement(component.group, scaleFactor);
    }
  }
};

Diagram.Grid = function(svgDoc) {
  this.DEFAULT_CLASS_NAME = "grid";
  this.docWidth = svgDoc.documentElement.getAttribute("width");
  this.group = undefined;
  
  this.getGroup = function(numLines, className) {
    this.group = svgDoc.createElementNS(Diagram.XMLNS, "g");
    this.group.setAttribute("class", className || this.DEFAULT_CLASS_NAME);
    for (var i = 0; i < numLines; i++) {
       var offset = (this.docWidth / numLines) * (i+1);

       var hLine = svgDoc.createElementNS(Diagram.XMLNS, "line");
       hLine.setAttribute("x1", 0);
       hLine.setAttribute("y1", offset);
       hLine.setAttribute("x2", this.docWidth);
       hLine.setAttribute("y2", offset);
       this.group.appendChild(hLine);


       var vLine = svgDoc.createElementNS(Diagram.XMLNS, "line");
       vLine.setAttribute("y1", 0);
       vLine.setAttribute("x1", offset);
       vLine.setAttribute("y2", this.docWidth);
       vLine.setAttribute("x2", offset);
       this.group.appendChild(vLine);
    }
    return this.group;
  };
  
  this.add = function(lines, className) {
    var group = this.getGroup( (lines || 10), className );
    svgDoc.documentElement.appendChild(group);
  };

};

Diagram.DataCenter = function(svgDoc) {
  this.DEFAULT_CLASS_NAME = "datacenter";
  this.dcName = "blah";
  this.group = undefined;
  
  this.getGroup = function(dcId, dcName, className) {
    this.group = svgDoc.createElementNS(Diagram.XMLNS, "g");
    this.group.setAttribute("class", className || this.DEFAULT_CLASS_NAME);
    this.group.setAttribute("id", dcId);
    
    var rect = svgDoc.createElementNS(Diagram.XMLNS, "rect");
    rect.setAttribute("x", 0);
    rect.setAttribute("y", 0);
    rect.setAttribute("rx", 10);
    rect.setAttribute("ry", 10);
    rect.setAttribute("height", 200);
    rect.setAttribute("width", 200);
    this.group.appendChild(rect);
    
    var label = svgDoc.createElementNS(Diagram.XMLNS, "tspan");
    label.appendChild( svgDoc.createTextNode(dcName) );
    label.setAttribute("x", 50);
    label.setAttribute("y", 70);
    label.setAttribute("text-anchor", "start");
    
    var labelBox = svgDoc.createElementNS(Diagram.XMLNS, "text");
    labelBox.appendChild(label);
    this.group.appendChild(labelBox);
    
    return this.group;
  };
  
  this.centerPoint = function() {
    var boundingRect = this.group.getBoundingClientRect();
    var x = ( boundingRect.left + (boundingRect.width / 2) );
    var y = ( boundingRect.top + (boundingRect.height / 2) );
    return [x, y];
  };
  
  this.connectionPort = function(direction) {
    var x, y;
    var boundingRect = this.group.getBoundingClientRect();
    
    if (direction == "n") {
      x = ( boundingRect.left + (boundingRect.width / 2) );
      y = boundingRect.top;
    } else if (direction == "s") {
      x = ( boundingRect.left + (boundingRect.width / 2) );
      y = ( boundingRect.top + boundingRect.height )
    } else if (direction == "w") {
      x = boundingRect.left;
      y = ( boundingRect.top + (boundingRect.height / 2) );
    } else if (direction == "e") {
      x = boundingRect.left + (boundingRect.width);
      y = ( boundingRect.top + (boundingRect.height / 2) );
    } else {
      // WTF?
    }
    
    return [x, y];
  };
  
  this.clickedCallback = function(name) {
    return function(evt) {
      alert("Show " + name);
    };
  };

  this.add = function(id, name, className) {
    var group = this.getGroup( id, name, className);
    group.onclick = this.clickedCallback(name);
    svgDoc.documentElement.appendChild(group);
  };
};

Diagram.Cloud = function(svgDoc) {
  this.DEFAULT_CLASS_NAME = "cloud";
  this.group = undefined;
  
  this.getGroup = function(id, name, className) {
    this.group = svgDoc.createElementNS(Diagram.XMLNS, "g");
    this.group.setAttribute("class", className || this.DEFAULT_CLASS_NAME);
    this.group.setAttribute("id", id);
    
    var path = svgDoc.createElementNS(Diagram.XMLNS, "path");
    // TODO: Re-engineer at DC scale
    path.setAttribute("d", "M20.363,33.591c-0.003-0.099-0.015-0.194-0.015-0.294c0-5.58,4.521-10.102,10.101-10.102c4.108,0,7.636,2.457,9.216,5.977c0.824-0.566,1.822-0.9,2.898-0.9c2.771,0,5.024,2.204,5.113,4.955c3.983,0.34,7.081,4.205,7.081,7.284v0.666c0,3.311-3.579,6.66-7.991,6.66H23.233c-4.412,0-7.991-3.35-7.991-6.66v-0.666C15.242,37.961,17.37,34.457,20.363,33.591z");
   	this.group.appendChild(path);
    
    return this.group;
  };
  
  this.centerPoint = function() {
    var boundingRect = this.group.getBoundingClientRect();
    var x = ( boundingRect.left + (boundingRect.width / 2) );
    var y = ( boundingRect.top + (boundingRect.height / 2) );
    return [x, y];
  };
  
  this.connectionPort = function(direction) {
    var x, y, buffer = 25;
    var boundingRect = this.group.getBoundingClientRect();
    
    if (direction == "n") {
      x = ( boundingRect.left + (boundingRect.width / 2) );
      y = boundingRect.top;
    } else if (direction == "s") {
      x = ( boundingRect.left + (boundingRect.width / 2) );
      y = ( boundingRect.top + boundingRect.height )
    } else if (direction == "w") {
      x = boundingRect.left + buffer;
      y = ( boundingRect.top + (boundingRect.height / 2) );
    } else if (direction == "e") {
      x = boundingRect.left + (boundingRect.width) - buffer;
      y = ( boundingRect.top + (boundingRect.height / 2) );
    } else {
      // WTF?
      console.log("Invalid direction: " + direction);
    }
    
    return [x, y];
  };

  this.add = function(id, name, className) {
    var group = this.getGroup( id, name, className);
    svgDoc.documentElement.appendChild(group);
  };
};

Diagram.Connection = function(svgDoc) {
  this.DEFAULT_CLASS_NAME = "connection";
  this.group = undefined;
  
  this.calcPath = function(from, to, buffer) {
    var pathData, startPoint, endPoint,
        fromCoord = from.centerPoint(),
        toCoord = to.centerPoint()
    
    var distanceX = (toCoord[0] - fromCoord[0]);
    var distanceY = (toCoord[1] - fromCoord[1]);
    var isVertical = (Math.abs(distanceX) <= Math.abs(distanceY));
    
    if (distanceX > 0) {
      if (distanceY > 0) {
        // South east
        if (isVertical) {
          startPoint = from.connectionPort('s');
          endPoint = to.connectionPort('w');
          pathData = " M" + startPoint; // Starting point
          pathData += " l0,25";             // Spacer
          pathData += " l0," + (endPoint[1] - startPoint[1] - buffer - buffer); // Vertical distance minus two elbows
          pathData += " q0,25 25,25";            // Elbow
          pathData += " L" + endPoint; // End point
        } else {
          startPoint = from.connectionPort('e');
          endPoint = to.connectionPort('w');
          pathData = " M" + startPoint; // Starting point
          pathData += " l25,0";             // Spacer
          pathData += " q25,0 25,25";       // Elbow
          pathData += " l0," + (endPoint[1] - startPoint[1] - buffer - buffer); // Vertical distance minus two elbows
          pathData += " q0,25 25,25";            // Elbow
          pathData += " L" + endPoint; // End point
        }

      } else if (distanceY < 0) {
        // North east
        startPoint = from.connectionPort('e');
        endPoint = to.connectionPort('w');
        pathData = " M" + startPoint; // Starting point
        pathData += " l0,25";             // Spacer
        pathData += " q0,25 25,25";       // Elbow
        pathData += " l" + (endPoint[0] - startPoint[0] - buffer - buffer) + ",0"; // Vertical distance minus two elbows
        pathData += " q25,0 25,25";            // Elbow
        pathData += " L" + endPoint; // End point
      } else {
        // due east
        pathData = " M" + startPoint; // Starting point
        pathData += " L" + endPoint; // End point
      }
    } else if (distanceX < 0) {
      if (distanceY > 0) {
        // South west
        if (isVertical) {
          startPoint = from.connectionPort('s');
          endPoint = to.connectionPort('e');
          pathData = " M" + startPoint; // Starting point
          pathData += " l0,-25";             // Spacer
          pathData += " l0," + (endPoint[1] - startPoint[1]); // Vertical distance minus two elbows
          pathData += " q0,25 -25,25";            // Elbow
          pathData += " L" + endPoint; // End point
        } else {
          startPoint = from.connectionPort('w');
          endPoint = to.connectionPort('e');
          pathData = " M" + startPoint; // Starting point
          pathData += " l-25,0";             // Spacer
          pathData += " q-25,0 -25,25";       // Elbow
          pathData += " l0," + (endPoint[1] - startPoint[1] - buffer - buffer); // Vertical distance minus two elbows
          pathData += " q0,25 -25,25";            // Elbow
          pathData += " L" + endPoint; // End point
        }

      } else if (distanceY < 0) {
        // North west
      } else {
        // due west
        pathData = " M" + startPoint; // Starting point
        pathData += " L" + endPoint; // End point
      }
    } else {
      if (distanceY > 0) {
        // due south
        pathData = " M" + startPoint; // Starting point
        pathData += " L" + endPoint; // End point
      } else if (distanceY < 0) {
        // due north
        pathData = " M" + startPoint; // Starting point
        pathData += " L" + endPoint; // End point
      } else {
        console.log("Overlapping items can't connect");
      }
    }

        
    return pathData;
  };
  
  this.getGroup = function(from, to, id, className) {
    this.group = svgDoc.createElementNS(Diagram.XMLNS, "g");
    this.group.setAttribute("class", className || this.DEFAULT_CLASS_NAME);
    this.group.setAttribute("id", id);
    
    // Your elements here.
    var path = svgDoc.createElementNS(Diagram.XMLNS, "path");
    path.setAttribute("id", "path-" + id);
    
    var fromCoord = from.centerPoint();
    var toCoord = to.centerPoint();
        
    var pathData = this.calcPath(from, to, 25);
   
    // Test directions
    path.setAttribute("d", pathData);
    
    this.group.appendChild(path);
    
    
    // Label
    // var label = svgDoc.createElementNS(Diagram.XMLNS, "tspan");
    // label.setAttribute("id", "label-" + id);
    // label.appendChild( svgDoc.createTextNode("Some crap here") );
    // label.setAttribute("text-anchor", "start");
    // var labelBox = svgDoc.createElementNS(Diagram.XMLNS, "text");
    // labelBox.setAttribute("x", middleX + 20);
    // labelBox.setAttribute("y", middleY - 20);
    // // Only show on hover (via CSS)
    // labelBox.setAttribute("display", "none");
    // labelBox.appendChild(label);    
    // this.group.appendChild(labelBox);
    
    return this.group;
  };
  
  this.state = function(newState) {
    this.group.setAttribute("class", "connection connection-" + newState);
    var label = svgDoc.getElementById("label-" + this.group.getAttribute("id"));
    if (label && label.firstChild) {
      label.removeChild(label.firstChild);
      label.appendChild(document.createTextNode(newState));
    }
  };
  
  this.clickedCallback = function() {
    return function(evt) {
      // Your click handler here.
    };
  };
  
  this.add = function(from, to, id, className) {
    var group = this.getGroup( from, to, id, className);
    group.onclick = this.clickedCallback();
    svgDoc.documentElement.insertBefore(group, from.group);
  };
}




/* Boiler plate (for now) */

Diagram.Base = function(svgDoc) {
  this.DEFAULT_CLASS_NAME = "--class-here--";
  
  this.getGroup = function(id, className) {
    var group = svgDoc.createElementNS(Diagram.XMLNS, "g");
    group.setAttribute("class", className || this.DEFAULT_CLASS_NAME);
    group.setAttribute("id", id);
    
    // Your elements here.
    
    return group;
  };
  
  this.clickedCallback = function() {
    return function(evt) {
      // Your click handler here.
    };
  };
  
  this.add = function(id, className) {
    var group = this.getGroup( id, className);
    group.onclick = this.clickedCallback();
    svgDoc.documentElement.appendChild(group);
  };
}