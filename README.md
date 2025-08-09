# Falling-sand-simulation
This project is a simple falling-sand game. It is a sandbox where
you can place elements onto the canvas and see them interact with each other.

# Installation
open Index.html

# Elements
There are 12 element types:

SAND, SALT, WATER, BLOCK, OIL, ASH, SMOKE, AIR,
FIRE, ACID, FUSE, BRICK

Each element is a particle class.

Every particle has the following fields:

| **Field**          | **Description**                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Type**           | The name of the particle; must be unique.                                                                                        |
| **Color**          | The color of the particle; this color will be used on the canvas.                                                                |
| **Physic**         | Defines how the particle moves (e.g., like sand, water, etc.).                                                                   |
| **Level**          | Determines which particle will be on top. If a particle moves down and the particle below has a lower level (number), they swap. |
| **Lifetime**       | Some particles live only a certain amount of time; after that, they are replaced.                                                |
| **LifetimeUpdate** | Stores whether the particle’s lifetime was updated; checked against the simulation update (same value means updated).            |
| **Replace**        | The particle that replaces this particle after lifetime hits zero.                                                               |
| **Updated**        | Stores whether the particle’s position was updated; checked against the simulation update (same value means updated).            |
| **LeftDirection**  | Certain elements move side to side (e.g., water). Determines if it tries right or left first; switches if blocked.               |
| **Traits**         | Traits of the particle (explained elsewhere).                                                                                    |
| **Effect**         | One of the trait names; e.g., “flammable” tries to set other particles on fire, acid destroys everything except blocks.          |

# Traits
There are 2 types of traits: flammable and acid (dissolves in acid).
Every particle has a certain chance to burst into flames or be dissolved by acid. The default chance for both is 0.

# How to play
Just click on any element below the canvas, then click on the canvas to place the particle into the simulation. The AIR particle works like an eraser.
