# level6->level7

``` bash
ssh bandit6@bandit.labs.overthewire.org -p 2220
use password from prev level
```

### The password for the next level is stored somewhere on the server and has all of the following properties

    owned by user bandit7
    owned by group bandit6
    33 bytes in size

### SOLUTION

#### note

In Linux, every process has three standard input/output streams:
stdin (0) → Standard input (keyboard input)
stdout (1) → Standard output (normal output)
stderr (2) → Standard error (error messages)

```bash
# find / -type f -size 33c -user bandit7 -group bandit6: Searches for a 33-byte file owned by bandit7 and bandit6.
# 2>/dev/null : Suppresses "Permission denied" errors.
# | xargs cat : Passes the found file(s) to cat to display the contents.

find / -type f -size 33c -user bandit7 -group bandit6 2>/dev/null | xargs cat 
```

password for level 7:
morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj
