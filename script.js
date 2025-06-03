////// FONCTION FETCH DES RUNS ///////
async function fetchFilteredRuns(url_api) {
    try {
        const response = await fetch(url_api);
        if (!response.ok) {
            console.error(`Erreur HTTP : ${response.status}`);
            return [];
        }

        const data = await response.json();

        if (!data.rankings || !Array.isArray(data.rankings)) {
            console.warn("Données inattendues : pas de rankings.");
            return [];
        }

        return data.rankings.map(d => ({
            rank: d.rank,
            dungeon: d.run.dungeon.name,
            roster: d.run.roster.map(player => ({
                id: player.character.id,
                playerName: player.character.name,
                role: player.role,
                class: player.character.class.name,
                race: player.character.race.name,
                faction: player.character.faction,
                realm: player.character.realm.name,
                region: player.character.region.name
            }))
        }));

    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        return [];
    }
}

////// RECUPERATION DES RUNS ///////
async function fetchAllRuns(region, count) {
    const runs = [];
    const runsPerPage = 20;
    const totalPages = Math.ceil(count / runsPerPage);

    for (let page = 0; page < totalPages; page++) {
        const url = `https://raider.io/api/v1/mythic-plus/runs?access_key=&season=season-tww-2&region=${region}&dungeon=all&page=${page}`;
        const pageRuns = await fetchFilteredRuns(url);
        runs.push(...pageRuns);

        // Si moins de 20 runs reçus, pas besoin de continuer
        if (pageRuns.length < runsPerPage) break;
    }

    //console.log(`Nombre total de runs récupérés : ${runs.length}`);

    const players = [];
    const links = [];

    for (let i = 0; i < runs.length; i++) {
        const roster = runs[i].roster;

        // Ajouter joueurs
        roster.forEach(player => players.push(player));

        // Créer liens entre joueurs
        for (let x = 0; x < roster.length; x++) {
            for (let y = x + 1; y < roster.length; y++) {
                links.push({
                    source: roster[x].id,
                    target: roster[y].id,
                    rank: runs[i].rank,
                    dungeon: runs[i].dungeon
                });
            }
        }
    }

    // Suppression des doublons des noeuds
    const nodes = players.filter((node, index, self) =>
        index === self.findIndex(n => n.id === node.id)
    );

    // Suppression des doublons des liens
    const uniqueLinks = [];
    const linkMap = new Map();

    links.forEach(link => {
        const key = [link.source, link.target].sort().join("-");
        if (!linkMap.has(key)) {
            linkMap.set(key, true);
            uniqueLinks.push(link);
        }
    });

    return { nodes, links: uniqueLinks };
}

////// FONCTION CREATION DU GRAPH D3 ///////
function createGraph(nodes, links) {

    const tooltip = d3.select("#tooltip");

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Fonction de répulsion des bords
    function forceRepulseFromEdges(margin, width, height) {
        return (alpha) => {
            for (const node of nodes) {
                if (node.x < margin) {
                    node.vx += (margin - node.x) * 0.3 * alpha;
                }
                if (node.x > width - margin) {
                    node.vx += (width - margin - node.x) * 0.3 * alpha;
                }
                if (node.y < margin) {
                    node.vy += (margin - node.y) * 0.3 * alpha;
                }
                if (node.y > height - margin) {
                    node.vy += (height - margin - node.y) * 0.3 * alpha;
                }
            }
        };
    }

    // Création d'un objet pour les liens entre les noeuds
    const linkedById = {};
    links.forEach(d => {
        linkedById[`${d.source}-${d.target}`] = true;
        linkedById[`${d.target}-${d.source}`] = true;
    });

    // Fonction pour vérifier si deux noeuds sont connecté
    function isConnected(a, b) {
        return a.id === b.id || linkedById[`${a.id}-${b.id}`] || linkedById[`${b.id}-${a.id}`];
    }

    // Création du SVG pleine page
    const svg = d3.select("body")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("display", "block")
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0);

    // Groupe conteneur pour zoom/pan
    const container = svg.append("g");

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(10))
        .force("charge", d3.forceManyBody().strength(-1))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("edgeRepulse", forceRepulseFromEdges(40, width, height))
        .force("collision", d3.forceCollide(10));

    window.link = container.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", linkWidths[currentLinkWidthIndex])
        .attr("stroke", linkColors[currentLinkColorIndex]);

    const node = container.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", nodeSizes[currentNodeSizeIndex])
        .attr("fill", d => classColors[d.class] || "#999999")
        .on("mouseover", (event, d) => {
            tooltip
                .style("display", "block")
                .html(`
                    <strong>${d.playerName}</strong><br>
                    Classe : ${d.class}<br>
                    Race : ${d.race}<br>
                    Rôle : ${d.role}<br>
                    Royaume : ${d.realm}<br>
                    Région : ${d.region}<br>
                    Faction : ${d.faction}
                `);

            node.style("opacity", o => isConnected(d, o) ? 1 : 0.1);
            window.link.style("stroke-opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1);
        })
        .on("mousemove", event => {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
            node.style("opacity", 1);
            window.link.style("stroke-opacity", 1);
        });

    // Ajout de la simulation de force
    simulation.on("tick", () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        link
            .attr("x1", d => Math.max(0, Math.min(w, d.source.x)))
            .attr("y1", d => Math.max(0, Math.min(h, d.source.y)))
            .attr("x2", d => Math.max(0, Math.min(w, d.target.x)))
            .attr("y2", d => Math.max(0, Math.min(h, d.target.y)));

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Fonction de drag and drop pour les noeuds
    function drag(simulation) {
        return d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }

    // Fonction de zoom et pan
    svg.call(d3.zoom()
    .scaleExtent([0.5, 8])
    .on("zoom", (event) => {
        container.attr("transform", event.transform);
    }));

    node.call(drag(simulation));
    window.nodeSelection = node;
    window.simulation = simulation;

}

////// FONCTION POUR UPDATE LE GRAPH D3 ///////
async function updateGraph() {
    const region = document.getElementById("server-select").value;
    const count = parseInt(document.getElementById("run-count").value, 10);

    // Supprime l'ancien SVG s'il existe
    d3.select("svg").remove();

    const { nodes, links } = await fetchAllRuns(region, count);
    createGraph(nodes, links);
}

////// AJOUT DES EVENT LISTENERS LORSQUE LE DOM EST PRÊT ///////
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("server-select").addEventListener("change", updateGraph);
    document.getElementById("run-count").addEventListener("change", updateGraph);

    // Chargement initial
    updateGraph();
});

////// LEGENDE DES CLASSES ///////
function createLegend(classColors) {
    const legendContainer = document.getElementById("legend");
    legendContainer.innerHTML = "";

    // Création des éléments de légende
    Object.entries(classColors).forEach(([className, color]) => {
        const item = document.createElement("div");
        item.className = "legend-item";

        const colorBox = document.createElement("div");
        colorBox.className = "legend-color";
        colorBox.style.backgroundColor = color;

        const label = document.createElement("span");
        label.textContent = className;

        item.appendChild(colorBox);
        item.appendChild(label);
        legendContainer.appendChild(item);
    });
}

// Couleurs des classes
const classColors = {
    "Mage": "#3FC7EB",
    "Priest": "#FFFFFF",
    "Warrior": "#C79C6E",
    "Paladin": "#F58CBA",
    "Rogue": "#FFF569",
    "Druid": "#FF7D0A",
    "Hunter": "#ABD473",
    "Shaman": "#0070DE",
    "Warlock": "#8787ED",
    "Death Knight": "#C41F3B",
    "Demon Hunter": "#A330C9",
    "Monk": "#00FF96",
    "Evoker": "#33937F"
};

// Appel de la fonction pour créer la légende
createLegend(classColors);

/////// CHANGEMENT DES TAILLES DE NODES ///////
const nodeSizes = [4, 6, 8];
let currentNodeSizeIndex = 0;

// Fonction pour mettre à jour la taille des nodes
function updateNodeSize() {
    if (window.nodeSelection) {
        window.nodeSelection
            .transition()
            .duration(300)
            .attr("r", nodeSizes[currentNodeSizeIndex]);
    }
}

/////// CHANGEMENT DES TAILLES DE LIENS ///////
const linkWidths = [0.5, 1.5, 2.5];
const linkColors = ["rgba(204,204,204,0.6)", "rgba(102,102,102,0.9)", "#000000"];
let currentLinkWidthIndex = 0;
let currentLinkColorIndex = 0;

// Fonction pour mettre à jour la largeur et la couleur des liens
function updateLinkWidth() {
    if (window.link) {
        window.link
            .transition()
            .duration(300)
            .attr("stroke-width", linkWidths[currentLinkWidthIndex])
            .attr("stroke", linkColors[currentLinkColorIndex]);
    }
}


/////// CHANGEMENT DES TAILLES DE COLLISION ///////
const collisionRadii = [10, 15 , 20];
let currentCollisionIndex = 0;
// Fonction pour mettre à jour la force de collision
function updateCollisionForce(simulation) {
    const radius = collisionRadii[currentCollisionIndex];
    simulation.force("collision", d3.forceCollide(radius));
    simulation.alpha(0.5).restart(); // relance la simulation pour appliquer le changement
}

//////// EVENT LISTENER  ////////
document.addEventListener("keydown", (event) => {
    // Touche 1 pour changer la taille des nodes
    if (event.key === "1") {
        currentNodeSizeIndex = (currentNodeSizeIndex + 1) % nodeSizes.length;
        updateNodeSize();
    }
    // Touche 2 pour changer la taille des liens
    if (event.key === "2") {
        currentLinkWidthIndex = (currentLinkWidthIndex + 1) % linkWidths.length;
        currentLinkColorIndex = (currentLinkColorIndex + 1) % linkColors.length;
        updateLinkWidth();
    }
    // Touche 3 pour changer la force de collision
    if (event.key === "3") {
        currentCollisionIndex = (currentCollisionIndex + 1) % collisionRadii.length;
        if (window.simulation) {
            updateCollisionForce(window.simulation);
        }
    }
});