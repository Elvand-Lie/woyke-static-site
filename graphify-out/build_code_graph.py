import json
import subprocess
from pathlib import Path

from graphify.analyze import god_nodes, surprising_connections
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.detect import detect
from graphify.export import to_json
from graphify.extract import collect_files, extract
from graphify.report import generate


root = Path("assets/js")
output = Path("graphify-out")
output.mkdir(exist_ok=True)

detection = detect(root)
code_files = []
for item in detection.get("files", {}).get("code", []):
    path = Path(item)
    code_files.extend(collect_files(path) if path.is_dir() else [path])

extraction = extract(code_files, parallel=False)
(output / ".graphify_extract.json").write_text(
    json.dumps(extraction, indent=2, ensure_ascii=False), encoding="utf-8"
)

graph = build_from_json(extraction, directed=True, root=root)
communities = cluster(graph)
cohesion = score_all(graph, communities)
gods = god_nodes(graph)
surprises = surprising_connections(graph, communities)
labels = {
    community_id: " / ".join(
        graph.nodes[node_id].get("label", str(node_id))
        for node_id in node_ids[:3]
    )
    for community_id, node_ids in communities.items()
}
try:
    commit = subprocess.check_output(
        ["git", "rev-parse", "--short", "HEAD"], text=True
    ).strip()
except Exception:
    commit = None

report = generate(
    graph,
    communities,
    cohesion,
    labels,
    gods,
    surprises,
    detection,
    {
        "input": extraction.get("input_tokens", 0),
        "output": extraction.get("output_tokens", 0),
    },
    str(root),
    built_at_commit=commit,
)
(output / "GRAPH_REPORT.md").write_text(report, encoding="utf-8")
to_json(
    graph,
    communities,
    str(output / "graph.json"),
    force=True,
    built_at_commit=commit,
)
print(
    f"Graphify AST: {len(code_files)} files, {graph.number_of_nodes()} nodes, "
    f"{graph.number_of_edges()} edges, {len(communities)} communities, token cost 0"
)
