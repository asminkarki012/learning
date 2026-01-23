# level9->level10

``` bash
ssh bandit9@bandit.labs.overthewire.org -p 2220
use password from prev level
```
```bash
# strings used for extracting printable string from binary file
# only grep more than 5 = symbol, -E extended REGEX
strings data.txt | grep -E '\={5,}'
```


password for level 10:
FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey
