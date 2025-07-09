import React, { Component } from 'react';
import {
    View,
    Dimensions,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';

const { width } = Dimensions.get('window');
import { cardSize } from './helpers';
import Card from './card';

export default class EmptyDeck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            cards: props.cards || [],
            width: cardSize(width).width,
            height: cardSize(width).height,
        };

        this.nextThree = this.nextThree.bind(this);
        this.deleted = this.deleted.bind(this);
    }

    renderCards() {
        const { cards } = this.state;

        return cards.map((c, i) => {
            // Only render up to three cards
            if (i < 3) {
                return (
                    <View key={i} style={{ position: 'absolute', left: i * 10 }}>
                        <Card
                            releasedOn={this.props.releasedOn}
                            deleted={this.deleted}
                            draggable={i === 2}
                            source={c}
                        />
                    </View>
                );
            }
            return null;
        });
    }

    nextThree() {
        let { cards } = this.state;
        if (cards.length > 0) {
            // Move last three cards to the front (simulate cycling through the deck)
            for (let i = 0; i < 3; i++) {
                cards.unshift(cards.pop());
            }
            this.setState({ cards: [...cards] });
        }
    }

    deleted(id) {
        let { cards } = this.state;
        const index = cards.indexOf(id);
        if (index !== -1) {
            cards.splice(index, 1);
            this.setState({ cards: [...cards] });
        }
    }

    render() {
        const { width, height } = this.state;
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableWithoutFeedback onPress={this.nextThree}>
                    <View style={{ width, height, borderWidth: 1, margin: 2, borderRadius: 5 }}>
                        <Card faceDown={true} />
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ width, height, margin: 2, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.renderCards()}
                    </View>
                </View>
            </View>
        );
    }
}
