# Wolfiverse

Wolfiverse is a quantum story game where the player plays as a wolf traversing in a multiverse of three beloved wolf-related folktales: the little red riding hood, the boy who cried the wolf and the three little pigs.

Click here to play: https://huangjunye.github.io/Wolfiverse/

## Story

A hungrey wolf wants to eat Peter in the boy who cried the wolf story. The wolf can't eat Peter at the beginning as the villagers will come to rescue. The wolf needs to make the villagers think Peter is a liar before he can eat Peter. To do that, the wolf traverse to other parallel universes: the little red riding hood and the three little pigs.

## Quantum mechanics

Quantum mechanics, implemented by a quantum circuit in Qiskit, is used in two aspects in the game: random destination whenever the wolf leaves Peter and the probability of eating Peter.

The random destination is determined by a single-shot measurement outcome of a qubit with |+> = |0> + |1> state, realized by H gate.

The probability of eating Peter is also determined by the measurement outcome of a qubit, but in this case, its state changes as the player picks up gates (items) along the storyline. At the beginning of the game, the state is |0>, with 0% chance of eating Peter (|1>). As the game progress, the player first pick up a pie or a matchbox in the game, which is a H gate at the backend. The state of the qubit is changed to |+> and the chance of eating Peter is increased to 50%. The next gate that gets picked up is Z gate, which change the qubit state to |->. The chance of eating Peter remains at 50%, but when combined with the last H gate, the chance of eating Peter increases to 100%, because HZH|0> = |1>.

## Technical details

The main game is written using Twine, which is a open-source tool for telling interactive, nonlinear stories. Twine game is based on the Web stack: HTML, CSS and Javascript. The game can be easily hosted anywhere without the need of installation.

### Qiskit flask server

Because Twine doens't use Python, we need a way to communicate the game with Qiskit. The communication is achieved by HTTP protocol with a Qiskit flask server hosted on Heroku cloud application platform.

A gate string like "H,I,I" is passed to the server, which converts it to a `QuantumCircuit` object and runs it in `qasm_simulator` backend. The result is returned to the game to determine the next scene.

In Twine, we put the following code in the "story javascript".

```javascript
setup.measurement = function (gate_array) {
    const Http = new XMLHttpRequest();
    var url='https://wolfiverse-server.herokuapp.com/api/run/do_measurement?gate_array='+gate_array;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText);
        state.active.variables.result = Http.responseText;
    }
}
```

For random outcome, we use "H,I,I" as the gate string. For "eat Peter" passage, the gate string starts with "I,I,I". As the story progress, player picks up gates, the gate string becomes, "H,I,I", "H,Z,I", and finally "H,Z,H".
