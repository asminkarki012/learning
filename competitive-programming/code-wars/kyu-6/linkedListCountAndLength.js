//https://www.codewars.com/kata/55beec7dd347078289000021
function Node(data) {
  this.data = data;
  this.next = null;
}

function length(head) {
  // Your code goes here.
  let count = 0;
  let current = head;
  while (current) {
    count++;
    current = current.next
  }

  return count;
}

function count(head, data) {
  // Your code goes here.
  let current = head;
  let occurence = 0;
  while (current) {
    const currData = current.data
    occurence = currData === data ? occurence + 1 : occurence
    current = current.next
  }
  return occurence
}
