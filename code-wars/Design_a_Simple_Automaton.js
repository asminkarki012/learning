//done
function Automaton() {
  this.states = { q1: "q1", q2: "q2", q3: "q3" };
}

Automaton.prototype.readCommands = function (commands) {
  // Return true if we end in our accept state, false otherwise.
  let currentState = "q1";
  for (const command of commands) {
    if (command === "1" && currentState === "q1") {
      currentState = this.states.q2;
    } else if (command === "0" && currentState === "q1") {
      currentState = this.states.q1;
    } else if (command === "0" && currentState === "q2") {
      currentState = this.states.q3;
    } else if (command === "1" && currentState === "q2") {
      currentState = this.states.q2;
    } else if (["0", "1"].includes(command) && currentState === "q3") {
      currentState = this.states.q2;
    }
  }

  if (currentState === "q2") {
    return true;
  } else {
    return false;
  }
};

var myAutomaton = new Automaton();
console.log(myAutomaton.readCommands(["1"])); //should return true as it return in q2
console.log(myAutomaton.readCommands(["1", "0", "0", "1"]));
// Do anything necessaryto set up your automaton's states, q1, q2, and q3.
