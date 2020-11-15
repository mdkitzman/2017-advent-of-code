# Day 3: Spiral Memory

## Part 1
You come across an experimental new kind of memory stored on an infinite two-dimensional grid.

Each square on the grid is allocated in a spiral pattern starting at a location marked 1 and 
then counting up while spiraling outward. For example, the first few squares are allocated 
like this:

```
17  16  15  14  13
18   5   4   3  12
19   6   1   2  11
20   7   8   9  10
21  22  23---> ...
```

While this is very space-efficient (no squares are skipped), requested data must be carried 
back to square 1 (the location of the only access port for this memory system) by programs that 
can only move up, down, left, or right. They always take the shortest path: 
the Manhattan Distance between the location of the data and square 1.

For example:

Data from square `1` is carried 0 steps, since it's at the access port.
Data from square `12` is carried 3 steps, such as: down, left, left.
Data from square `23` is carried only 2 steps: up twice.
Data from square `1024` must be carried 31 steps.
Data from square `83` must be carried 8 steps.
How many steps are required to carry the data from the square identified in your puzzle input all the way to the access port?

## Part 2
As a stress test on the system, the programs here clear the grid and then store the value 1 in square 1. 
Then, in the same allocation order as shown above, they store the sum of the values in all adjacent squares, 
including diagonals.

So, the first few squares' values are chosen as follows:

Square `1` starts with the value 1.
Square `2` has only one adjacent filled square (with value 1), so it also stores 1.
Square `3` has both of the above squares as neighbors and stores the sum of their values, 2.
Square `4` has all three of the aforementioned squares as neighbors and stores the sum of their values, 4.
Square `5` only has the first and fourth squares as neighbors, so it gets the value 5.
Once a square is written, its value does not change. Therefore, the first few squares would receive the following values:

```
147  142  133  122   59
304    5    4    2   57
330   10    1    1   54
351   11   23   25   26
362  747  806--->   ...
```
What is the first value written that is larger than your puzzle input?

# Solution Approach

## Part 1

Thiking about the spiral of number in terms of the number of rotations from 1 in the cardinal directions, you
get a serires of numbers in each direction, starting with east since that is the first move after 1.

```
Rotations | 0 | 1 | 2  | 3  | 4  | ...
-----------------------------------
east      | 1 | 2 | 11 | 28 | 53 | ...
north     | 1 | 4 | 15 | 34 | 61 | ...
west      | 1 | 6 | 19 | 40 | 65 | ... 
south     | 1 | 8 | 23 | 46 | 77 | ...
```
Finding the shortest path to 1 means finding the shortest distance to one of these cardinal directions and
adding on the number of rotations away from 1 that cardinal number is.

Turns out you can represent the series of numbers to the east as
`east(r) = (2r - 1)^2 + r`
where r is the number of rotations, or the radius of the spiral

i.e. a radius of 1 gives a "square" like this

```
1 2
```

and a radius of 3 gives a "square" like this

```
17  16  15  14  13
18   5   4   3  12
19   6   1   2  11  28
20   7   8   9  10  27
21  22  23  24  25  26
```

## Part 2

Observations:
Starting at position 0, the top-left and bottom-right diagonals are all squares.

```
100 .   .   .   .   .   .   .   .   .   .
.   64  .   .   .   .   .   .   .   .   .
.   .   36  .   .   .   .   .   .   .   .
.   .   .   16  .   .   .   .   .   .   .
.   .   .   .   4   .   .   .   .   .   .
.   .   .   .   .   0   1   .   .   .   .
.   .   .   .   .   .   .   9   .   .   .
.   .   .   .   .   .   .   .   25  .   .
.   .   .   .   .   .   .   .   .   49  .
.   .   .   .   .   .   .   .   .   .   81   
.   .   .   .   .   .   .   .   .   .   .   121
```

The other diagonal positions are floor(sqrt(i)) steps away from the previous square position.
```
100 .   .   .   .   .   .   .   .   .   90   
.   64  .   .   .   .   .   .   .   56  .   
.   .   36  .   .   .   .   .   30  .   .   
.   .   .   16  .   .   .   12  .   .   .   
.   .   .   .   4   .   2   .   .   .   .   
.   .   .   .   .   0   1   .   .   .   .   
.   .   .   .   6   .   .   9   .   .   .   
.   .   .   20  .   .   .   .   25  .   .   
.   .   42  .   .   .   .   .   .   49  .   
.   72  .   .   .   .   .   .   .   .   81   
110 .   .   .   .   .   .   .   .   .   .   121
```
i.e. pos `42 = 36 + 6`
since `sqrt(42) ~= 6.4807...`
Floor this value and square it to find the previous square number, and add the steps away.
```
  stepsAway = Math.floor(Math.sqrt(42)) = 6
  prevRoot  = Math.pow(Math.floor(Math.sqrt(42)), 2) = 36
```
If this calculation equals our input, this is on the bottom-left or top-right diagonal.

This doesn't work for `41`, since `sqrt(41) ~= 6.40312...`
Pluggig in `41` we get the same value
```
  stepsAway = Math.floor(Math.sqrt(42)) = 6
  prevRoot  = Math.pow(Math.floor(Math.sqrt(42)), 2) = 36
```
but `prevRoot + stepsAway = 36 + 6 != 41`