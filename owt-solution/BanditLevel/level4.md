# level4 -> level5

``` bash
ssh bandit4@bandit.labs.overthewire.org -p 2220
```


### The password for the next level is stored in the only human-readable file in the inhere directory. Tip: if your terminal is messed up, try the “reset” command.


``` bash
cd inhere 
# . find in current dir 
# -type f make sure its file
# xargs takes input and feed to file
# file analyzes content of files 
find . -type f | xargs file | cut -d: -f1 | xargs cat
```
password for level 5:
4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw
