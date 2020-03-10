# A simulation of Conway's Game of life

## This is a simulation of a cellular automation simulating any living organism based on the following rules.

    * Rule 1: Any living cell with fewer than two live neighbours die (Underpopulation)
    * Rule 2: Any living cell with two or three live neighbours live for the next generation
    * Rule 3: Any living cell with more than three live neighbours dies. (Overpopulation)
    * Rule 4: Any dead cell with exactly three live neighbours becomes a live cell (Reproduction)

### This game takes an input configuration of cells (each with a status alive/dead) and starts applying the above rules as it moves to the next generation.

For more information, check this [Wikipedia article](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)