/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  TouchableHighlight,
  ImageBackground
} from "react-native";

import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import {getRandomInt} from "../lib/GridApi"
import {BEANS} from "../lib/Images"
import {TileData} from "../lib/TileData"
import Tile from "./Tile";


export default class SwappableGrid extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      tileDataSource: this.initializeDataSource()
    };
  }

  swap(i,j,dx,dy){

    let newData = this.state.tileDataSource

    const swapStarter = this.state.tileDataSource[i][j];
    const swapEnder = this.state.tileDataSource[i + dx][j + dy];

    newData[i][j] = swapEnder;
    newData[i+dx][j+dy] = swapStarter;

    this.setState({tileDataSource: newData})

    this.animateValuesToLocations()
  }

  onSwipe(gestureName, gestureState) {

      const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

      let initialGestureX = gestureState.x0;
      let initialGestureY = gestureState.y0;

      console.log("initialGestureX/Y",initialGestureX,initialGestureY)

      let i = Math.round((initialGestureX - this.gridOrigin[0] - 0.5 * TILE_WIDTH) / TILE_WIDTH);
      let j = Math.round((initialGestureY - this.gridOrigin[1] - 0.5 * TILE_WIDTH) / TILE_WIDTH);

      console.log("i,j",i,j)

      switch (gestureName) {
        case SWIPE_UP:
          console.log("SWIPE_UP")
          this.swap(i,j,0,-1)
          break;
        case SWIPE_DOWN:
          console.log("SWIPE_DOWN")
          this.swap(i,j,0,1)
          break;
        case SWIPE_LEFT:
          console.log("SWIPE_LEFT")
          this.swap(i,j,-1,0)
          break;
        case SWIPE_RIGHT:
          console.log("SWIPE_RIGHT")
          this.swap(i,j,1,0)
          break;
      }
  }

  initializeDataSource() {
    // Grid that contains the keys that will be assigned to each tile via map
    let keys = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24]
    ];

    var tileData = keys.map((row, i) => {
      let dataRows = row.map((key, j) => {
        let int = getRandomInt(7)
        let randomBean = BEANS[int]
        let data = new TileData(randomBean, key);
        return data;
      });
      return dataRows;
    });
    return tileData;
  }

  componentWillMount() {
    this.animateValuesToLocations();
  }

  onLayout(event) {
    this.gridOrigin = [event.nativeEvent.layout.x, event.nativeEvent.layout.y];
    console.log("this.origin from onLayou",this.origin)
  }


  // Animates the values in the tile data source based on their index in the array.
  animateValuesToLocations() {
    this.state.tileDataSource.forEach((row, i) => {
      row.forEach((elem, j) => {
        Animated.timing(elem.location, {
          toValue: { x: TILE_WIDTH * i, y: TILE_WIDTH * j },
          duration: 250
        }).start();
      });
    });
  }

  renderTiles(dataSource) {
    let tiles = [];
    dataSource.forEach((row, i) => {
      let rows = row.forEach((e, j) => {
        tiles.push(
          <Tile
            location={e.location}
            scale={e.scale}
            key={e.key}
            img = {e.img}
          />
        );
      });
    });
    return tiles
  }

  render() {

    const config = {
      velocityThreshold: 0.11,
      directionalOffsetThreshold: 50
    };

    return (
          <GestureRecognizer
            onLayout={this.onLayout.bind(this)}
            config={config}
            style={styles.gestureContainer}
            onSwipe={(direction, state) => this.onSwipe(direction, state)}
          >
            {this.renderTiles(this.state.tileDataSource)}
          </GestureRecognizer>
    );
  }
}

let Window = Dimensions.get("window");
let windowSpan = Math.min(Window.width, Window.height);
let TILE_WIDTH = windowSpan / 6;

let colored = false

let blue = colored ? "#3c44d8" : null
let red = colored ? "#f24646" : null
let yellow = colored ? "#faff7f" : null
let green = colored ? "#168e3a" : null
let orange = colored ? "#ea0e62" : null
let pink = colored ? "#ff51f3" : null
let white = "#ffffff";

let styles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    width: 300,
    height: 300,
    backgroundColor: blue
  },
  gestureContainer: {
    flex: 1,
    width: TILE_WIDTH * 5,
    height: TILE_WIDTH * 5,
    position: "absolute",
    backgroundColor: green,
  },
});
