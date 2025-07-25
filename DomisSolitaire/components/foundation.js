import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Text,
  StyleSheet
} from 'react-native';

const {width, height} = Dimensions.get('window');
import {cardSize} from './helpers';
import Card from './card';

export default class EmptyDeck extends Component {
    constructor(props) {
        super(props);
        this.deckRef = React.createRef();
        this.state = {
            id: props.id,
            cards: [],
            width: cardSize(width).width,
            height: cardSize(width).height,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.deckRef.current) {
                this.deckRef.current.measure((fx, fy, width, height, px, py) => {
                    this.setState({fx, fy, width, height, px, py});
                });
            }
        }, 0);
    }

    check(card) {
        this.setState({cards: this.state.cards.concat(card)});
    }

    belongsInDeck(x, y, card) {
        const {px, py, width, height, id} = this.state;
        if ((x > px && x < (px + width)) && (y > py && y < (py + height))) {
            console.log(card, 'landed on', id);
            this.check(card);
            return true;
        }
        return false;
    }

    renderCards() {
        let {cards} = this.state;
        return cards.map((c, i) => (
            <View key={i} style={{position: 'absolute'}}>
                <Card key={i} faceDown={false} draggable={false} source={c} />
            </View>
        ));
    }

    render() {
        const {width, height} = this.state;
        return (
            <View
                ref={this.deckRef}
                style={{width, height, borderWidth: 1, margin: 2, borderRadius: 5}}
            >
                {this.renderCards()}
            </View>
        );
    }
}
