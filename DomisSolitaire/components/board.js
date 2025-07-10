import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import Foundation from './foundation';
import Card from './card';
import Tableau from './tableau';
import Stock from './stock';

import { createDeck, shuffle } from './helpers';

export default class Board extends Component {
  constructor(props) {
    super(props);

    let deck = shuffle(createDeck());
    // 7 tableau
    let tableau = [];
    for (let i = 0; i < 7; i++) { // Added 'let' for i
      let temp = [];
      for (let j = 0; j <= i; j++) { // Added 'let' for j
        temp.push(deck.pop());
      }
      tableau.push({ id: 't' + i, number: i, cards: temp });
    }

    this.state = {
      foundations: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      tableau: tableau,
      stock: deck,
    };

    // Create refs for foundations and tableau
    this.foundationRefs = {};
    this.tableauRefs = {};

    this.releasedOn = this.releasedOn.bind(this);
  }

  releasedOn(x, y, card) {
    const { foundations, tableau } = this.state;
    let valid = false;

    foundations.forEach((deck) => {
      const ref = this.foundationRefs[deck.id];
      if (ref && ref.current && ref.current.belongsInDeck(x, y, card)) {
        valid = true;
      }
    });

    tableau.forEach((t) => {
      console.log(t)
      let currentCard = (t["cards"][(t["cards"].length - 1)])
      const ref = this.tableauRefs[t.id];
      if (ref && ref.current && ref.current.belongsInDeck(x, y, card, currentCard)) {
        valid = true;
      }
    });

    return valid;
  }

  renderFoundations() {
    const { foundations } = this.state;
    return foundations.map((deck) => {
      // Create ref if it doesn't exist
      if (!this.foundationRefs[deck.id]) {
        this.foundationRefs[deck.id] = React.createRef();
      }
      return (
        <Foundation
          id={deck.id}
          key={deck.id}
          ref={this.foundationRefs[deck.id]}
        />
      );
    });
  }

  renderTableau() {
    const { tableau } = this.state;
    return tableau.map((t, i) => {
      // Create ref if it doesn't exist
      if (!this.tableauRefs[t.id]) {
        this.tableauRefs[t.id] = React.createRef();
      }
      return (
        <Tableau
          ref={this.tableauRefs[t.id]}
          id={t.id}
          number={t.number}
          releasedOn={this.releasedOn}
          key={i}
          cards={t.cards}
        />
      );
    });
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 20, backgroundColor: '#277714' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Stock cards={this.state.stock} releasedOn={this.releasedOn} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            {this.renderFoundations()}
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {this.renderTableau()}
        </View>
      </View>
    );
  }
}
