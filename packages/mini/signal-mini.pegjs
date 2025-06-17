/*
signal-mini.pegjs - Signal notation grammar for Strudel
This extends mini notation concepts to continuous signals
*/

{
  var SignalNode = function(type, params, ops) {
    this.type_ = "signal";
    this.signal_type = type;
    this.parameters = params || {};
    this.operations = ops || [];
    this.location_ = location();
  }
  
  var SignalOp = function(type, value) {
    this.type = type;
    this.value = value;
  }
  
  var SignalExpr = function(left, op, right) {
    this.type_ = "signal_expr";
    this.left = left;
    this.operator = op;
    this.right = right;
  }
}

start = signal_expression

// Signal expressions (with operator precedence)
signal_expression = _ expr:additive _ { return expr; }

additive = left:multiplicative ops:(_ ("+" / "-") _ multiplicative)* {
  return ops.reduce((acc, [, op, , right]) => 
    new SignalExpr(acc, op, right), left);
}

multiplicative = left:primary ops:(_ ("*" / "/" / "&") _ primary)* {
  return ops.reduce((acc, [, op, , right]) => 
    new SignalExpr(acc, op, right), left);
}

primary = signal / number / "(" _ expr:signal_expression _ ")" { return expr; } / composite

// Basic signal definition
signal = "~" type:signal_type params:signal_params? ops:signal_op* {
  return new SignalNode(type, params, ops);
}

// Signal types
signal_type = 
  "sine" / "sin" /
  "saw" / "sawtooth" /
  "square" / "sqr" /
  "tri" / "triangle" /
  "noise" / "white" /
  "pink" /
  "perlin" /
  "env" /
  "lfo" /
  "ramp" /
  "exp"

// Signal parameters
signal_params =
  // Frequency parameter
  ":" freq:number { return { frequency: freq }; }
  // Envelope parameters
  / "(" _ a:number _ "," _ d:number _ "," _ s:number _ "," _ r:number _ ")" {
    return { attack: a, decay: d, sustain: s, release: r };
  }
  // Generic parameter list
  / "(" _ params:param_list _ ")" { return { params: params }; }

param_list = first:number rest:(_ "," _ number)* {
  return [first].concat(rest.map(r => r[3]));
}

// Signal operations (chained modifiers)
signal_op =
  // Modulation target
  "->" _ target:identifier { 
    return new SignalOp("modulate", target); 
  }
  // Parameter routing
  / _ ">>" _ param:identifier { 
    return new SignalOp("route", param); 
  }
  // Value mapping
  / ".range(" _ min:number _ "," _ max:number _ ")" {
    return new SignalOp("range", { min: min, max: max });
  }
  // Time scaling
  / ".slow(" factor:number ")" {
    return new SignalOp("slow", factor);
  }
  / ".fast(" factor:number ")" {
    return new SignalOp("fast", factor);
  }

// Composite signal patterns
composite = 
  // Signal stack
  "[" _ first:signal_expression rest:(_ "," _ signal_expression)* _ "]" {
    return {
      type_: "signal_stack",
      signals: [first].concat(rest.map(r => r[3]))
    };
  }
  // Signal sequence/alternation
  / "<" _ first:signal_expression rest:(_ signal_expression)* _ ">" {
    return {
      type_: "signal_alt",
      signals: [first].concat(rest.map(r => r[1]))
    };
  }

// Basic elements
identifier = chars:[a-zA-Z_]+ { return chars.join(""); }

number = 
  minus? int frac? { return parseFloat(text()); }

int = [0-9]+
frac = "." [0-9]+
minus = "-"

// Whitespace
_ = [ \t\n\r]*