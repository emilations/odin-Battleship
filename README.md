# odin-Battleship

This is an odin project project. The web app is a battleship game designed and created using the TDD approach. The TDD will be focused on developping unit testing for each isolated function in logic. No functional testing will be performed. The factory.js script contains the shipFactory, gameboardFactory and player factory. As the name suggests, these are factory functions required to build the main objects of the application. The control script contains all the logic and view manipulation code.

The test driven test using jest needs some requires some modification in factory.js file. Line 3 needs to be commented out for the test to run properly and without error.