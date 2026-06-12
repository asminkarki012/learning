type NodeId = u8;

const BUCKET_SIZE: usize = 5;

#[derive(Debug)]
struct RoutingTable {
    self_id: NodeId,
    buckets: Vec<Vec<NodeId>>,
}

impl RoutingTable {
    fn new(self_id: NodeId) -> Self {
        RoutingTable {
            self_id,
            buckets: vec![Vec::new(); 8],
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
}

fn main() {
    let nodes = [0, 1, 2, 3, 4, 8, 20, 6, 4, 6];
    let mut rt = RoutingTable::new(2);
    for node in nodes {
        rt.insert(node);
    }
    println!("{:?}", rt);
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

//FIND NODE REMAINS
