# Final Project

-   [ ] Read the [project requirements](https://vikramsinghmtl.github.io/420-5P6-Game-Programming/project/requirements).
-   [ ] Replace the sample proposal below with the one for your game idea.
-   [ ] Get the proposal greenlit by Vik.
-   [ ] Place any assets in `assets/` and remember to update `src/config.json`.
-   [ ] Decide on a height and width inside `src/globals.js`. The height and width will most likely be determined based on the size of the assets you find.
-   [ ] Start building the individual components of your game, constantly referring to the proposal you wrote to keep yourself on track.
-   [ ] Good luck, you got this!

---

# Proposal - Astral Assault

> [!note]
> This proposal, while it will have a section dedicated to various nice-to-haves, does not demonstrate through alternative diagrams of how they will be implemented. It will however describe how they may be implemented.

## ✒️ Description

In this interstellar shoot 'em up game, players take on the role of a pilot and their ship having to eternally survive through hordes upon hordes of alien enemies until they themselves are defeated. Players will control a stationary ship at the center of their screa, and aim to fire at and destroy various incoming aliens. *Astral Assault* is a level-based game, with the player having to face more hordes for each level the further they progress. There is no present win condition, only the goal to simply survive for as long as possible and get as high of a score as possible.

## 🕹️ Gameplay

Players begin a game session with a starting total of three lives, in which losing all of them means losing the game. Their ship is fixed to the center of the screen with the only available range of movement is rotations, in which the front of the ship will always face the player's mouse cursor.

For each level (starting at 1), players will face a series of alien hordes/waves equal to the number value of the current level itself. The aliens themselves spawn from the edge of the screen and are set to continuously approach the player's ship until they're either fired at and destroyed (in one-hit) or make contact with the player in which the player's ship is destroyed, the game pauses, and they lose one life before the game resumes. As the game continues to progress into higher levels, new types of aliens as well as larger numbers of them will begin to appear, forcing the diffculty to continuously increase until it most-likely becomes impossible for any normal person to continue surviving.

There will be three types of aliens that can appear throughout a play session, each with different AIs in the forms of their movement patterns:
- Pawn: Pawns are simple aliens that will always move in a straight line towards the player.
- Scion: Scions are aliens that slowly circle around the ship as they spawn, however their speed increases the closer they get (which caps out at a certain distance from the player).
- Matriarch: Matriarchs, while being amongst the largest of aliens, are the most difficult to destroy as after a certain period of time they will teleport to a random area on the screen. They are normally invincible but have a specific time-window before and after their next teleportation where they are vulnerable to attack. Its invincible state is depicted as a repeated flashing from transparent to opaque, which otherwise isn't present when it's vulnerable.

In addition, there is a chance that upon an alien's defeat that the player gains one of the following power-ups (in which only one can be active at a time):
- Rapid Fire: The player's fire-rate is temporily doubled for 5 seconds. Has a 5% chance of being obtained when an alien is defeated.
- Shield: The player can be shielded from enemy contact once without losing a life. Has a 2% chance of being obtained when an alien is defeated.
- Time Dilation: Time appears to slow down for 5 seconds, with enemy and player-bullet speeds decreasing to 25% of their original value. Has a 0.5% chance of being obtained when an alien is defeated.

This implementation of *Astral Assault* is a single player experience with an AI. The game is played primarily with the mouse to interact with the cards and general GUI. The players can optionally hit `P` on their keyboard to pause the game.

## 📃 Requirements

1. Start a game session by pressing 'ENTER'.
2. Choosing a desired ship sprite before the game itself begins (purely cosmetic, similar to what was seen in the Breakout lectures).
3. Start the game at level 1 with three lives.
4. See their ship at the center of the screen.
5. Aiming their ship by moving their mouse cursor around.
6. See incoming aliens in their various types.
7. Firing projectiles at aliens by aiming and clicking their left mouse button.
8. Progress to the next horde if all aliens within the current one are destroyed.
9. Progress to the next level if all hordes within the current one are cleared.
10. Acquire different power ups during the game upon defeating enemies.
11. View their current score as they progress.
12. Pause the game by pressing 'ESCAPE'.
13. Option to resume game in pause state.
14. Option to exit game in pause state.
15. Lose a life if an alien makes contact with the player's ship.
16. Lose the game if the player loses all three of their lives.
17. View the placement of their end-game score one a 10-person leader board.
18. Have the option to choose to play again, beginning a new game if yes and returning to the title screen if no.

### 🤖 State Diagrams
Game State Diagram
![Game State Diagram](./assets/images/StateDiagrams/png_files/AstralAssault_GameStateDiagram-2025-11-28-151841.png)

Player State Diagram
![Game State Diagram](./assets/images/StateDiagrams/png_files/AstralAssault_PlayerStateDiagram-2025-11-28-153118.png)

Enemy State Diagram
![Game State Diagram](./assets/images/StateDiagrams/png_files/AstralAssault_EnemyStateDiagram-2025-11-28-153409.png)

Matriach State Diagram
![Game State Diagram](./assets/images/StateDiagrams/png_files/AstralAssault_MatriarchStateDiagram-2025-11-28-153816.png)

### 🗺️ Class Diagram

![Class Diagram](./assets/images/ClassDiagram.png)

### 🧵 Wireframes

> [!note]
> Your wireframes don't have to be super polished. They can even be black/white and hand drawn. I'm just looking for a rough idea about what you're visualizing.

![Main Menu](./assets/images/Main-Menu.png)

-   _Let's Play_ will navigate to the main game.
-   _Upload Cards_ will navigation to the forms for uploading and parsing the data files for the game.
-   _Change Log_ will navigate the user to a page with a list of features/changes that have been implemented throughout the development of the game.

![Game Board](./assets/images/Game-Board.png)

We want to keep the GUI as simple and clear as possible by having cards with relevant images to act as a way for the user to intuitively navigate the game. We want to implement a layout that would look like as if one were playing a match of the Pokémon Trading Card Game with physical cards in real life. Clicking on any of the cards will reveal that card's details to the player.

### 🎨 Assets

We used [app.diagrams.net](https://app.diagrams.net/) to create the wireframes. Wireframes are the equivalent to the skeleton of a web app since they are used to describe the functionality of the product and the users experience.

We plan on following trends already found in other trading card video games, such as Pokémon Trading Card Game Online, Hearthstone, Magic the Gathering Arena, and Gwent.

The GUI will be kept simple and playful, as to make sure the game is easy to understand what each component does and is, as well as light hearted to keep to the Pokémon theme.

#### 🖼️ Images

-   Most images will be used from the well known community driven wikipedia site, [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page).
-   Especially their [Trading Card Game section](<https://bulbapedia.bulbagarden.net/wiki/Full_Art_card_(TCG)>).

#### ✏️ Fonts

For fonts, a simple sans-serif like Roboto will look quite nice. It's a font that is legible, light on storage size, and fun to keep with the theme we're going for. We also used a more cartoonish Pokemon font for the title screen.

-   [Pokemon](https://www.dafont.com/pokemon.font)
-   [Roboto](https://fonts.google.com/specimen/Roboto)

#### 🔊 Sounds

All sounds were taken from [freesound.org](https://freesound.org) for the actions pertaining to cards.

-   [Shuffle cards](https://freesound.org/people/VKProduktion/sounds/217502/)
-   [Flip card](https://freesound.org/people/Splashdust/sounds/84322/)

### 📚 References

-   [Pokemon Rulebook](http://assets.pokemon.com/assets/cms2/pdf/trading-card-game/rulebook/xy8-rulebook-en.pdf)
