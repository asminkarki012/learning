use std::collections::{HashMap, HashSet, VecDeque};

#[derive(Debug)]
pub struct Graph {
    pub adj_list: HashMap<usize, Vec<usize>>,
}

impl Graph {
    pub fn new() -> Self {
        Graph {
            adj_list: HashMap::new(),
        }
    }
    pub fn insert_edge(&mut self, node: usize, neighbours: Vec<usize>) {
        self.adj_list.insert(node, neighbours);
    }

    pub fn bfs(&self, start: usize) -> Result<Vec<usize>, String> {
        let mut visited: HashSet<usize> = HashSet::new();
        let mut queue: VecDeque<usize> = VecDeque::new();
        let mut order: Vec<usize> = Vec::new();

        if !self.adj_list.contains_key(&start) {
            return Err("Start node not found".to_string());
        }

        visited.insert(start);
        order.push(start);
        queue.extend(self.adj_list.get(&start).unwrap());

        while queue.len() != 0 {
            let current_node = queue.pop_front().unwrap();
            if !visited.contains(&current_node) {
                visited.insert(current_node);
                order.push(current_node);
                let neighbours = self.adj_list.get(&current_node).unwrap();
                for &each in neighbours {
                    if !visited.contains(&each) {
                        queue.push_back(each);
                    }
                }
            }
        }

        Ok(order)
    }

    pub fn dfs(&self, start: usize) -> Result<Vec<usize>, String> {
        let mut visited: HashSet<usize> = HashSet::new();
        let mut stack: Vec<usize> = Vec::new();
        let mut order: Vec<usize> = Vec::new();

        if !self.adj_list.contains_key(&start) {
            return Err("Start node not found".to_string());
        }

        visited.insert(start);
        order.push(start);
        stack.extend(self.adj_list.get(&start).unwrap());

        while stack.len() != 0 {
            let current_node = stack.pop().unwrap();
            if !visited.contains(&current_node) {
                visited.insert(current_node);
                order.push(current_node);
                let neighbours = self.adj_list.get(&current_node).unwrap();
                for &each in neighbours {
                    if !visited.contains(&each) {
                        stack.push(each);
                    }
                }
            }
        }

        Ok(order)
    }
}
