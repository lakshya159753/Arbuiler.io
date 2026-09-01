const group = document.getElementById("moleculeGroup");
const message = document.getElementById("message");
const fact = document.getElementById("fact");

const CPK = {
  H: "#FFFFFF",
  C: "#444444",
  N: "#3050F8",
  O: "#FF0D0D"
};

const MOLECULES = {
  H2O: {
    name: "Water",
    atoms: [
      ["O", 0, 0.75, 0],
      ["H", -0.55, 0.35, 0],
      ["H", 0.55, 0.35, 0]
    ],
    bonds: [[0,1],[0,2]],
    fact: "Water is essential for life and has two hydrogen atoms bonded to one oxygen atom."
  },

  CO2: {
    name: "Carbon Dioxide",
    atoms: [
      ["C", 0, 0.55, 0],
      ["O", -0.75, 0.55, 0],
      ["O", 0.75, 0.55, 0]
    ],
    bonds: [[0,1],[0,2]],
    fact: "Carbon dioxide contains one carbon atom and two oxygen atoms."
  },

  CH4: {
    name: "Methane",
    atoms: [
      ["C", 0, 0.65, 0],
      ["H", 0.65, 0.35, 0],
      ["H", -0.65, 0.35, 0],
      ["H", 0, 0.35, 0.65],
      ["H", 0, 0.35, -0.65]
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4]],
    fact: "Methane contains one carbon atom bonded to four hydrogen atoms."
  },

  NH3: {
    name: "Ammonia",
    atoms: [
      ["N", 0, 0.65, 0],
      ["H", -0.55, 0.35, 0],
      ["H", 0.55, 0.35, 0],
      ["H", 0, 0.35, 0.65]
    ],
    bonds: [[0,1],[0,2],[0,3]],
    fact: "Ammonia contains one nitrogen atom bonded to three hydrogen atoms."
  },

  O2: {
    name: "Oxygen",
    atoms: [
      ["O", -0.45, 0.55, 0],
      ["O", 0.45, 0.55, 0]
    ],
    bonds: [[0,1]],
    fact: "Oxygen gas exists naturally as O₂, a molecule made of two oxygen atoms."
  }
};

function clearGroup() {
  while (group.firstChild) group.removeChild(group.firstChild);
}

function atom(type, x, y, z) {
  const s = document.createElement("a-sphere");
  s.setAttribute("radius", type === "H" ? "0.18" : "0.25");
  s.setAttribute("position", `${x} ${y} ${z}`);
  s.setAttribute("color", CPK[type]);
  s.setAttribute("metalness", "0.15");
  s.setAttribute("roughness", "0.35");
  group.appendChild(s);

  const label = document.createElement("a-text");
  label.setAttribute("value", type);
  label.setAttribute("align", "center");
  label.setAttribute("position", `${x} ${y + 0.3} ${z}`);
  label.setAttribute("scale", "0.6 0.6 0.6");
  label.setAttribute("color", "#111111");
  group.appendChild(label);
}

function bond(a, b) {
  const A = MOLECULES[document.getElementById("molecule").value].atoms[a];
  const B = MOLECULES[document.getElementById("molecule").value].atoms[b];

  const start = new THREE.Vector3(A[1], A[2], A[3]);
  const end = new THREE.Vector3(B[1], B[2], B[3]);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);

  const cylinder = document.createElement("a-cylinder");
  cylinder.setAttribute("radius", "0.045");
  cylinder.setAttribute("height", distance);
  cylinder.setAttribute("color", "#888888");
  cylinder.setAttribute("position", `${mid.x} ${mid.y} ${mid.z}`);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dz = end.z - start.z;
  const angle = Math.atan2(Math.sqrt(dx*dx + dz*dz), dy) * 180 / Math.PI;
  const rotY = Math.atan2(dx, dz) * 180 / Math.PI;

  cylinder.setAttribute("rotation", `${angle} ${rotY} 0`);
  group.appendChild(cylinder);
}

function buildMolecule() {
  const key = document.getElementById("molecule").value;
  const m = MOLECULES[key];

  clearGroup();

  m.atoms.forEach(a => atom(a[0], a[1], a[2], a[3]));
  m.bonds.forEach(b => bond(b[0], b[1]));

  message.textContent = `${m.name} (${key}) built successfully.`;
  fact.textContent = m.fact;
}

function resetMolecule() {
  clearGroup();
  message.textContent = "Molecule reset. Select a molecule and press Build Molecule.";
  fact.textContent = "";
}
