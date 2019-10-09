workflow "New workflow" {
  on = "push"
  resolves = ["workflows/node.yml"]
}

action "workflows/node.yml" {
  uses = "./workflows/node.yml"
}
