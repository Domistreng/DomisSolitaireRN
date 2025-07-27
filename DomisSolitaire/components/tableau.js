import React, { Component } from 'react';
import {
    View,
    Dimensions,
    StyleSheet
} from 'react-native';

const { width } = Dimensions.get('window');
import { cardSize, getColor, getNumber } from './helpers';
import Card from './card';

export default class EmptyDeck extends Component {
    constructor(props) {
        super(props);
        this.deckRef = React.createRef();
        this.state = {
            id: props.id,
            number: props.number,
            cards: props.cards,
            width: cardSize(width).width,
            height: cardSize(width).height,
            highestStack: props.cards.length - 2
        };

        this.deleted = this.deleted.bind(this);
    }

    componentDidMount() {
        // Use the ref instead of string refs
        setTimeout(() => {
            if (this.deckRef.current) {
                this.deckRef.current.measure((fx, fy, width, height, px, py) => {
                    this.setState({ fx, fy, width, height, px, py });
                });
            }
        }, 0);
    }

    belongsInDeck(x, y, card) {
        if (this.state.cards.length == 0) {
            return(false)
        }
        let currentCard = (this.state.cards[this.state.cards.length-1])
        if (getColor(currentCard) == getColor(card))
        {
            return false;
        }
        // console.log(currentCard, card)
        // console.log(getNumber(currentCard))
        const { px, py, width, height, id, number } = this.state;
        if (
            px !== undefined &&
            py !== undefined &&
            (x > px && x < (px + width)) &&
            (y > (py+ 10 * number) && y < (py + height + 10 * number))
        ) {
            console.log('landed on', id);
            console.log(currentCard)
            this.check(card);
            return true;
        }
        return false;
    }

    check(card) {
        // Added card
        this.setState((prevState) => ({
            cards: prevState.cards.concat(card),
            number: prevState.number + 1
        }));
    }

    deleted(id) {
        let { cards } = this.state;
        cards = cards.slice(0, -1); // Remove the last card
        this.setState({
            cards,
            highestStack: cards.length - 2
        });
    }

    renderCards() {
        const { cards, highestStack } = this.state;
        return cards.map((c, i) => {
            if (i + 1 === cards.length) {
                // Top card: draggable
                return (
                    <View key={i} style={{ position: 'absolute', top: 10 * i }}>
                        <Card
                            key={i}
                            faceDown={false}
                            releasedOn={this.props.releasedOn}
                            deleted={this.deleted}
                            draggable={true}
                            source={c}
                        />
                    </View>
                );
            } else if (i > highestStack) {
                // Cards above highestStack: not draggable, face up
                return (
                    <View key={i} style={{ position: 'absolute', top: 10 * i }}>
                        <Card
                            key={i}
                            faceDown={false}
                            releasedOn={this.props.releasedOn}
                            deleted={this.deleted}
                            draggable={false}
                            source={c}
                        />
                    </View>
                );
            } else {
                // Lower cards: face down
                return (
                    <View key={i} style={{ position: 'absolute', top: 10 * i }}>
                        <Card faceDown={true} releasedOn={this.props.releasedOn} />
                    </View>
                );
            }
        });
    }

    render() {
        const { width, height } = this.state;
        return (
            <View ref={this.deckRef} style={{ width, height, margin: 2 }}>
                {this.renderCards()}
            </View>
        );
    }
}
