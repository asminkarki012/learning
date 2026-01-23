# level5->level6


``` bash
ssh bandit5@bandit.labs.overthewire.org -p 2220
```


### The password for the next level is stored in a file somewhere under the inhere directory and has all of the following properties:
    human-readable
    1033 bytes in size
    not executable


``` bash
cd inhere 
# This pipeline performs the following:
# 1. Find non-executable files of size 1033 bytes in the current directory.
# 2. Use 'file' to identify their type and filter for ASCII text files.
# 3. Extract file paths using ':' as a delimiter.
# 4. Pass the file paths to 'cat' to display their content.
find . -type f ! -executable -size 1033c | xargs file | grep ASCII | cut -d: -f1 | xargs cat

```

password for level 6:
HWasnPhtq9AVKe0dmk45nxy20cvUa6EG
