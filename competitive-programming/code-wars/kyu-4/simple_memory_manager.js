// https://www.codewars.com/kata/536e7c7fd38523be14000ca2/train/javascript
class MemoryManager {
  /**
   * @constructor Creates a new memory manager for the provided array.
   * @param {memory} An array to use as the backing memory.
   */
  constructor(memory) {
    this.memo = memory
    this.memoSize = memory.length
    this.offset = 0
    //maitaining lookup table for block with start,end and size 
    this.lookup = []
    this.writeStart = null

  }
  /**
   * Allocates a block of memory of requested size.
   * @param {number} size - The size of the block to allocate.
   * @returns {number} A pointer which is the index of the first location in the allocated block.
   * @throws If it is not possible to allocate a block of the requested size.
   */
  allocate(size) {
    if (this.memoSize < size) {
      throw new Error("memory not enought to be allocated")
    }
    this.memoSize = this.memoSize - size
    const memoinfo = { start: this.offset, size: size }
    this.offset = this.offset + size
    memoinfo.end = this.offset
    this.lookup.push(memoinfo)
    return memoinfo.start
  }
  /**
   * Releases a previously allocated block of memory.
   * @param {number} pointer - The pointer to the block to release.
   * @throws If the pointer does not point to an allocated block.
   */
  release(pointer) {

    const findAddr = this.lookup.findIndex(x => x.start === pointer);
    if (findAddr === -1) throw new Error("pointer does not point to an allocated block")

    const [releasedBlock] = this.lookup.splice(findAddr, 1)

    //delete in memo when block is unallocated
    for (let i = releasedBlock.start; i < releasedBlock.end; i++) {
      delete this.memo[i]
    }

    this.offset = this.offset - releasedBlock.size
    this.memoSize = this.memoSize + releasedBlock.size

  }
  /**
   * Reads the value at the location identified by pointer
   * @param {number} pointer - The location to read.
   * @returns {number} The value at that location.
   * @throws If pointer is in unallocated memory.
   */
  read(pointer) {

    if (this.lookup.length === 0) throw new Error("pointer is in unallocated memory")

    for (const { start, end } of this.lookup) {
      if (start <= pointer && end > pointer) {
        return this.memo[pointer]
      }
    }
    return undefined

  }
  /**
   * Writes a value to the location identified by pointer
   * @param {number} pointer - The location to write to.
   * @param {number} value - The value to write.
   * @throws If pointer is in unallocated memory.
   */
  write(pointer, value) {
    if (this.writeStart === null) this.writeStart = pointer

    const findAddr = this.lookup.find(x => x.start === this.writeStart);
    if (!findAddr) throw new Error('cannot write to unallocated memory')

    if (!(findAddr.start <= pointer && findAddr.end > pointer)) throw new Error('pointer out of bound cannot write')

    this.memo[pointer] = value
  }
}
