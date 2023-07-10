# falling-sand-simulation
This project is a simple falling-sand game. It is a sandbox where you can put \
some elements into Canvas and see them interact with each other.

# Elements
There are 12 elements type.

SAND, SALT, WATER, BLOCK, OIL, ASH, SMOKE, AIR, \
FIRE, ACID, FUSE, BRICK

Every element is a particle Class.

Every particle has these fields:

** Type ** - the name of the particle, must be unique 
\
\
** Color ** - the color of the particle, this color will be used on the canvas
\
\
** Physic ** - how a particle moves essentially, like sand, water, and so on.
\
\
** Level ** - level determines which particle will be on top. If the particle is going down and right under it is a particle with 
lower level (lower number) they will change place. 
\
\
** Lifetime ** - some particles live only a certain amount of time and after that, they are replaced 
\
\
** LifeTimeUpdate ** - Stores whether particle lifetime was updated,  
this is checked against the simulation updated and the same value means it was updated 
\
\
** Replace ** - a particle that will replace this particle after Lifetime hits zero.  
\
\
** Updated ** - Stores whether particle position was updated,  
this is checked against the simulation updated and the same value means it was updated 
\
\
** LeftDirection ** - certain elements move from side to side, water for example is one. this field 
determines if it goes first into right or left and if it cannot go there it switches to false or true based on the previous value 
and try the other side. 
\
\
** Traits ** - Traits (explained below) 
\
\
** Effect ** - this value is one of the Trait names. flammable tries to  \
put other particles on fire. The acid will destroy everything that touches it except for the block.

# Traits
There are 2 types of traits. flammable or acid (dissolve in acid). \
every particle has some chance to burst into flames or be dissolved in acid. The default for both is 0.

# How to play
just click on any element under Canvas and click into Canvas and place the particle into \
the simulation. AIR particle works like an eraser
