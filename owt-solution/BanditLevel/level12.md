# level12->level13

``` bash
ssh bandit12@bandit.labs.overthewire.org -p 2220
use password from prev level
```
Theory:
- bzip2 higher compression ratio than gzip but slower processing time 
- bzip2 cannot bundle multiple files into one archive, so we use tar to bundle multiple files into one archive and then compress it using bzip2



```bash
mkdir /tmp/decompress/
cp data.txt /tmp/decompress/
#data.txt is a compressed files
file data.txt 
#convert to binary 
xxd -r data.txt > output.bin
file output.bin #this will give you information about which zipper to use

#if compressed gzip then
# 1.first convert output.bin -> output.gz
# 2.use gzip -d output.gz 
# 3.repeat above steps for bzip2,tar
tar -xvf filename
bzip2 -d filename

```

password for level 13:
FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn
