var compile = function (exr) {
    var compiled = [];
    var depthFirst = function (expr, startTime) {
        var start = startTime;
        if (expr.tag === 'note' expr.tag === 'rest') {
            start = start !== null ? start : getStartTime(compiled);
            expr.start = start;
            compiled.push(expr);
        } else if (expr.tag === 'par') {
            start = getStartTime(compiled);
            depthFirst(expr.left, start);
            depthFirst(expr.right, start);
            
        } else if (expr.tag === 'repeat') {
            for (var i = 0; i < expr.count; i++) {
                start = getStartTime(compiled);
                depthFirst(expr.section, start);    
            }
        } else {
            depthFirst(expr.left, start);
            depthFirst(expr.right, start);
            
        }
    };
    
    depthFirst(exr, null);
    console.log(compiled);
    return compiled;
};


var getStartTime = function (notes) {
    var startTime = 0;
    for (var i = 0; i < notes.length; i++) {
        if (i > 0 && notes[i].start !== notes[i-1].start) {
            startTime += notes[i].dur;
        } else if (i === 0) {
            startTime += notes[i].dur; 
        } else {
            var diff = notes[i].dur - notes[i-1].dur;
            startTime += diff > 0 ? diff : 0;
        }
    }
    
    return startTime;
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));