mod graph_search;
//mod dfs;
use graph_search::Graph;

fn main() {
    let mut g = Graph::new();

    g.insert_edge(0, vec![1, 2]);
    g.insert_edge(1, vec![0, 3, 4]);
    g.insert_edge(2, vec![0, 5]);
    g.insert_edge(3, vec![1]);
    g.insert_edge(4, vec![1, 5]);
    g.insert_edge(5, vec![2, 4]);
    for (k, v) in &g.adj_list {
        println!("{} -> {:?}", k, v);
    }

    match g.bfs(1) {
        Ok(order) => println!("BFS result: {:?}", order),
        Err(e) => println!("Error: {}", e),
    }

    match g.dfs(1) {
        Ok(order) => println!("DFS result: {:?}", order),
        Err(e) => println!("Error: {}", e),
    }
}
