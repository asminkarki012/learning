//reference: https://www.scs.stanford.edu/~dm/home/papers/kpos.pdf
use std::collections::{HashMap, HashSet};

type NodeId = u8;

const BUCKET_SIZE: usize = 5;

#[derive(Debug, Clone)]
struct RoutingTable {
    self_id: NodeId,
    buckets: Vec<Vec<NodeId>>,
    store: HashMap<NodeId, String>,
}

impl RoutingTable {
    fn new(self_id: NodeId) -> Self {
        RoutingTable {
            self_id,
            buckets: vec![Vec::new(); 8],
            store: HashMap::new(),
        }
    }

    fn insert(&mut self, node: NodeId) {
        if let Some(index) = bucket_index(self.self_id, node) {
            let is_new_node = !self.buckets[index].contains(&node);

            if !is_new_node {
                if let Some(node_index) = self.buckets[index].iter().position(|&x| x == node) {
                    self.buckets[index].remove(node_index);
                    self.buckets[index].push(node);
                }
                return;
            }

            let is_bucket_full = self.buckets[index].len() >= BUCKET_SIZE;

            if is_new_node && !is_bucket_full {
                self.buckets[index].push(node);
                return;
            }

            if is_new_node && is_bucket_full {
                let oldest_node = self.buckets[index][0];

                let oldest_node_index = 0;
                let is_node_alive = ping(oldest_node);

                if !is_node_alive {
                    self.buckets[index].remove(oldest_node_index);
                    self.buckets[index].push(node)
                }
                return;
            }
        }
    }

    /*
    *
    * FIND_NODE
    1. Take input: target_id, k

    2. Flatten all buckets from the routing table
       → collect all known nodes into Vec<NodeId>

    3. For each node:
           compute distance = node_id ^ target_id

    4. Sort nodes in ascending order of distance

    5. If total_nodes ≥ k:
           return first k nodes
       else:
           return all nodes
    */
    pub fn find_node(&self, target: NodeId, k: usize) -> Vec<NodeId> {
        let mut all_nodes: Vec<NodeId> = self.buckets.iter().flatten().copied().collect();
        all_nodes.sort_by_key(|&x| x ^ target);

        if all_nodes.len() >= k {
            all_nodes.truncate(k);
            return all_nodes;
        }
        return all_nodes;
    }

    fn find_value(
        key: NodeId,
        k: usize,
        alpha: usize,
        initiator: NodeId,
        networks: &HashMap<NodeId, RoutingTable>, // need to modify the Routing table
    ) -> Option<String> {
        let mut seen_candidates: HashSet<NodeId> = HashSet::new();

        let Some(rt) = networks.get(&initiator) else {
            println!("Initiator node not found!");
            return None;
        };

        let mut closest_nodes = rt.find_node(key, k);
        seen_candidates.insert(initiator);

        // simulating 3 parallel query search, right now only a loop
        loop {
            let to_query: Vec<NodeId> = closest_nodes
                .iter()
                .filter(|&n| !seen_candidates.contains(&n))
                .take(alpha)
                .cloned()
                .collect();
            if to_query.is_empty() {
                println!("No node to query");
                break;
            }
            let mut new_nodes: Vec<NodeId> = Vec::new();
            let current_best = closest_nodes[0] ^ key;

            for node in to_query {
                seen_candidates.insert(node);
                let Some(new_rt) = networks.get(&node) else {
                    println!("find_value: query node not found!");
                    continue;
                };

                if let Some(value) = new_rt.store.get(&key) {
                    return Some(value.clone());
                }
                new_nodes.extend(new_rt.find_node(key, k));
            }
            closest_nodes.extend(new_nodes);
            closest_nodes.sort_by_key(|&x| x ^ key);
            closest_nodes.dedup();
            closest_nodes.truncate(k);

            let new_best = closest_nodes[0] ^ key;

            if new_best <= current_best {
                break;
            }
            continue;
        }

        None
    }

    fn store(
        key: NodeId,
        value: &String,
        k: usize,
        alpha: usize,
        initiator: NodeId,
        networks: &mut HashMap<NodeId, RoutingTable>, // need to modify the Routing table
    ) {
        let closest_nodes = node_lookup(key, k, alpha, initiator, &networks);

        for &n in &closest_nodes {
            let Some(node) = networks.get_mut(&n) else {
                println!("node not found");
                continue;
            };

            node.store.insert(key, value.to_string());
        }
    }
}

fn main() {
    // sample nodes in network
    let nodes = [2, 3, 6, 8, 10, 20];

    // create routing tables
    let mut rt2 = RoutingTable::new(2);
    let mut rt6 = RoutingTable::new(6);
    let mut rt20 = RoutingTable::new(20);

    // populate routing tables (simple simulation)
    for &node in &nodes {
        if node != 2 {
            rt2.insert(node);
        }
        if node != 6 {
            rt6.insert(node);
        }
        if node != 20 {
            rt20.insert(node);
        }
    }

    // create network (NodeId → RoutingTable)
    let mut network: HashMap<NodeId, RoutingTable> = HashMap::new();
    network.insert(2, rt2);
    network.insert(6, rt6);
    network.insert(20, rt20);

    // parameters
    let target: NodeId = 18;
    let k = BUCKET_SIZE;
    let alpha = 2;
    let initiator = 2;
    let key = 18;

    let value = String::from("Hello");

    RoutingTable::store(key, &value, k, alpha, initiator, &mut network);

    for (node_id, rt) in &network {
        println!("Node {} store: {:?}", node_id, rt.store);
    }

    let Some(value) = RoutingTable::find_value(key, k, alpha, initiator, &network) else {
        println!("no value found");
        return;
    };

    println!("found valueeeee {:?}", value);

    // run lookup
    let result = node_lookup(target, k, alpha, initiator, &network);

    println!("Lookup result (closest nodes to {}): {:?}", target, result);
}

fn bucket_index(self_id: NodeId, other_id: NodeId) -> Option<usize> {
    let distance = self_id ^ other_id;
    println!(
        "distance between {:?} and {:?} = {:?}",
        self_id, other_id, distance
    );
    if distance == 0 {
        return None;
    }

    let index = (7 - distance.leading_zeros()) as usize;
    Some(index)
}

// simulating failure case true -> alive else failure
fn ping(node: NodeId) -> bool {
    node % 2 == 0
}

fn node_lookup(
    target: NodeId,
    k: usize,
    alpha: usize,
    initiator: NodeId,
    networks: &HashMap<NodeId, RoutingTable>,
) -> Vec<NodeId> {
    let mut seen_candidates: HashSet<NodeId> = HashSet::new();

    let Some(rt) = networks.get(&initiator) else {
        println!("Initiator node not found!");
        return vec![];
    };

    let mut closest_nodes = rt.find_node(target, k);
    seen_candidates.insert(initiator);

    // simulating 3 parallel query search, right now only a loop
    loop {
        let to_query: Vec<NodeId> = closest_nodes
            .iter()
            .filter(|&n| !seen_candidates.contains(&n))
            .take(alpha)
            .cloned()
            .collect();
        if to_query.is_empty() {
            println!("No node to query");
            break;
        }
        let mut new_nodes: Vec<NodeId> = Vec::new();
        let current_best = closest_nodes[0] ^ target;

        for node in to_query {
            seen_candidates.insert(node);
            let Some(new_rt) = networks.get(&node) else {
                println!("query node not found!");
                continue;
            };
            new_nodes.extend(new_rt.find_node(target, k));
        }
        closest_nodes.extend(new_nodes);
        closest_nodes.sort_by_key(|&x| x ^ target);
        closest_nodes.dedup();
        closest_nodes.truncate(k);

        let new_best = closest_nodes[0] ^ target;

        if new_best <= current_best {
            break;
        }
        continue;
    }

    closest_nodes
}
